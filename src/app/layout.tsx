import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '你知道鐵口先生這個名號怎麼來的嗎？',
    template: '%s | 神算黃鐵口',
  },
  description:
    '神算黃鐵口 - 專業命理諮詢服務，為您解答人生疑惑，指點迷津。',
  keywords: [
    '神算黃鐵口',
    '鐵口先生',
    '命理諮詢',
    '八字算命',
    '風水命理',
    '紫微斗數',
    '占卜問事',
  ],
  authors: [{ name: '神算黃鐵口', url: 'https://www.taijijiaoxue11.shop' }],
  generator: '神算黃鐵口',
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: '神算黃鐵口 | 你知道鐵口先生這個名號怎麼來的嗎？',
    description:
      '神算黃鐵口 - 專業命理諮詢服務，為您解答人生疑惑，指點迷津。',
    url: 'https://www.taijijiaoxue11.shop',
    siteName: '神算黃鐵口',
    locale: 'zh_TW',
    type: 'website',
    // images: [
    //   {
    //     url: '',
    //     width: 1200,
    //     height: 630,
    //     alt: '扣子编程 - 你的 AI 工程师',
    //   },
    // ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
