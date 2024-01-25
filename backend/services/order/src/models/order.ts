import mongoose, { Document, Schema } from "mongoose";

interface ICream {
  id: string;
  name: string;
  price: number;
}

interface ITopping {
  id: string;
  name: string;
  price: number;
}

interface IExtra {
  id: string;
  name: string;
  price: number;
}

interface IOrderDocument extends Document {
  name?: string;
  size: string;
  paymentMethod: string;
  isPaid: boolean;
  maxCreamsAllowed: number;
  maxToppingsAllowed: number;
  price: number;
  totalPrice: number;
  status: "recieved" | "making" | "delivering" | "done";
  creams: ICream[];
  toppings?: ITopping[];
  extras?: IExtra[];
  userId: string;
}

const creamSchema = new Schema<ICream>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const toppingSchema = new Schema<ITopping>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const extraSchema = new Schema<IExtra>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrderDocument>({
  name: { type: String },
  size: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  isPaid: { type: Boolean, required: true },
  maxCreamsAllowed: { type: Number, required: true },
  maxToppingsAllowed: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["received", "making", "delivering", "done"],
    required: true,
  },
  creams: [creamSchema],
  toppings: [toppingSchema],
  extras: [extraSchema],
  userId: { type: String, required: true },
});

const OrderModel = mongoose.model<IOrderDocument>("Order", orderSchema);

export { OrderModel, IOrderDocument };
