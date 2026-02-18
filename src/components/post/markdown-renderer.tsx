"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "./code-block";

interface MarkdownRendererProps {
  content: string;
  images: Record<string, StaticImageData>;
}

function toSlug(text: unknown) {
  if (typeof text === "string") {
    return text.split(" ").join("-");
  }
}

export const MarkdownRenderer = ({
  content,
  images,
}: MarkdownRendererProps) => {
  const components: Partial<Components> = useMemo(
    () => ({
      p: (props) => <p {...props} className="my-4 leading-[190%]" />,
      h1: (props) => (
        <h1
          {...props}
          className="pt-16 pb-4 text-3xl font-extrabold text-neutral-900"
          id={toSlug(props.children)}
        />
      ),
      h2: (props) => (
        <h2
          {...props}
          className="border-b border-neutral-200 pt-14 pb-3 text-2xl font-bold text-neutral-900"
          id={toSlug(props.children)}
        />
      ),
      h3: (props) => (
        <h3
          {...props}
          className="pt-10 pb-2 text-xl font-bold text-neutral-800"
          id={toSlug(props.children)}
        />
      ),
      h4: (props) => (
        <h4
          {...props}
          className="pt-8 pb-2 text-lg font-semibold text-neutral-800"
          id={toSlug(props.children)}
        />
      ),
      a: ({ href, children }) => {
        if (!href) return <>{children}</>;

        if (href.startsWith("http")) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {children}
            </a>
          );
        }

        return (
          <Link href={href} className="text-blue-500 hover:underline">
            {children}
          </Link>
        );
      },
      img: (props) => {
        const { alt = "", src = "" } = props;
        const image = images[src as keyof typeof images];

        if (!image) {
          // fallback for external images
          // eslint-disable-next-line @next/next/no-img-element
          return <img src={src} alt={alt} className="my-6 rounded-lg" />;
        }

        const isGif = image.src.includes("gif");

        return (
          <figure className="mx-auto my-6 flex w-full max-w-[600px] flex-col items-center gap-3">
            <Image
              src={image}
              width={image.width}
              height={image.height}
              blurDataURL={image.blurDataURL}
              alt={alt}
              loading="lazy"
              placeholder={isGif ? "empty" : "blur"}
              className="rounded-lg"
              unoptimized={isGif}
            />
            {alt && (
              <figcaption className="text-sm text-neutral-400">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      },
      ol: (props) => (
        <ol {...props} className="mb-4 flex list-decimal flex-col gap-3 pl-6" />
      ),
      ul: (props) => (
        <ul {...props} className="mb-4 flex list-disc flex-col gap-3 pl-6" />
      ),
      em: (props) => (
        <em {...props} className="font-medium italic opacity-50" />
      ),
      strong: (props) => (
        <strong {...props} className="font-bold text-neutral-900" />
      ),
      table: (props) => (
        <div className="my-4 overflow-hidden rounded-lg border border-neutral-200">
          <table {...props} className="w-full" />
        </div>
      ),
      thead: (props) => <thead {...props} className="bg-neutral-100" />,
      th: (props) => (
        <th
          {...props}
          className="border-b border-neutral-200 px-4 py-2 text-left font-semibold"
        />
      ),
      td: (props) => (
        <td {...props} className="border-b border-neutral-100 px-4 py-2" />
      ),
      blockquote: (props) => (
        <blockquote
          {...props}
          className="my-4 border-l-4 border-blue-400 py-1 pl-4 text-neutral-500 italic"
        />
      ),
      hr: () => <hr className="my-10 border-neutral-200" />,
      code: (props) => {
        const match = /language-(\w+)/.exec(props.className ?? "");

        if (!match) {
          return (
            <span className="mx-0.5 inline-block rounded-md bg-neutral-100 px-1.5 py-0.5 text-sm text-red-600">
              {props.children}
            </span>
          );
        }

        return (
          <CodeBlock language={match[1]}>
            {String(props.children).replace(/\n$/, "")}
          </CodeBlock>
        );
      },
      pre: (props) => <>{props.children}</>,
    }),
    [images],
  );

  return (
    <div className="prose">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
