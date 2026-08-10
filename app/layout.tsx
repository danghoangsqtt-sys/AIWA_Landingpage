import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIWA by DHSystem",
  description: "AIWA - add-in hỗ trợ soạn thảo văn bản và nghiên cứu khoa học trong Microsoft Word.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="vietnamese-font">{children}</body>
    </html>
  );
}
