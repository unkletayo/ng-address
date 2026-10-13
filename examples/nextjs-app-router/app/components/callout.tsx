'use client';

import React from 'react';

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'security';
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const styles = {
    note: {
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      icon: 'ℹ️',
      titleColor: '#60a5fa',
      defaultTitle: 'Note'
    },
    tip: {
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      icon: '💡',
      titleColor: '#34d399',
      defaultTitle: 'Tip'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      icon: '⚠️',
      titleColor: '#fbbf24',
      defaultTitle: 'Warning'
    },
    security: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.3)',
      icon: '🔒',
      titleColor: '#f87171',
      defaultTitle: 'Security Best Practice'
    }
  }[type];

  return (
    <div style={{
      background: styles.bg,
      border: `1px solid ${styles.border}`,
      borderLeft: `4px solid ${styles.titleColor}`,
      borderRadius: '8px',
      padding: '14px 18px',
      margin: '1.25rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 600,
        fontSize: '14px',
        color: styles.titleColor,
        marginBottom: '6px'
      }}>
        <span>{styles.icon}</span>
        <span>{title || styles.defaultTitle}</span>
      </div>
      <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}
