/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PostCodeBlockProps {
  language: string
  children: string
}

export const PostCodeBlock = ({ children, language }: PostCodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(children).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative mb-12">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md bg-gray-700 p-1.5 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
        aria-label="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1.5 text-sm text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        wrapLongLines
        PreTag="div"
        customStyle={{
          borderRadius: '1rem',
          marginBottom: '0',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
