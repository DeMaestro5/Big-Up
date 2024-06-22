import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClerkProvider, SignedOut, SignInButton } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';

const IBMPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BIG-UP',
  description: 'AI Powered Image Generator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: '#624cf5' },
      }}
    >
      <html lang='en'>
        <body className={cn('font-IBMPlex antialiased', IBMPlex.className)}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
