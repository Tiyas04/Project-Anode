import mongoose from "mongoose";
import ProductModel from "@/models/product";
import CartItemsModel from "@/models/cartitem";
import CartModel from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        await dbConnect();

        const userId = request.headers.get("userId");

        // 1. Validate userId
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error("[Cart] Invalid or missing userId:", userId);
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access or Invalid User ID",
                },
                { status: 401 }
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
                { status: 400 }
            );
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
                { status: 404 }
            );
        }

        // Check stock availability
        if (!Product.inStock || Product.stockLevel <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product is out of stock",
                },
                { status: 400 }
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
            await CartItemsModel.findByIdAndUpdate(existingItem._id, {
                $inc: { quantity: 1 },
            });
        } else {
            const cartItem = await CartItemsModel.create({
                cartid: cart._id,
                productid: Product._id,
                quantity: 1,
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
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[Cart] Add to cart FATAL error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add to the cart: " + (error.message || "Unknown Error"),
            },
            { status: 500 }
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
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const { slug } = params;

        const match = slug.match(/(\d+-\d+-\d+)$/);
        const casNumber = match?.[1];

        if (!casNumber) {
            return NextResponse.json(
                { success: false, message: "Invalid product URL/CAS Number" },
                { status: 400 }
            );
        }

        const Product = await ProductModel.findOne({ casNumber });
        if (!Product) {
            return NextResponse.json(
                { success: false, message: "No product found" },
                { status: 404 }
            );
        }

        const cart = await CartModel.findOne({ userid: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return NextResponse.json(
                { success: false, message: "Cart not found" },
                { status: 404 }
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
                $pull: { cartitems: deletedItem._id },
            });
        }

        return NextResponse.json(
            { success: true, message: "Item removed from cart" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[Cart] Delete error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to remove item: " + (error.message || "Unknown") },
            { status: 500 }
        );
    }
}
