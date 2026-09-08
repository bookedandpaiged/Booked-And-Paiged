import './globals.css';
import Sidebar from './components/Sidebar';
import DataProvider from './components/DataProvider';
import StatusBar from './components/StatusBar';
import Script from 'next/script';

export const metadata = {
  title: 'Booked & Paiged',
  description: 'Your life. Intentionally managed.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Booked & Paiged',
  },
  icons: {
    apple: '/icon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#6B4F3E',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Booked & Paiged" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <DataProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <StatusBar />
        </DataProvider>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
