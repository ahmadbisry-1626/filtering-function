import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '700'],
  variable: '--font-poppins',

});

export const metadata: Metadata = {
  title: "Loving you is a losing game",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
