'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy code', e);
    }
  };

  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid var(--code-border, #1e293b)',
      background: 'var(--code-bg, #030712)',
      margin: '1.25rem 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'rgba(15, 23, 42, 0.75)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        fontSize: '12px',
        color: '#94a3b8',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          </div>
          {filename && <span style={{ color: '#e2e8f0', fontWeight: 600, marginLeft: '8px' }}>{filename}</span>}
          {!filename && <span>{language}</span>}
        </div>

        <button
          onClick={handleCopy}
          type="button"
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: '1px solid',
            borderColor: copied ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            color: copied ? '#34d399' : '#cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.15s ease'
          }}
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>

      <pre style={{
        padding: '16px',
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '13.5px',
        lineHeight: 1.65,
        color: '#f1f5f9',
        margin: 0
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
