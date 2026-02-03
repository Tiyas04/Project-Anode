import mongoose from "mongoose";
import ProductModel from "@/models/product";
import CartItemsModel from "@/models/cartitem";
import CartModel from "@/models/cart";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        await dbConnect();

        const refreshToken = request.cookies.get("refreshToken")?.value;
        console.log("[Cart Debug] Refresh Token:", refreshToken ? "Found" : "Missing");

        let userId: string | null = null;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET!
                ) as JwtPayload;
                userId = decoded.id;
                console.log("[Cart Debug] Decoded User ID:", userId);
            } catch (error) {
                console.error("[Cart Debug] Invalid token:", error);
            }
        } else {
            console.log("[Cart Debug] No refresh token found");
        }

        // 1. Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error("[Cart] Unauthorized access - No valid userId from token");
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access or Invalid User ID",
                },
                {
                    status: 401
                }
            );
        }

        const { slug } = params;

        // 2. Extract CAS number
        const match = slug.match(/(\d+-\d+-\d+)$/);
        const casNumber = match?.[1];

        if (!casNumber) {
            console.error("[Cart] Invalid slug format:", slug);
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product URL/CAS Number",
                },
                {
                    status: 400
                }
            );
        }

        // Try to parse quantity from body (optional, default 1)
        let quantity = 1;
        try {
            const body = await request.json();
            if (body.quantity && Number(body.quantity) > 0) {
                quantity = Number(body.quantity);
            }
        } catch (e) {
            // Ignore if body is empty or invalid JSON, default to 1
        }

        // 3. Find Product
        const Product = await ProductModel.findOne({ casNumber });

        if (!Product) {
            console.error("[Cart] Product not found for CAS:", casNumber);
            return NextResponse.json(
                {
                    success: false,
                    message: "No product found",
                },
                {
                    status: 404
                }
            );
        }

        // Check stock availability
        if (!Product.inStock || Product.stockLevel <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product is out of stock",
                },
                {
                    status: 400
                }
            );
        }

        // 4. Find or Create Cart
        // Using new mongoose.Types.ObjectId(userId) is safe now because we validated it
        let cart = await CartModel.findOne({ userid: new mongoose.Types.ObjectId(userId) });

        if (!cart) {
            cart = await CartModel.create({
                userid: new mongoose.Types.ObjectId(userId),
                cartitems: [],
            });
        }

        // 5. Add/Update Item
        const existingItem = await CartItemsModel.findOne({
            cartid: cart._id,
            productid: Product._id,
        });

        if (existingItem) {
            if (existingItem.quantity + quantity > Product.stockLevel) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Cannot add more. Only ${Product.stockLevel} items in stock.`
                    },
                    { status: 400 }
                );
            }
            await CartItemsModel.findByIdAndUpdate(existingItem._id, {
                $inc: { quantity: quantity },
            });
        } else {
            if (quantity > Product.stockLevel) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Cannot add more. Only ${Product.stockLevel} items in stock.`
                    },
                    { status: 400 }
                );
            }
            const cartItem = await CartItemsModel.create({
                cartid: cart._id,
                productid: Product._id,
                quantity: quantity,
                price: Product.price,
            });

            cart.cartitems.push(cartItem._id);
            await cart.save();
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product added to cart",
            },
            {
                status: 200
            }
        );
    } catch (error: any) {
        console.error("[Cart] Add to cart FATAL error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add to the cart: " + (error.message || "Unknown Error"),
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        await dbConnect();

        const userId = request.headers.get("userId");

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access or Invalid User ID",
                },
                {
                    status: 401
                }
            );
        }

        const { slug } = params;

        const match = slug.match(/(\d+-\d+-\d+)$/);
        const casNumber = match?.[1];

        if (!casNumber) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product URL/CAS Number",
                },
                {
                    status: 400
                }
            );
        }

        const Product = await ProductModel.findOne({ casNumber });
        if (!Product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No product found",
                },
                {
                    status: 404
                }
            );
        }

        const cart = await CartModel.findOne({ userid: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart not found",
                },
                {
                    status: 404
                }
            );
        }

        // Find and remove the cart item
        const deletedItem = await CartItemsModel.findOneAndDelete({
            cartid: cart._id,
            productid: Product._id,
        });

        if (deletedItem) {
            // Remove reference from Cart array
            await CartModel.findByIdAndUpdate(cart._id, {
                $pull: {
                    cartitems: deletedItem._id
                },
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Item removed from cart"
            },
            {
                status: 200
            }
        );
    } catch (error: any) {
        console.error("[Cart] Delete error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove item: " + (error.message || "Unknown")
            },
            {
                status: 500
            }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get("userId");
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const url = request.nextUrl.pathname;
        const match = url.match(/(\d+-\d+-\d+)$/);
        const casNumber = match?.[1];

        if (!casNumber) {
            return NextResponse.json(
                { success: false, message: "Invalid product URL/CAS Number" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { quantity } = body;

        if (!quantity || quantity <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid quantity" },
                { status: 400 }
            );
        }

        const Product = await ProductModel.findOne({ casNumber });
        if (!Product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        if (quantity > Product.stockLevel) {
            return NextResponse.json(
                { success: false, message: `Only ${Product.stockLevel} items in stock.` },
                { status: 400 }
            );
        }

        const cart = await CartModel.findOne({ userid: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
            );
        }

        const updatedItem = await CartItemsModel.findOneAndUpdate(
            {
                cartid: cart._id,
                productid: Product._id
            },
            {
                $set: { quantity: quantity }
            },
            { new: true }
        );

        if (!updatedItem) {
            return NextResponse.json(
                { success: false, message: "Item not in cart" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Cart updated successfully",
                data: updatedItem,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Cart Update Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update cart" },
            { status: 500 }
        );
    }
}
