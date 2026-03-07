import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage extends Document {
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
