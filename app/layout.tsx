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
    <html lang="en" suppressHydrationWarning className="light" style={{ colorScheme: 'light' }}>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            storageKey="trust-arisan-theme"
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
