import Link from "next/link";

const driveUrl = "https://drive.google.com/drive/folders/1jhyq-QWw33Zqf9Gp6lpl_ZxcmfOTVVLF?usp=sharing";

export default function GuidePage() {
  return (
    <main className="subpage guide-page">
      <header className="subpage-header">
        <Link className="subpage-brand" href="/"><span className="subpage-logo">A</span><span><strong>AIWA</strong><small>by DHSystem</small></span></Link>
        <nav aria-label="Điều hướng trang hướng dẫn"><Link href="/">Trang chủ</Link><Link href="/dang-ky">Nhận key 15 ngày</Link></nav>
        <Link className="button button-small" href="/dang-ky">Đăng ký ngay</Link>
      </header>

      <section className="guide-hero">
        <div>
          <span className="subpage-kicker">TRUNG TÂM HƯỚNG DẪN AIWA</span>
          <h1>Cài đặt và làm quen<br/><em>chỉ trong vài phút</em></h1>
          <p>Từ tải bộ cài, kích hoạt key đến sử dụng thanh công cụ AIWA trong Microsoft Word—mọi bước đều được trình bày rõ ràng và dễ thực hiện.</p>
          <div className="guide-actions">
            <a className="button button-primary" href={driveUrl} target="_blank" rel="noreferrer">Tải bộ cài từ Google Drive <span>↗</span></a>
            <span className="button video-placeholder" aria-disabled="true">Video YouTube · Sắp cập nhật</span>
          </div>
        </div>
        <div className="guide-visual" aria-hidden="true"><div className="play-ring">▶</div><strong>AIWA</strong><span>Hướng dẫn sử dụng từ DHSystem</span></div>
      </section>

      <section className="guide-steps">
        <div className="guide-heading"><span className="subpage-kicker">QUY TRÌNH ĐỀ XUẤT</span><h2>Ba bước bắt đầu với AIWA</h2><p>Thực hiện tuần tự để cài đặt và kích hoạt thuận lợi.</p></div>
        <div className="guide-grid">
          <article><b>01</b><span>↓</span><h3>Tải bộ cài</h3><p>Mở thư mục Google Drive của DHSystem và tải phiên bản AIWA phù hợp về máy tính.</p><a href={driveUrl} target="_blank" rel="noreferrer">Mở Google Drive ↗</a></article>
          <article><b>02</b><span>⚙</span><h3>Cài đặt add-in</h3><p>Đóng Microsoft Word, chạy bộ cài và làm theo hướng dẫn hiển thị trên màn hình.</p></article>
          <article><b>03</b><span>✓</span><h3>Kích hoạt key</h3><p>Mở Word, chọn thẻ AIWA và nhập key dùng thử được đội ngũ DHSystem cung cấp.</p><Link href="/dang-ky">Nhận key 15 ngày →</Link></article>
        </div>
      </section>

      <section className="guide-support">
        <div><span>?</span><div><strong>Cần hỗ trợ trực tiếp?</strong><p>Đội ngũ tác giả sẵn sàng hướng dẫn cài đặt và kích hoạt AIWA qua Zalo.</p></div></div>
        <a className="button button-primary" href="https://zalo.me/0343019101" target="_blank" rel="noreferrer">Liên hệ Zalo 0343 019 101</a>
      </section>
    </main>
  );
}
