'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavSection {
  title: string;
  items: { href: string; label: string; tag?: string }[];
}

const docsNavigation: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Overview & Monorepo' },
      { href: '/docs/quickstart', label: 'Quickstart Guide' },
      { href: '/playground', label: 'Live Interactive Playground', tag: 'Live' },
      { href: '/demo', label: 'Checkout Demo App', tag: 'Demo' },
    ]
  },
  {
    title: 'Packages & SDKs',
    items: [
      { href: '/docs/core', label: '@ng-address/core', tag: 'Core' },
      { href: '/docs/react', label: '@ng-address/react', tag: 'UI' },
      { href: '/docs/nipost', label: '@ng-address/nipost', tag: 'NDAPS' },
      { href: '/docs/cli', label: '@ng-address/cli', tag: 'CLI' },
    ]
  },
  {
    title: 'Architecture & Guides',
    items: [
      { href: '/docs/security', label: 'Security & Credential Isolation' },
      { href: '/docs/providers', label: 'Custom Provider Implementation' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '280px',
      flexShrink: 0,
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(11, 15, 23, 0.95)',
      padding: '24px 16px',
      position: 'sticky',
      top: '64px',
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {docsNavigation.map((section) => (
        <div key={section.title}>
          <h4 style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: '#6b7280',
            marginBottom: '10px',
            paddingLeft: '10px'
          }}>
            {section.title}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#10b981' : '#cbd5e1',
                      background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{item.label}</span>
                    {item.tag && (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        background: item.tag === 'Live' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        color: item.tag === 'Live' ? '#34d399' : '#9ca3af'
                      }}>
                        {item.tag}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
