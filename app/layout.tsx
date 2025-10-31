import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/lib/Web3Provider";

export const metadata: Metadata = {
  title: "On-Chain Note Board",
  description: "Post and read messages on the blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
