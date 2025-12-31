import dbConnect from "@/lib/dbconnect";
import OrderModel from "@/models/order";
import OrderItemsModel from "@/models/orderitem";
import CheckOutModel from "@/models/checkout";
import UserModel from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        // Basic Admin Check
        const isAdmin = request.headers.get("admin") === "admin";
        if (!isAdmin) {
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

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("id");

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

        // Find the order first to retrieve linked data (items, user)
        const order = await OrderModel.findById(orderId);
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

        // 1. Delete associated Checkout details
        await CheckOutModel.findOneAndDelete({ orderid: orderId });

        // 2. Delete associated Order Items
        if (order.orderitems && order.orderitems.length > 0) {
            await OrderItemsModel.deleteMany({ _id: { $in: order.orderitems } });
        }

        // 3. Update User: Pull order ID from their orders array
        if (order.userid) {
            await UserModel.findByIdAndUpdate(order.userid, {
                $pull: { orders: orderId }
            });
        }

        // 4. Delete the Order itself
        await OrderModel.findByIdAndDelete(orderId);

        return NextResponse.json(
            {
                success: true,
                message: "Order deleted successfully"
            },
            {
                status: 200
            }
        );

    } catch (error: any) {
        console.error("Delete order error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete order",
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}
