import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicHub NG | Nigeria's Voice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 text-gray-900`}>
        {/* STICKY NAVIGATION */}
        <nav className="bg-[#006633] text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="text-2xl font-black tracking-tighter hover:opacity-90 transition-opacity">
              CIVICHUB<span className="text-green-400">NG</span>
            </Link>
            
            {/* NAV LINKS */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/feed" 
                className="font-bold text-sm uppercase tracking-wider hover:text-green-300 transition-colors"
              >
                Newsfeed
              </Link>
              
              <Link 
                href="/report" 
                className="bg-white text-[#006633] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-green-50 hover:shadow-lg transition-all transform active:scale-95"
              >
                Submit Report
              </Link>
            </div>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main>{children}</main>

        {/* SIMPLE FOOTER */}
        <footer className="bg-white border-t py-10 text-center">
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            CivicHub Nigeria &copy; 2026
          </p>
        </footer>
      </body>
    </html>
  );
}