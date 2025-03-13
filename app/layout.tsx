import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";

const sans = localFont({
  src: [
    {
      path: "../assets/fonts/VKSansDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/VKSansDisplay-Medium.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../assets/fonts/VKSansDisplay-DemiBold.ttf",
      weight: "600",
      style: "demi-bold",
    },
    {
      path: "../assets/fonts/VKSansDisplay-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
});

export const metadata: Metadata = {
  title: "Auction App",
  description: "Auction application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
