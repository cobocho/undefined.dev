"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  children: string;
}

export const CodeBlock = ({ children, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div className="group/code relative mb-6">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md bg-gray-700 p-1.5 text-gray-300 opacity-0 transition-all hover:bg-gray-600 hover:text-white group-hover/code:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <span className="flex items-center gap-1.5 text-xs text-gray-300">
            <Check className="size-4" />
            Copied
          </span>
        ) : (
          <Copy className="size-4" />
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        wrapLongLines
        PreTag="div"
        customStyle={{
          borderRadius: "1rem",
          marginBottom: "0",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
