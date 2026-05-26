import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLOP",
  description: "una mancha nueva cada día. dibújala a tu manera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rock+Salt&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
