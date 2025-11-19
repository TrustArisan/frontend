import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustArisan - Decentralized ROSCA Platform",
  description: "A decentralized platform for managing ROSCA groups with blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            enableColorScheme={true}
            themes={["light", "dark"]}
            storageKey="trust-arisan-theme"
            disableTransitionOnChange={false}
            >
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
      </body>
    </html>
  );
}
