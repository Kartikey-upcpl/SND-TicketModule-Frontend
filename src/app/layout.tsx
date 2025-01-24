"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "@/components/UI/ClientLayout";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/login", "/create-a-new-user", "/another-page"];
  const isNoLayoutRoute = noLayoutRoutes.includes(pathname);


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <div className="">
            {isNoLayoutRoute ? (
              children
            ) : (
              <ClientLayout>{children}</ClientLayout>
            )}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
