import type { Metadata } from 'next';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Nobody Needs Your Aadhaar Number | Vidarbha Education Grant 2025',
  description:
    'A ₹15,000 direct educational grant for first-generation college students across Vidarbha using client-side zero-knowledge proofs. Zero Aadhaar stored.',
  keywords: [
    'Anon Aadhaar',
    'Zero Knowledge Proof',
    'Vidarbha Education Grant',
    'Student Aid',
    'ZKP',
    'Privacy Preserving',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen selection:bg-secondary-container selection:text-on-secondary-container antialiased">
        <div className="flex-1 flex flex-col w-full">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
