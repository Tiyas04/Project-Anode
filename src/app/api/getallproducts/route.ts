import { NextResponse } from "next/server";
import ProductModel from "@/models/product";
import dbConnect from "@/lib/dbconnect";

export async function GET() {
    try {
        await dbConnect()

        const products = await ProductModel.find().sort({ _id: -1 } as any).select("-__v")

        return NextResponse.json(
            {
                success: true,
                message: "Products fetched successfully",
                data: products
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products"
            },
            {
                status: 500
            }
        )
    }
}