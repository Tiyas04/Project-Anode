import mongoose, { Document } from "mongoose";

export interface CheckOut extends Document{
    order: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "COD";
}

const CheckOutSchema = new mongoose.Schema<CheckOut>(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
        fullName: {
            type: String,
            required: true,
            index:true,
            trim:true
        },
        email: {
            type: String,
            required: true,
            index:true,
            trim:true,
            toLowerCase:true
        },
        company: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            default: "COD"
        }
    },
    {
        timestamps: true
    }
)

const CheckOutModel = (mongoose.models.CheckOut as mongoose.Model<CheckOut>) || mongoose.model("CheckOut", CheckOutSchema)

export default CheckOutModel