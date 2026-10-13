import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import '@ng-address/react/styles.css';
import { Navbar } from './components/navbar';

export const metadata: Metadata = {
  title: 'NG Address — Documentation & Developer Portal',
  description: 'Documentation, API reference, interactive playground, and component SDK for Nigerian address normalization and NIPOST NDAPS verification.'
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
