import mongoose from "mongoose";
import ProductModel from "@/models/product";
import UserModel from "@/models/user";
import CartItemsModel from "@/models/cartitem";
import CartModel from "@/models/cart";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get("userId")

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access"
                },
                {
                    status: 401
                }
            )
        }

        const url = request.nextUrl.pathname;

        const match = url.match(/(\d+-\d+-\d+)$/);

        const casNumber = match?.[1];

        if (!casNumber) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product URL"
                },
                {
                    status: 400
                }
            )
        }

        const Product = await ProductModel.findOne({ casNumber })

        if (!Product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No product found"
                },
                {
                    status: 404
                }
            )
        }

        let cart = await CartModel.findOne({ userid: new mongoose.Types.ObjectId(userId) })

        if (!cart) {
            cart = await CartModel.create({
                userid: new mongoose.Types.ObjectId(userId),
                cartitems: []
            })
        }

        const existingItem = await CartItemsModel.aggregate(
            [
                {
                    $match: {
                        cartid: cart._id,
                        productid: Product._id
                    }
                }
            ]
        )

        if (existingItem.length > 0) {
            await CartItemsModel.findByIdAndUpdate(
                existingItem[0]._id,
                {
                    $inc: {
                        quantity: 1
                    }
                }
            )
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

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add to the cart"
            },
            {
                status: 500
            }
        )
    }
}



export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        const cartData = await CartModel.aggregate([
            {
                $match: {
                    userid: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "cartitems",
                    localField: "cartitems",
                    foreignField: "_id",
                    as: "cartitems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "cartitems.productid",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 0,
                    items: {
                        $map: {
                            input: "$cartitems",
                            as: "item",
                            in: {
                                quantity: "$$item.quantity",
                                price: "$$item.price",
                                product: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$products",
                                                as: "product",
                                                cond: {
                                                    $eq: ["$$product._id", "$$item.productid"],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        ]);

        if (!cartData.length) {
            return NextResponse.json(
                { success: true, message: "Cart is empty", data: [] },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Cart fetched successfully",
                data: cartData[0].items,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch cart" },
            { status: 500 }
        );
    }
}
