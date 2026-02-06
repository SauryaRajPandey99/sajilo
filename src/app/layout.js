import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sajilo",
  description: "A simple budgetting app to manage your finances easily.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header />
          {/* Header can be added here if needed */}
          <main className="min-h-screen"> {children}</main>
          <Toaster richColors />

          <footer className="bg-blue-50 py-12">
            <div
              className="container mx-auto text-center text-sm text-gray-500"
              suppressHydrationWarning
            >
              &copy; {new Date().getFullYear()} Sajilo. All rights reserved.
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
