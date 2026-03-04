import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
        }

        const toEmail = process.env.CONTACT_TO_EMAIL || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

        await resend.emails.send({
            from: `Portfolio Contact <onboarding@resend.dev>`,
            to: [toEmail],
            replyTo: email,
            subject: `📬 Yeni mesaj: ${name}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #0b1120; color: #f3f4f6; border-radius: 12px;">
          <h2 style="color: #06b6d4; margin-bottom: 1.5rem;">📬 Yeni İletişim Mesajı</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0.5rem 0; color: #9ca3af; width: 80px;">İsim:</td>
              <td style="padding: 0.5rem 0; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; color: #9ca3af;">E-Posta:</td>
              <td style="padding: 0.5rem 0;"><a href="mailto:${email}" style="color: #06b6d4;">${email}</a></td>
            </tr>
          </table>
          <hr style="border: 1px solid #374151; margin: 1.5rem 0;" />
          <p style="color: #9ca3af; margin-bottom: 0.5rem;">Mesaj:</p>
          <p style="background: #111827; padding: 1rem; border-radius: 8px; line-height: 1.7;">${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Contact email error:", error);
        return NextResponse.json({ error: "Mesaj gönderilemedi." }, { status: 500 });
    }
}
