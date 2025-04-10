import Header from '@components/layout/Header/Header';
import Main from '@components/layout/Main';
import Footer from '@components/layout/Footer/Footer';
import { Toaster } from '@components/ui/Toaster';

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
