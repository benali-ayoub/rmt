import type { Metadata } from 'next';
import './globals.css';
import './carousel-reviews.css';
export const metadata: Metadata = { title: 'Royal Morocco Travels | A journey beyond the ordinary', description: 'Discover Morocco, your way. Explore the Sahara, imperial cities and mountain landscapes with Royal Morocco Travels. Plan your journey on WhatsApp.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
