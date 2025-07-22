import Header from '@/components/layout/header/header';
import Main from '@components/layout/main';
import Footer from '@/components/layout/footer/footer';
import { Toaster } from '@components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main>{children}</Main>
      <Footer />
      <Toaster closeButton position="top-center" theme="light" />
    </div>
  );
}
