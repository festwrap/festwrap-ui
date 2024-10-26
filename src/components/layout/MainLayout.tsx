import Header from "@/src/components/layout/Header/Header"
import Main from "@/src/components/layout/Main"
import Footer from "@/src/components/layout/Footer/Footer"

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  )
}
