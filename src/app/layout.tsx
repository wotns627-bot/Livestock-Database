// src/app/layout.tsx
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-sm p-4 border-b">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">🐮 Cows Manager</Link>
            <div className="space-x-6 text-sm font-semibold text-gray-600">
              <Link href="/cows" className="hover:text-blue-600">개체현황</Link>
              <Link href="/pens" className="hover:text-blue-600">축사현황</Link>
              <Link href="/inventory" className="hover:text-blue-600">원료재고</Link>
              <Link href="/shipping" className="hover:text-blue-600">출하관리</Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}