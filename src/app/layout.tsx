import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Notifier } from "@/components/Notifier";
import { Navbar } from "@/components/Navbar";
import { getSession } from "@/session";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { SmartContractProvider } from "@/components/providers/SmartContractProvider";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Origin",
  description: "Every commit counts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={pixelify.className}>
      <body>
        <WalletProvider>
          <Notifier>
            <SessionProvider session={session}>
              <SmartContractProvider>
                <Navbar />
                <div className="p-24">{children}</div>
              </SmartContractProvider>
            </SessionProvider>
          </Notifier>
        </WalletProvider>
      </body>
    </html>
  );
}
