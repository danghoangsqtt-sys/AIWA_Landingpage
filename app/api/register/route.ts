const driveUrl = "https://drive.google.com/drive/folders/1jhyq-QWw33Zqf9Gp6lpl_ZxcmfOTVVLF?usp=sharing";
const zaloUrl = "https://zalo.me/0343019101";
const defaultLeadStatus = {
  freeKey: "Chờ cấp",
  purchaseStatus: "Chưa mua",
  engagementStatus: "Chưa xác định",
  supportGroupStatus: "Chưa tham gia",
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character] || character));
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    if (clean(payload.website, 200)) return Response.json({ ok: true, emailSent: false, sheetSynced: false });

    const fullName = clean(payload.fullName, 80);
    const phone = clean(payload.phone, 20);
    const email = clean(payload.email, 120).toLowerCase();
    if (fullName.length < 2) return Response.json({ error: "Vui lòng nhập họ và tên hợp lệ." }, { status: 400 });
    if (!/^[0-9+ .()-]{8,20}$/.test(phone)) return Response.json({ error: "Vui lòng nhập số điện thoại hợp lệ." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Vui lòng nhập địa chỉ email hợp lệ." }, { status: 400 });

    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const sheetsWebhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    if (!sheetsWebhookUrl || !sheetsWebhookSecret) {
      console.error("Missing Google Sheets webhook configuration");
      return Response.json({ error: "Hệ thống đang được cấu hình. Vui lòng liên hệ Zalo 0343 019 101 để nhận key." }, { status: 503 });
    }

    const trialStartedAt = new Date().toISOString();
    const sheetResponse = await fetch(sheetsWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: sheetsWebhookSecret,
        fullName,
        phone,
        email,
        trialStartedAt,
        ...defaultLeadStatus,
      }),
      cache: "no-store",
    });
    const sheetResult = (await sheetResponse.json().catch(() => null)) as { ok?: boolean; row?: number } | null;
    if (!sheetResponse.ok || sheetResult?.ok !== true) {
      console.error("Google Sheets webhook rejected registration", sheetResult);
      return Response.json({ error: "Hệ thống chưa thể ghi nhận đăng ký. Vui lòng thử lại hoặc liên hệ Zalo 0343 019 101." }, { status: 502 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFromEmail = process.env.RESEND_FROM_EMAIL;
    let emailSent = false;

    if (resendApiKey && resendFromEmail) {
      try {
        const guideUrl = new URL("/huong-dan", request.url).toString();
        const safeName = escapeHtml(fullName);
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: resendFromEmail,
            to: [email],
            subject: "Cảm ơn bạn đã đăng ký dùng thử AIWA 15 ngày",
            html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#173553;line-height:1.7"><div style="background:#092e6d;color:#fff;padding:26px 30px;border-radius:16px 16px 0 0"><b style="font-size:28px;letter-spacing:.15em">AIWA</b><div>by DHSystem</div></div><div style="border:1px solid #dce8f4;border-top:0;padding:30px;border-radius:0 0 16px 16px"><h1 style="font-size:24px">Cảm ơn ${safeName} đã đăng ký!</h1><p>DHSystem rất vui được đồng hành cùng bạn trong 15 ngày trải nghiệm AIWA—trợ lý hỗ trợ soạn thảo và nghiên cứu ngay trong Microsoft Word.</p><p><a href="${driveUrl}" style="display:inline-block;background:#0879e7;color:#fff;text-decoration:none;font-weight:bold;padding:13px 20px;border-radius:9px">Tải bộ cài AIWA</a></p><p><a href="${guideUrl}">Xem trang hướng dẫn sử dụng</a> · <a href="${zaloUrl}">Liên hệ Zalo nhận key</a></p><p style="color:#66798e;font-size:13px">Nếu cần hỗ trợ, vui lòng liên hệ Zalo 0343 019 101.</p></div></div>`,
            text: `Cảm ơn ${fullName} đã đăng ký dùng thử AIWA 15 ngày. Tải bộ cài: ${driveUrl}. Hướng dẫn: ${guideUrl}. Liên hệ Zalo nhận key: ${zaloUrl}.`,
          }),
        });
        emailSent = emailResponse.ok;
        if (!emailSent) console.error("Resend rejected thank-you email", await emailResponse.text());
      } catch (error) {
        console.error("AIWA thank-you email failed", error);
      }
    }

    return Response.json({ ok: true, emailSent, sheetSynced: true }, { status: 201 });
  } catch (error) {
    console.error("AIWA registration failed", error);
    return Response.json({ error: "Hệ thống chưa thể ghi nhận đăng ký. Vui lòng thử lại hoặc liên hệ Zalo 0343 019 101." }, { status: 500 });
  }
}
