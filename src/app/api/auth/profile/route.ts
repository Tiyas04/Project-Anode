import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/user";
import OrderModel from "@/models/order";
import OrderItemsModel from "@/models/orderitem";
import ProductModel from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // CRITICAL: These unused references are required to ensure Mongoose registers the models 
        // before they are used in .populate(). DO NOT REMOVE.
        console.log("Registering models:", !!OrderModel, !!OrderItemsModel, !!ProductModel);

        const userid = request.headers.get("userid")

        const user = await UserModel.findById(userid)
            .select("-password -__v -refreshToken")
            .populate({
                path: "orders",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "orderitems",
                    populate: {
                        path: "productid",
                        model: "Product"
                    }
                }
            });

        return NextResponse.json(
            {
                success: true,
                message: "User found",
                data: user
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                success: false,
                error: (error as Error).message || "Something went wrong"
            },
            {
                status: 500
            }
        )
    }
}