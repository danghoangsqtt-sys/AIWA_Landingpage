"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const zaloUrl = "https://zalo.me/0343019101";

type ResultState = {
  kind: "idle" | "loading" | "success" | "error";
  message?: string;
  emailSent?: boolean;
  sheetSynced?: boolean;
};

export default function RegistrationPage() {
  const [result, setResult] = useState<ResultState>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (result.kind === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setResult({ kind: "loading" });

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          phone: data.get("phone"),
          email: data.get("email"),
          website: data.get("website"),
        }),
      });
      const payload = (await response.json()) as { error?: string; emailSent?: boolean; sheetSynced?: boolean };
      if (!response.ok) throw new Error(payload.error || "Không thể gửi đăng ký lúc này.");

      setResult({
        kind: "success",
        emailSent: payload.emailSent,
        sheetSynced: payload.sheetSynced,
        message: payload.emailSent
          ? "Email cảm ơn và link tải bộ cài đã được gửi. Thông tin của bạn đã được ghi nhận để DHSystem theo dõi quá trình dùng thử."
          : "Thông tin đã được ghi nhận để DHSystem hỗ trợ quá trình dùng thử. Đang kết nối bạn với Zalo của đội ngũ tác giả…",
      });
      form.reset();
      window.setTimeout(() => window.location.assign(zaloUrl), 1500);
    } catch (error) {
      setResult({ kind: "error", message: error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại." });
    }
  }

  return (
    <main className="subpage registration-page">
      <header className="subpage-header">
        <Link className="subpage-brand" href="/"><span className="subpage-logo">A</span><span><strong>AIWA</strong><small>by DHSystem</small></span></Link>
        <nav aria-label="Điều hướng trang đăng ký"><Link href="/">Trang chủ</Link><Link href="/huong-dan">Hướng dẫn sử dụng</Link></nav>
        <Link className="button button-small" href="/">Quay lại</Link>
      </header>

      <section className="registration-shell">
        <div className="registration-copy">
          <span className="subpage-kicker">TRẢI NGHIỆM KHÔNG RỦI RO</span>
          <h1>Nhận key AIWA <em>miễn phí trong 15&nbsp;ngày</em></h1>
          <p>Điền thông tin để nhận thư cảm ơn, link tải bộ cài và được kết nối trực tiếp với đội ngũ tác giả qua Zalo.</p>
          <div className="registration-benefits">
            <span><b>01</b><i>Nhận link tải bộ cài qua email</i></span>
            <span><b>02</b><i>Kết nối Zalo 0343 019 101</i></span>
            <span><b>03</b><i>Được hỗ trợ cài đặt và kích hoạt</i></span>
          </div>
          <div className="secure-note"><strong>✓ Thông tin được bảo vệ</strong><small>DHSystem chỉ sử dụng dữ liệu để gửi tài liệu và hỗ trợ trải nghiệm AIWA.</small></div>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span>15</span><div><strong>Đăng ký nhận key</strong><small>Hoàn thành trong chưa đầy 1 phút</small></div></div>
          <label>Họ và tên<input name="fullName" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Ví dụ: Nguyễn Minh Anh" required /></label>
          <label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+ .()-]{8,20}" placeholder="Ví dụ: 0912 345 678" required /></label>
          <label>Địa chỉ email<input name="email" type="email" autoComplete="email" maxLength={120} placeholder="ban@example.com" required /></label>
          <label className="honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          <label className="consent"><input name="consent" type="checkbox" required /><span>Tôi đồng ý để DHSystem sử dụng thông tin trên nhằm gửi link tải, hỗ trợ kích hoạt và liên hệ về sản phẩm AIWA.</span></label>
          <button className="button button-primary registration-submit" type="submit" disabled={result.kind === "loading"}>
            {result.kind === "loading" ? "Đang gửi thông tin…" : "Nhận ngay key dùng thử 15 ngày"}<span>→</span>
          </button>
          {result.kind === "error" && <div className="form-message error" role="alert">{result.message}</div>}
          {result.kind === "success" && <div className="form-message success" role="status"><b>Đăng ký thành công!</b><span>{result.message}</span><a href={zaloUrl}>Mở Zalo ngay</a></div>}
          <small className="form-footnote">Thông tin đăng ký được lưu để cấp key, theo dõi thời gian dùng thử và hỗ trợ bạn tốt hơn. Bạn có thể yêu cầu ngừng liên hệ bất cứ lúc nào qua Zalo 0343 019 101.</small>
        </form>
      </section>
    </main>
  );
}
