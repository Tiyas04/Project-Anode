import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import OrderModel from "@/models/order";
import CheckOutModel from "@/models/checkout";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Check Admin Access (Assuming headers or middleware handles this, checking header 'admin' as seen in other files)
        const isAdmin = request.headers.get("admin");
        if (isAdmin !== "admin") {
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

        // However, I'll focus on the aggregation logic first.

        const orders = await OrderModel.aggregate([
            {
                $lookup: {
                    from: "checkouts",
                    localField: "_id",
                    foreignField: "orderid",
                    as: "checkout",
                },
            },
            {
                $unwind: {
                    path: "$checkout",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderitems",
                    foreignField: "_id",
                    as: "items",
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productid",
                    foreignField: "_id",
                    as: "productDetails",
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
                    customer: {
                        name: "$checkout.fullName",
                        email: "$checkout.email",
                        proof: "$checkout.permissionproof", // This is the image URL
                        address: "$checkout.address",
                        city: "$checkout.city",
                        state: "$checkout.state",
                        pincode: "$checkout.pincode",
                    },
                    itemCount: { $size: "$items" }
                },
            },
        ]);

        return NextResponse.json(
            {
                success: true,
                message: "All orders fetched successfully",
                data: orders,
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("[ADMIN ALL ORDERS ERROR]", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch orders",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
