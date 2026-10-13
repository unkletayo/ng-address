'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/docs', label: 'Docs', hideSmall: false },
  { href: '/docs/react', label: 'React SDK', hideSmall: true },
  { href: '/docs/core', label: 'Core API', hideSmall: true },
  { href: '/demo', label: 'Checkout demo', hideSmall: true },
];

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // storage unavailable; theme applies for this visit only
  }
}

export function Navbar() {
  const pathname = usePathname();

  const toggleTheme = () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-cell nav-brand" aria-label="NG Address home">
          NG
        </Link>

        <span className="nav-spacer" />

        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-cell${link.hideSmall ? ' hide-sm' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}

        <a
          href="https://github.com/ng-address/ng-address"
          target="_blank"
          rel="noreferrer"
          className="nav-cell hide-sm"
        >
          GitHub
        </a>

        <button type="button" className="nav-cell nav-square" onClick={toggleTheme} aria-label="Toggle dark mode">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </button>

        <Link href="/playground" className="nav-cell nav-cta">
          Open playground
        </Link>
      </div>
    </header>
  );
}
