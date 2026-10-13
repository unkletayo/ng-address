import React from 'react';
import { Sidebar } from '../components/sidebar';

export default function DocsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        maxWidth: '1000px',
        padding: '40px 48px 80px',
        margin: '0 auto',
        minWidth: 0
      }}>
        {children}
      </main>
    </div>
  );
}
