import { NextRequest, NextResponse } from "next/server";
import { POST, GET } from "@/app/api/comments/route";
import { Comment } from "@/models/Comment";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { rateLimit } from "@/lib/rate-limit";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    // Veritabanını temizle
    await Comment.deleteMany({});
    // Rate limit resetle
    rateLimit.store.clear();
});

function mockRequest(body?: any, ip: string = "127.0.0.1", method: string = "POST", url: string = "http://localhost/api/comments") {
    return new NextRequest(new URL(url), {
        method,
        headers: new Headers({
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
        }),
        body: body ? JSON.stringify(body) : undefined,
    });
}

describe("Comments API integration tests", () => {

    it("should successfully create a new comment, unapproved", async () => {
        const req = mockRequest({
            postSlug: "test-post",
            name: "John Doe",
            content: "This is a great post!"
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(201);
        expect(data.name).toBe("John Doe");
        expect(data.isApproved).toBe(false);

        const dbComment = await Comment.findById(data._id);
        expect(dbComment).toBeTruthy();
        expect(dbComment?.content).toBe("This is a great post!");
    });

    it("should reject excessively long input", async () => {
        const req = mockRequest({
            postSlug: "test-post",
            name: "A".repeat(51),
            content: "This is a great post!"
        });

        const res = await POST(req);
        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.error).toBe("Girdi çok uzun");
    });

    it("should sanitize malicious XSS payloads", async () => {
        const req = mockRequest({
            postSlug: "test-post",
            name: "Hacker <script>alert('xss')</script>",
            content: "payload <img src='x' onerror='alert(1)'> here"
        });

        const res = await POST(req);
        expect(res.status).toBe(201);

        const dbComment = await Comment.findOne({ postSlug: "test-post" });
        expect(dbComment?.name).not.toContain("<script>");
        expect(dbComment?.content).not.toContain("onerror");
        // DOMPurify removes malicious tags
        expect(dbComment?.name).toBe("Hacker");
        expect(dbComment?.content).toBe("payload <img src=\"x\"> here");
    });

    it("should return 429 after exceeding rate limit", async () => {
        const body = {
            postSlug: "test-post",
            name: "Spammer",
            content: "Spam!"
        };

        // Use up the limit
        for (let i = 0; i < rateLimit.maxRequests; i++) {
            await POST(mockRequest(body, "10.0.0.1"));
        }

        // This request should be blocked
        const blockedRes = await POST(mockRequest(body, "10.0.0.1"));
        expect(blockedRes.status).toBe(429);

        const data = await blockedRes.json();
        expect(data.error).toContain("Çok fazla istek yapıldı");
    });

});
