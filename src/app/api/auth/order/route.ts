import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import CartModel from "@/models/cart";
import CartItemsModel from "@/models/cartitem";
import OrderModel from "@/models/order";
import OrderItemsModel from "@/models/orderitem";
import CheckOutModel from "@/models/checkout";
import mongoose from "mongoose";
import streamUpload from "@/lib/uploadoncloudinary";
import UserModel from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        /* ─────────── 1️⃣ VALIDATE USER ─────────── */
        const userId = request.headers.get("userId");
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        /* ─────────── 2️⃣ VALIDATE FORM DATA ─────────── */
        const formData = await request.formData();
        const fullName = formData.get("fullName") as string;
        const email = formData.get("email") as string;
        const company = formData.get("company") as string;
        const address = formData.get("address") as string;
        const city = formData.get("city") as string;
        const state = formData.get("state") as string;
        const pincode = formData.get("pincode") as string;
        const permissionproof = formData.get("permissionproof") as File;

        const requiredFields = { fullName, email, address, city, state, pincode, permissionproof };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { success: false, message: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        /* ─────────── 3️⃣ UPLOAD PROOF ─────────── */
        // Upload early to fail fast if upload fails, before DB writes.
        let proofUrl = "";
        try {
            const arrayBuffer = await permissionproof.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadResult = await streamUpload(buffer);
            proofUrl = uploadResult.secure_url;
        } catch (uploadError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to upload permission proof"
                },
                {
                    status: 500
                }
            );
        }

        /* ─────────── 4️⃣ FETCH & VALIDATE CART ─────────── */
        const cartData = await CartModel.aggregate([
            { $match: { userid: new mongoose.Types.ObjectId(userId) } },
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
                    items: {
                        $map: {
                            input: "$cartitems",
                            as: "item",
                            in: {
                                product: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$products",
                                                as: "p",
                                                cond: {
                                                    $eq: ["$$p._id", "$$item.productid"]
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                quantity: "$$item.quantity",
                                price: "$$item.price",
                            },
                        },
                    },
                },
            },
        ]);

        if (!cartData.length || !cartData[0].items || cartData[0].items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart is empty"
                },
                {
                    status: 400
                }
            );
        }

        // Filter out items where the product might have been deleted (product is null)
        const validItems = cartData[0].items.filter((item: any) => item.product && item.product._id);

        if (validItems.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Cart contains only invalid/deleted products"
                },
                {
                    status: 400
                }
            );
        }

        const totalAmount = validItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
        );

        /* ─────────── 5️⃣ CREATE DB RECORDS ─────────── */
        // Create Order
        const order = await OrderModel.create({
            userid: new mongoose.Types.ObjectId(userId),
            orderitems: [],
            totalamount: totalAmount,
            status: "ordered",
        });

        // Create Order Items
        const orderItemIds: mongoose.Types.ObjectId[] = [];
        for (const item of validItems) {
            const orderItem = await OrderItemsModel.create({
                orderid: order._id,
                productid: item.product._id,
                quantity: item.quantity,
                price: item.price,
            });
            orderItemIds.push(orderItem._id);
        }

        // Update Order with Items
        order.orderitems = orderItemIds;
        await order.save();

        // 🆕 UPDATE USER with Order ID
        await UserModel.findByIdAndUpdate(userId, {
            $push: { orders: order._id }
        });

        // Create Checkout
        await CheckOutModel.create({
            orderid: order._id,
            fullName,
            email,
            company,
            address,
            city,
            state,
            pincode,
            permissionproof: proofUrl,
            paymentMethod: "COD",
        });

        /* ─────────── 6️⃣ CLEAR CART ─────────── */
        await CartItemsModel.deleteMany({ cartid: cartData[0]._id });
        await CartModel.findOneAndUpdate(
            {
                userid: new mongoose.Types.ObjectId(userId)
            },
            {
                $set: {
                    cartitems: []
                }
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Order placed successfully",
                orderId: order._id,
                totalAmount,
            },
            {
                status: 201
            }
        );

    } catch (error: any) {
        console.error("[PLACE ORDER ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to place order",
                error: error.message,
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
        const { status } = await request.json()

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access"
                },
                {
                    status: 401
                }
            );
        }

        const url = new URL(request.url);
        const orderId = url.searchParams.get("id");

        if (!orderId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order ID is required"
                },
                {
                    status: 400
                }
            );
        }

        if (!status) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No status provided"
                },
                {
                    status: 404
                }
            )
        }

        const isAdmin = request.headers.get("admin") === "admin";

        console.log("[DEBUG PATCH ORDER]", {
            userId,
            adminHeader: request.headers.get("admin"),
            orderId,
            isAdmin
        });

        // Build query - Admins can access any order, Users only their own
        const query: any = { _id: new mongoose.Types.ObjectId(orderId) };
        if (!isAdmin) {
            query.userid = new mongoose.Types.ObjectId(userId);
        }

        const order = await OrderModel.findOne(query);

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found"
                },
                {
                    status: 404
                }
            );
        }

        // Status validation
        // Users can only cancel orders that are pending or ordered
        if (!isAdmin && ["shipped", "delivered", "cancelled"].includes(order.status)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Cannot modify order with status: ${order.status}`
                },
                {
                    status: 400
                }
            );
        }

        order.status = status;
        await order.save({ validateBeforeSave: false });

        return NextResponse.json(
            {
                success: true,
                message: "Order status updated successfully",
                order
            },
            {
                status: 200
            }
        );

    } catch (error: any) {
        console.error("[CANCEL ORDER ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to cancel order",
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get("userId");

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User ID not found",
                },
                {
                    status: 400
                }
            );
        }

        const orderdata = await OrderModel.aggregate([
            {
                $match: {
                    userid: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderitems",
                    foreignField: "_id",
                    as: "orderitems",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "orderitems.productid",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    totalamount: 1,
                    createdAt: 1,
                    items: {
                        $map: {
                            input: "$orderitems",
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

        return NextResponse.json(
            {
                success: true,
                message: "Orders fetched successfully",
                data: orderdata,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to get orders",
            },
            {
                status: 500
            }
        );
    }
}