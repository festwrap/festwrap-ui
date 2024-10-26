import { Poppins } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { routing } from "@/src/i18n/routing"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import MainLayout from "@/src/components/layout/MainLayout"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const session = await auth()

//   return (
//     <SessionProvider session={session}>
//       <html lang="en">
//         <body className={poppins.className}>
//           <MainLayout>{children}</MainLayout>
//         </body>
//       </html>
//     </SessionProvider>
//   )
// }

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const session = await auth()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={poppins.className}>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            {/* <MainLayout>{children}</MainLayout> */}
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
