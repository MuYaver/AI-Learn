import { Geist } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Learn - Gamified Learning",
  description: "Learn AI concepts through interactive, gamified lessons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full bg-duo-bg text-duo-text antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
