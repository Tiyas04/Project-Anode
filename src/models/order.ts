import mongoose, { Document, Schema } from "mongoose"

export interface Order extends Document {
    userid: mongoose.Schema.Types.ObjectId
    orderitems: mongoose.Schema.Types.ObjectId[]
    totalamount: number
    status: string
}

const OrderSchema: Schema<Order> = new Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        orderitems: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderItems"
        }],
        totalamount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
)

const OrderModel = (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model("Order", OrderSchema)

export default OrderModel