import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const key = new TextEncoder().encode(SECRET_KEY);

interface Session extends JWTPayload {
    role: string;
    expires: Date;
}

export async function encrypt(payload: Session) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload as Session;
    } catch (_error) {
        return null;
    }
}

export async function login(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        console.error("ADMIN_PASSWORD is not defined in environment variables");
        return false;
    }


    if (password === adminPassword) {
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat
        const session = await encrypt({ role: "admin", expires });

        (await cookies()).set("session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return true;
    }
    return false;
}

export async function logout() {
    (await cookies()).set("session", "", {
        expires: new Date(0),
        path: "/",
    });
}

export async function getSession(): Promise<Session | null> {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export const verifyAuth = async () => {
    const session = await getSession();
    return !!session;
};
