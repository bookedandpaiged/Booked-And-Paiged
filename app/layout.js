import './globals.css';
import Sidebar from './components/Sidebar';
import DataProvider from './components/DataProvider';
import StatusBar from './components/StatusBar';

export const metadata = {
  title: 'Booked & Paiged',
  description: 'Personal life dashboard',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Booked & Paiged',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F8F4EF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
