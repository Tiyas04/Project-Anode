import dbConnect from "@/lib/dbconnect";
import ProductModel from "@/models/product";
import { NextRequest, NextResponse } from "next/server";
import streamUpload from "@/lib/uploadoncloudinary";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get("userId");
        const role = request.headers.get("role");

        if (!userId || role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "unauthorized access",
                },
                {
                    status: 403,
                }
            );
        }

        const formData = await request.formData();

        const name = formData.get("name") as string;
        const formula = formData.get("formula") as string;
        const casNumber = formData.get("casNumber") as string;
        const category = formData.get("category") as string;
        const price = formData.get("price") as string;
        const quantity = formData.get("quantity") as string;
        const description = formData.get("description") as string;
        const purity = formData.get("purity") as string;
        const molecularWeight = formData.get("molecularWeight") as string;
        const hazardsRaw = formData.get("hazards");
        const inStock = formData.get("inStock") as string;
        const stockLevel = formData.get("stockLevel") as string;
        const imageFile = formData.get("image") as File;

        if (
            !name ||
            !formula ||
            !casNumber ||
            !category ||
            !price ||
            !quantity ||
            !description ||
            !purity ||
            !molecularWeight ||
            !hazardsRaw ||
            !inStock ||
            !stockLevel ||
            !imageFile
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Missing required fields: ${[
                        !name && "name",
                        !formula && "formula",
                        !casNumber && "casNumber",
                        !category && "category",
                        !price && "price",
                        !quantity && "quantity",
                        !description && "description",
                        !purity && "purity",
                        !molecularWeight && "molecularWeight",
                        !hazardsRaw && "hazards",
                        !inStock && "inStock",
                        !stockLevel && "stockLevel",
                        !imageFile && "image"
                    ]
                        .filter(Boolean)
                        .join(", ")}`,
                },
                {
                    status: 400,
                }
            );
        }

        const existingProduct = await ProductModel.findOne({ casNumber });

        if (existingProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product already exists",
                },
                {
                    status: 400,
                }
            );
        }

        // Upload image to Cloudinary
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await streamUpload(buffer);
        const imageUrl = uploadResult.secure_url;

        // Parse hazards if it's a string (likely JSON stringified array)
        let hazards: string[] = [];
        if (typeof hazardsRaw === 'string') {
            try {
                hazards = JSON.parse(hazardsRaw);
            } catch (e) {
                // If not JSON, maybe just a single item or comma separated
                hazards = hazardsRaw.split(',').map(h => h.trim());
            }
        }

        const product = await ProductModel.create({
            name,
            formula,
            casNumber,
            category,
            price: Number(price),
            quantity,
            description,
            purity,
            molecularWeight: Number(molecularWeight),
            hazards,
            inStock: inStock === 'true',
            stockLevel: Number(stockLevel),
            image: imageUrl,
            seller: new mongoose.Types.ObjectId(userId)
        });

        const uploadedProduct = await ProductModel.findById(product._id).select("-_id -__v")

        return NextResponse.json(
            {
                success: true,
                message: "Product added successfully",
                data: uploadedProduct,
            },
            {
                status: 201,
            }
        );

    } catch (error: any) {
        console.error("Error adding product:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                error: error.message
            },
            {
                status: 500,
            }
        );
    }
}