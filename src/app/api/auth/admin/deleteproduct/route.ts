import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import ProductModel from "@/models/product";

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Validate Admin Role
        const role = request.headers.get("admin");
        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Admins only" },
                { status: 403 }
            );
        }

        // 2. Extract ID from URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Product ID is required in URL" },
                { status: 400 }
            );
        }

        // 3. Delete Product
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[Delete Product] Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product: " + (error.message || "Unknown error"),
            },
            { status: 500 }
        );
    }
}
