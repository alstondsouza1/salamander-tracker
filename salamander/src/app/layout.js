import Link from 'next/link';

// define metadata for the app
export const metadata = {
  title: 'Salamander Tracker',
  description: 'Track salamanders in videos using centroid detection',
};

// root layout component for all the pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-green-700 text-white p-4">
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/videos">Videos</Link>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}