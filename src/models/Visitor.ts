import mongoose from "mongoose";

export interface IVisitor {
    ipHash: string;
    userAgent: string;
    path: string;
    timestamp: Date;
}

const visitorSchema = new mongoose.Schema<IVisitor>({
    ipHash: { type: String, required: true },
    userAgent: { type: String, required: true },
    path: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const Visitor = mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", visitorSchema);
