import AuthGuard from '@/components/layout/AuthGuard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-dvh bg-gray-50">
        {/* 데스크탑 사이드바 */}
        <Sidebar />

        {/* 우측 콘텐츠 영역 */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* 데스크탑 헤더 */}
          <Header />

          {/* 메인 콘텐츠 */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        </div>

        {/* 모바일 하단 네비게이션 */}
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
