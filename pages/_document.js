/* eslint-disable @next/next/no-title-in-document-head */
/* eslint-disable @next/next/next-script-for-ga */
import Document, { Html, Head, Main, NextScript } from 'next/document'

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
