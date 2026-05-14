import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Visitor } from "@/models/Visitor";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
    try {
        const isAuthorized = await verifyAuth();
        if (!isAuthorized) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Son 30 günlük veriyi çek
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const stats = await Visitor.aggregate([
            {
                $match: {
                    timestamp: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$ipHash" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    views: "$count",
                    unique: { $size: "$uniqueVisitors" },
                    _id: 0
                }
            },
            { $sort: { date: 1 } }
        ]);

        // En çok ziyaret edilen sayfalar
        const topPages = await Visitor.aggregate([
            {
                $group: {
                    _id: "$path",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        return NextResponse.json({
            daily: stats,
            topPages: topPages.map(p => ({ path: p._id, count: p.count }))
        });
    } catch (error) {
        console.error("Analytics stats error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
