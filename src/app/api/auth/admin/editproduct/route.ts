import ProductModel from "@/models/product";
import dbConnect from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get("userId");
        const role = request.headers.get("role");

        // Get ID from URL Query Params
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!userId || role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Product ID is required in URL" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { price, quantity, inStock, stockLevel } = body;

        // Validate required fields (allow partial updates? User code checked all. Keeping checked.)
        if (!price || !quantity || !stockLevel) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const product = await ProductModel.findById(id);

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        product.price = price;
        product.quantity = quantity;
        product.inStock = inStock;
        product.stockLevel = stockLevel;

        await product.save();

        return NextResponse.json(
            { success: true, message: "Product updated successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Edit Product Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}