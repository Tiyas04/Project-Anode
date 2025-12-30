import ProductModel from "@/models/product";
import dbConnect from "@/lib/dbconnect";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get("userId")
        const role = request.headers.get("role")

        if (!userId || role !== "admin") {
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

        const body = await request.json()

        const { casNumber, price, quantity, inStock, stockLevel } = body

        if (!casNumber || !price || !quantity || !inStock || !stockLevel) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields"
                },
                {
                    status: 400
                }
            )
        }

        const product = await ProductModel.findOne({ casNumber })

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found"
                },
                {
                    status: 404
                }
            )
        }

        product.price = price
        product.quantity = quantity
        product.inStock = inStock
        product.stockLevel = stockLevel

        await product.save()

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully"
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
                message: "Internal server error"
            },
            {
                status: 500
            }
        )
    }
}