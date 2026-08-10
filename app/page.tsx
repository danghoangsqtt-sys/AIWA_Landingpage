"use client";

import { useEffect, useState } from "react";

const zaloUrl = "https://zalo.me/0343019101";
const facebookUrl = "https://www.facebook.com/danghoang.bds79/";
const registrationUrl = "/dang-ky";

const testimonials = [
  { name: "Minh Anh", role: "Sinh viên cao học", quote: "Thanh công cụ gọn, thao tác ngay trong Word nên mình đỡ mất thời gian chuyển qua nhiều ứng dụng." },
  { name: "Thầy Quang", role: "Giảng viên", quote: "Phần định dạng tài liệu và hỗ trợ biên tập rất tiện khi chuẩn bị bài giảng, báo cáo nghiên cứu." },
  { name: "Ngọc Mai", role: "Nhân viên văn phòng", quote: "Mình thích nhất khả năng sửa lỗi và xử lý tài liệu nhanh. Giao diện dễ hiểu, không mất nhiều thời gian làm quen." },
  { name: "Thu Hà", role: "Nghiên cứu viên", quote: "AIWA giúp quy trình kiểm tra và hoàn thiện bản thảo liền mạch hơn, đặc biệt với tài liệu dài." },
];

const activityMessages = [
  { title: "Dùng thử AIWA miễn phí", detail: "Nhận key trải nghiệm đầy đủ trong 15 ngày" },
  { title: "Bản quyền dùng trọn đời", detail: "Mua một lần, không thu phí duy trì hằng năm" },
  { title: "Ưu đãi còn 999.000đ", detail: "Giá niêm yết 2.500.000đ · tiết kiệm 60%" },
  { title: "Tặng phần mềm hỗ trợ in", detail: "Hướng dẫn in hai mặt trên máy in một mặt" },
  { title: "Hỗ trợ cài đặt tận tình", detail: "DHSystem đồng hành để bạn bắt đầu thuận tiện" },
  { title: "Làm việc ngay trong Word", detail: "Không cần chuyển đổi qua lại nhiều ứng dụng" },
  { title: "Soạn thảo nhanh và rõ hơn", detail: "Hỗ trợ viết lại, sửa lỗi và chuẩn hóa tài liệu" },
  { title: "Phù hợp công việc học thuật", detail: "Hỗ trợ tài liệu dài, tham chiếu và định dạng" },
];

function Countdown() {
  const [seconds, setSeconds] = useState(6 * 60 * 60 + 38 * 60 + 19);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 6 * 60 * 60 + 38 * 60 + 19));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const values = [
    { value: "00", label: "Ngày" },
    { value: String(Math.floor(seconds / 3600)).padStart(2, "0"), label: "Giờ" },
    { value: String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"), label: "Phút" },
    { value: String(seconds % 60).padStart(2, "0"), label: "Giây" },
  ];

  return (
    <div className="countdown" aria-label="Thời gian ưu đãi còn lại">
      {values.map((item, index) => (
        <div className="time-wrap" key={item.label}>
          <div className="time-box"><strong>{item.value}</strong><span>{item.label}</span></div>
          {index < values.length - 1 && <b className="colon">:</b>}
        </div>
      ))}
    </div>
  );
}

function CheckIcon() {
  return <span className="check" aria-hidden="true">✓</span>;
}

function AiwaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "aiwa-logo compact" : "aiwa-logo"} aria-hidden="true">
      <img src="/aiwa-poster.png" alt="" />
    </span>
  );
}

export default function Home() {
  const [activityIndex, setActivityIndex] = useState(0);
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(
      "main > section:not(.hero), .feature-card, .bundle-list > span, .steps article, .audience-card, .testimonial-card"
    ));
    revealItems.forEach((item) => item.classList.add("reveal-item"));
    let lastY = window.scrollY - 1;
    let ticking = false;
    const update = () => {
      const goingDown = window.scrollY >= lastY;
      revealItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (goingDown && rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          item.classList.add("is-visible");
          item.classList.remove("scroll-fade");
        } else if (!goingDown && rect.top > window.innerHeight * 0.2 && rect.top < window.innerHeight) {
          item.classList.add("scroll-fade");
        }
        if (rect.bottom < 0) {
          item.classList.add("is-visible");
          item.classList.remove("scroll-fade");
        }
      });
      lastY = window.scrollY;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let hideTimer: number | undefined;
    let interval: number | undefined;
    const showNext = () => {
      setShowActivity(true);
      hideTimer = window.setTimeout(() => {
        setShowActivity(false);
        setActivityIndex((current) => (current + 1) % activityMessages.length);
      }, 5200);
    };
    const startTimer = window.setTimeout(() => {
      showNext();
      interval = window.setInterval(showNext, 9000);
    }, 2800);
    return () => {
      window.clearTimeout(startTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <main>
      <div className="announcement">
        <span className="text-highlight">Ưu đãi</span> trải nghiệm · Nhận key AIWA dùng thử miễn phí <span className="text-highlight">15 ngày</span> qua <a href="https://zalo.me/0343019101" target="_blank" rel="noreferrer" className="zalo-link">Zalo ↗</a>
      </div>
      <header className="site-header">
        <a className="brand brand-aiwa" href="#top" aria-label="AIWA by DHSystem - về đầu trang">
          <AiwaLogo compact />
          <span><strong>AIWA</strong><small>by DHSystem</small></span>
        </a>
        <nav aria-label="Điều hướng chính">
          <a href="#tinh-nang">Tính năng</a>
          <a href="#bo-qua-tang">Bộ quà tặng</a>
          <a href="/huong-dan">Hướng dẫn</a>
          <a href="#lien-he">Liên hệ</a>
        </nav>
        <a className="button button-small" href={registrationUrl}>Nhận key 15 ngày</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="hero-brand"><AiwaLogo /><span><b>AIWA</b><small>TRỢ LÝ AI TOÀN DIỆN NGAY TRONG WORD</small></span></div>
          <div className="eyebrow"><span>●</span> BỘ CÔNG CỤ VĂN PHÒNG THẾ HỆ MỚI</div>
          <h1><span className="hero-title-line">Soạn thảo thông minh.</span><em className="hero-title-line">Nghiên cứu nhanh hơn.</em></h1>
          <p className="hero-lead">AIWA là add-in tích hợp ngay trong Microsoft Word, giúp bạn viết, dịch, chuẩn hóa tài liệu và hỗ trợ nghiên cứu khoa học — tất cả trong một thanh công cụ trực quan.</p>
          <div className="hero-points">
            <span><CheckIcon /> Bản quyền trọn đời</span>
            <span><CheckIcon /> Hỗ trợ cài đặt</span>
            <span><CheckIcon /> Không phí duy trì</span>
          </div>
          <a className="trial-offer" href={registrationUrl} aria-label="Đăng ký nhận key AIWA dùng thử miễn phí 15 ngày">
            <span className="trial-icon">15</span>
            <span><b>Dùng thử miễn phí 15 ngày</b><small>Nhấn để kết nối Zalo và nhận key trải nghiệm</small></span>
            <strong>→</strong>
          </a>
          <div className="price-line">
            <div><span>Giá ưu đãi hôm nay</span><strong>999.000<sup>đ</sup></strong></div>
            <div className="old-price"><span>Giá gốc</span><del>2.500.000đ</del><b>TIẾT KIỆM 60%</b></div>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href={registrationUrl}>Đăng ký nhận key 15 ngày <span>→</span></a>
            <a className="text-link" href="#tinh-nang">Khám phá tính năng ↓</a>
          </div>
          <p className="microcopy">Tặng kèm phần mềm hỗ trợ in hai mặt thủ công cho máy in một mặt</p>
        </div>

        <div className="hero-visual">
          <div className="glow" />
          <div className="word-window">
            <div className="window-top"><span className="word-icon">W</span><span>Tài liệu nghiên cứu.docx — Word</span><i>−　□　×</i></div>
            <div className="aiwa-shot">
              <img src="/aiwa-toolbar.png" width="1617" height="150" alt="Thanh công cụ AIWA tích hợp trong Microsoft Word" />
            </div>
            <div className="document-preview">
              <span className="doc-label">BẢN THẢO NGHIÊN CỨU</span>
              <h3>Ứng dụng trí tuệ nhân tạo<br/>trong giáo dục hiện đại</h3>
              <div className="fake-line wide"/><div className="fake-line"/><div className="fake-line mid"/>
              <div className="ai-card"><b>AIWA</b><span>Đang hỗ trợ hoàn thiện nội dung…</span><strong>✓</strong></div>
            </div>
          </div>
          <div className="floating-card card-ai"><span>AI</span><div><b>Trợ lý thông minh</b><small>Luôn sẵn sàng trong Word</small></div></div>
          <div className="floating-card card-gift"><span>🎁</span><div><b>Quà tặng 0đ</b><small>Phần mềm hỗ trợ in</small></div></div>
        </div>
      </section>

      <section className="urgency" aria-labelledby="offer-title">
        <div><span className="pulse-dot"/><p><strong id="offer-title">Nhận key dùng thử miễn phí 15 ngày</strong><small>Kết nối Zalo để trải nghiệm AIWA trước khi mua</small></p></div>
        <Countdown />
        <a href={registrationUrl}>Đăng ký nhận key →</a>
      </section>

      <section className="trust-strip" aria-label="Độ tin cậy của AIWA">
        <div><strong>★★★★★</strong><span><b>5 sao</b><small>Trải nghiệm nổi bật</small></span></div>
        <i />
        <div><strong>1.900+</strong><span><b>Lượt tải về</b><small>Cộng đồng đang phát triển</small></span></div>
        <i />
        <div><strong>15 ngày</strong><span><b>Dùng thử miễn phí</b><small>Nhận key qua Zalo</small></span></div>
      </section>

      <section className="poster-showcase" aria-labelledby="poster-title">
        <a className="poster-frame" href={registrationUrl} aria-label="Đăng ký nhận key AIWA dùng thử miễn phí 15 ngày">
          <span className="poster-glow" />
          <img src="/aiwa-poster.png" width="1024" height="1536" alt="Poster AIWA - trợ lý AI toàn diện ngay trong Word, giá ưu đãi 999.000 đồng dùng trọn đời" />
          <span className="poster-click">Nhấn để nhận key miễn phí 15 ngày →</span>
        </a>
        <div className="poster-copy">
          <div className="section-kicker light">NHẬN DIỆN SẢN PHẨM AIWA</div>
          <h2>Một biểu tượng.<br/><em>Một hệ công cụ toàn diện.</em></h2>
          <p>Logo AIWA kết hợp hình ảnh tài liệu và trí tuệ nhân tạo — đại diện cho một trợ lý luôn đồng hành trong quá trình soạn thảo, biên tập và nghiên cứu.</p>
          <div className="poster-benefits">
            <span><b>01</b><small>Tích hợp trực tiếp<br/>trong Word</small></span>
            <span><b>02</b><small>Hỗ trợ Việt–Anh<br/>nhanh chóng</small></span>
            <span><b>03</b><small>Công cụ học thuật<br/>chuyên sâu</small></span>
          </div>
          <div className="brand-price"><small>AIWA · BẢN QUYỀN TRỌN ĐỜI</small><strong>999.000đ</strong><del>2.500.000đ</del></div>
          <a className="button button-gold" href={registrationUrl}>Đăng ký & nhận key 15 ngày <span>→</span></a>
        </div>
      </section>

      <section className="intro" id="tinh-nang">
        <div className="section-kicker">MỘT ADD-IN · NHIỀU SỨC MẠNH</div>
        <h2>Mọi công cụ bạn cần,<br/><em>ngay trong Microsoft Word</em></h2>
        <p>Không cần chuyển đổi qua lại giữa nhiều ứng dụng. AIWA đưa các công cụ thiết yếu đến đúng nơi bạn đang làm việc.</p>
      </section>

      <section className="features">
        <article className="feature-card featured">
          <span className="feature-icon">✦</span>
          <div className="tag">AI HỖ TRỢ</div>
          <h3>Biên soạn & giải đáp</h3>
          <p>Hỗ trợ phát triển ý tưởng, giải đáp nội dung và cải thiện bản thảo ngay trong tài liệu đang mở.</p>
          <ul><li><CheckIcon /> Gợi ý nội dung nhanh</li><li><CheckIcon /> Viết lại đoạn văn rõ ràng</li><li><CheckIcon /> Hỗ trợ nghiên cứu</li></ul>
        </article>
        <article className="feature-card">
          <span className="feature-icon">文</span>
          <h3>Dịch thuật đa ngôn ngữ</h3>
          <p>Dịch Việt–Anh và Anh–Việt thuận tiện, giúp tiết kiệm thời gian xử lý tài liệu học thuật.</p>
          <ul><li><CheckIcon /> Dịch ngay trong Word</li><li><CheckIcon /> Hỗ trợ văn phong học thuật</li><li><CheckIcon /> Không cần sao chép qua lại</li></ul>
        </article>
        <article className="feature-card">
          <span className="feature-icon">Aa</span>
          <h3>Biên tập chuyên sâu</h3>
          <p>Sửa lỗi tiếng Việt, tiếng Anh và lọc từ mồ côi để tài liệu chỉn chu, chuyên nghiệp hơn.</p>
          <ul><li><CheckIcon /> Sửa lỗi chính tả</li><li><CheckIcon /> Chuẩn hóa trình bày</li><li><CheckIcon /> Làm sạch văn bản</li></ul>
        </article>
        <article className="feature-card">
          <span className="feature-icon">⌘</span>
          <h3>Công cụ nghiên cứu</h3>
          <p>Hỗ trợ định dạng bảng, hình ảnh, công thức, tham chiếu và các công việc thường gặp.</p>
          <ul><li><CheckIcon /> Định dạng tài liệu</li><li><CheckIcon /> Vẽ & kiểm chứng sơ đồ</li><li><CheckIcon /> Quản lý tham chiếu</li></ul>
        </article>
      </section>

      <section className="audiences" aria-labelledby="audiences-title">
        <div className="audiences-heading">
          <div className="section-kicker">AIWA TRONG CÔNG VIỆC THỰC TẾ</div>
          <h2 id="audiences-title">Ai cũng có thể làm việc<br/><em>nhanh hơn và vui hơn</em></h2>
          <p>Từ giảng đường đến văn phòng, AIWA giúp người dùng tập trung vào ý tưởng thay vì những thao tác lặp lại.</p>
        </div>
        <div className="audience-grid">
          <article className="audience-card"><img src="/audience-student.png" alt="Sinh viên vui vẻ sử dụng AIWA để làm tài liệu trên máy tính"/><div><span>SINH VIÊN</span><h3>Học tập & nghiên cứu</h3><p>Soạn tiểu luận, dịch thuật và chuẩn hóa tài liệu nhanh chóng.</p></div></article>
          <article className="audience-card"><img src="/audience-teacher.png" alt="Giáo viên vui vẻ sử dụng AIWA để chuẩn bị bài giảng"/><div><span>GIÁO VIÊN</span><h3>Giảng dạy & học thuật</h3><p>Chuẩn bị bài giảng, báo cáo và tài liệu nghiên cứu chỉn chu.</p></div></article>
          <article className="audience-card"><img src="/audience-office.png" alt="Nhân viên văn phòng vui vẻ hoàn thiện tài liệu với AIWA"/><div><span>VĂN PHÒNG</span><h3>Hiệu suất mỗi ngày</h3><p>Biên tập, trình bày và xử lý tài liệu chuyên nghiệp hơn.</p></div></article>
        </div>
      </section>

      <section className="bundle" id="bo-qua-tang">
        <div className="bundle-copy">
          <div className="section-kicker light">COMBO ĐỘC QUYỀN TỪ DHSYSTEM</div>
          <h2>Mua AIWA, nhận thêm<br/><em>trợ thủ in ấn miễn phí</em></h2>
          <p>Phần mềm tặng kèm hướng dẫn quy trình in hai mặt thủ công trên máy in một mặt, giúp bạn lật giấy đúng chiều và hạn chế in sai.</p>
          <div className="gift-emphasis"><span>🎁</span><div><b>QUÀ TẶNG ĐỘC QUYỀN 0Đ</b><small>Nhận ngay khi mua bản quyền AIWA trọn đời</small></div></div>
          <div className="bundle-list">
            <span><CheckIcon /><b>Thao tác đơn giản</b><small>Hướng dẫn từng bước dễ làm theo</small></span>
            <span><CheckIcon /><b>Hạn chế nhầm lẫn</b><small>Nhắc thứ tự và chiều lật giấy</small></span>
            <span><CheckIcon /><b>Tiết kiệm giấy</b><small>Tận dụng máy in một mặt hiệu quả hơn</small></span>
          </div>
        </div>
        <div className="bundle-card">
          <div className="ribbon">TẶNG KÈM</div>
          <div className="printer-visual"><span>▰</span><i>AIWA</i></div>
          <h3>Phần mềm hỗ trợ in hai mặt thủ công</h3>
          <p>Dành cho máy in một mặt</p>
          <div className="gift-value"><del>Giá trị riêng</del><strong>0đ</strong><small>Khi mua AIWA hôm nay</small></div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-kicker">BẮT ĐẦU THẬT DỄ DÀNG</div>
        <h2>Chỉ 3 bước để sở hữu AIWA</h2>
        <div className="steps">
          <article><b>01</b><span className="step-icon" aria-hidden="true">↗</span><h3>Nhấn đăng ký</h3><p>Nút đăng ký mở trực tiếp Zalo của DHSystem để bạn gửi yêu cầu.</p></article>
          <i aria-hidden="true">→</i>
          <article><b>02</b><span className="step-icon" aria-hidden="true">◇</span><h3>Nhận key dùng thử</h3><p>DHSystem gửi key và hỗ trợ kích hoạt AIWA miễn phí trong 15 ngày.</p></article>
          <i aria-hidden="true">→</i>
          <article><b>03</b><span className="step-icon" aria-hidden="true">✓</span><h3>Trải nghiệm & lựa chọn</h3><p>Dùng thử đầy đủ trước khi quyết định nâng cấp bản quyền trọn đời.</p></article>
        </div>
      </section>

      <section className="testimonials" aria-labelledby="reviews-title">
        <div className="reviews-heading">
          <div><div className="section-kicker">PHẢN HỒI TRẢI NGHIỆM</div><h2 id="reviews-title">Người dùng nói gì về AIWA?</h2></div>
          <div className="review-score"><strong>5.0</strong><span>★★★★★</span><small>Đánh giá trải nghiệm</small></div>
        </div>
        <div className="feedback-window">
          <div className="feedback-track">
            {[...testimonials, ...testimonials].map((review, index) => (
              <article className="testimonial-card" key={`${review.name}-${index}`}>
                <div className="stars">★★★★★</div>
                <p>“{review.quote}”</p>
                <div className="reviewer"><span>{review.name.charAt(0)}</span><div><b>{review.name}</b><small>{review.role}</small></div></div>
              </article>
            ))}
          </div>
        </div>
        <p className="review-disclosure">Nội dung phản hồi minh họa cho bố cục website; nên thay bằng đánh giá xác thực của khách hàng khi có dữ liệu.</p>
      </section>

      <section className="final-offer" id="lien-he">
        <div className="offer-badge">DÙNG THỬ KHÔNG RỦI RO</div>
        <h2>Nhận key AIWA miễn phí<br/><em>dùng thử trọn 15 ngày</em></h2>
        <p>Kết nối Zalo với DHSystem để nhận key trải nghiệm; sau đó có thể nâng cấp bản quyền trọn đời với giá 999.000đ.</p>
        <Countdown />
        <div className="final-actions">
          <a className="button button-primary" href={registrationUrl}>Đăng ký nhận key miễn phí</a>
          <a className="button button-facebook" href={facebookUrl} target="_blank" rel="noreferrer">Nhắn tin Facebook</a>
        </div>
        <small>Zalo 0343 019 101 · Liên hệ để nhận key, kiểm tra tương thích và được hỗ trợ cài đặt</small>
      </section>

      <section className="faq">
        <div><div className="section-kicker">CÂU HỎI THƯỜNG GẶP</div><h2>Bạn cần biết thêm?</h2><p>DHSystem sẵn sàng giải đáp trước khi bạn quyết định.</p></div>
        <div className="faq-list">
          <details open><summary>Giá 999.000đ có phải trả phí hằng năm không?<span>+</span></summary><p>Không. Đây là mức giá mua một lần để sử dụng trọn đời, không có phí duy trì hằng năm.</p></details>
          <details><summary>Tôi có được hỗ trợ cài đặt không?<span>+</span></summary><p>Có. DHSystem sẽ hướng dẫn và hỗ trợ cài đặt để bạn có thể bắt đầu sử dụng thuận tiện.</p></details>
          <details><summary>Phần mềm in tặng kèm dùng để làm gì?<span>+</span></summary><p>Phần mềm giúp người dùng máy in một mặt thực hiện in hai mặt thủ công theo quy trình rõ ràng, hạn chế lật giấy sai chiều.</p></details>
          <details><summary>Làm sao nhận key dùng thử miễn phí 15 ngày?<span>+</span></summary><p>Nhấn nút “Đăng ký nhận key”, điền họ tên, số điện thoại và email. Hệ thống gửi thư cảm ơn cùng link tải bộ cài, sau đó kết nối bạn với Zalo 0343019101 để nhận key và được hỗ trợ.</p></details>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><AiwaLogo compact /><span><strong>AIWA</strong><small>by DHSystem</small></span></a>
        <p>AIWA — Công cụ thông minh cho công việc nghiêm túc.</p>
        <div><a href="/huong-dan">Hướng dẫn sử dụng</a><a href={zaloUrl} target="_blank" rel="noreferrer">Zalo: 0343 019 101</a><a href={facebookUrl} target="_blank" rel="noreferrer">Facebook</a></div>
        <small>© 2026 DHSystem. Thông tin sản phẩm và ưu đãi có thể được cập nhật.</small>
      </footer>

      <div className="contact-float" aria-label="Liên hệ nhanh">
        <a href={zaloUrl} target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo">Zalo</a>
        <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Liên hệ Facebook">f</a>
      </div>
      <aside className={`activity-popup ${showActivity ? "show" : ""}`} aria-live="polite">
        <button type="button" onClick={() => setShowActivity(false)} aria-label="Đóng thông báo">×</button>
        <span className="activity-icon">✦</span>
        <div><small>AIWA GỢI Ý</small><p>{activityMessages[activityIndex].title}</p><b>{activityMessages[activityIndex].detail}</b></div>
      </aside>
    </main>
  );
}
