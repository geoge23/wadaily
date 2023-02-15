/* eslint-disable @next/next/no-title-in-document-head */
/* eslint-disable @next/next/next-script-for-ga */
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-18065K9X6D"></script>
            <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-18065K9X6D');`}}></script>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2449248336438334" crossOrigin="anonymous"></script>
            <meta name="description" content="View your schedule, menu, and announcements for Woodward Academy quickly and efficiently!"></meta>
            <meta name="keywords" content="woodward, woodward academy, woodward schedule, woodward lunch, wadaily, wa daily, woodward calendar, atlanta ga, woodward atlanta" />
            <meta name="author" content="George Parks" />

            <meta property="og:title" content="WADaily" />
            <meta property="og:description" content="View your schedule, menu, and announcements for Woodward Academy quickly and efficiently!" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://wadaily.co/" />
        </Head>
        <body className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
