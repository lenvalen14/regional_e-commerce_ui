import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Providers } from './provider/redux-provider';
import AuthInitializer from '@/components/layout/AuthInitializer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Đặc Sản Việt",
  description: "Khám phá hương vị đặc sản từ khắp ba miền",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <CartProvider>
            <AuthInitializer />
            {children}
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
