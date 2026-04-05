'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/dashboard': '대시보드',
  '/recipes': '레시피',
  '/logs': '요리 로그',
};

function getTitle(pathname: string): string {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + '/')) return title;
  }
  return 'Kudip';
}

export default function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 h-16 shrink-0">
      <Link href="/dashboard" className="text-xl font-bold text-orange-500 tracking-tight">
        Kudip
      </Link>
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
    </header>
  );
}
