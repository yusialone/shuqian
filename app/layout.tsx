import '../styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shuqian 书签站',
  description: '一个现代、极简、支持暗色模式的书签静态站点',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="referrer" content="unsafe-url" />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  )
} 