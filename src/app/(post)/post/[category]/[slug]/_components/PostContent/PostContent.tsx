'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import Link from 'next/link';
import Image from 'next/image';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { replaceSpaceToHyphen } from '@/lib/utils';

import PostContentImg from './PostContentImg';

import Post from '@/types/post';

import { SpecialComponents } from 'react-markdown/lib/ast-to-react';
import { postContent, postThumbnail } from './PostContent.css';

interface Props {
  children: string;
  post: Post;
}

const PostContent = ({ children, post }: Props) => {
  const title = post.title;

  const customComponent: Partial<SpecialComponents> = useMemo(() => {
    return {
      p({ ...props }) {
        const isImage = props.node.children[0].tagName === 'img';
        if (isImage) {
          const image = post.images[props.node.children[0].properties.src];

          return <PostContentImg image={image} alt={props.node.children[0].properties.alt} />;
        }
        return <p>{props.children}</p>;
      },

      a({ ...props }) {
        return <Link href={props.href}>{props.children}</Link>;
      },

      h1({ ...props }) {
        return <h1 id={replaceSpaceToHyphen(props.children[0])}>{props.children}</h1>;
      },

      h2({ ...props }) {
        return <h2 id={replaceSpaceToHyphen(props.children[0])}>{props.children}</h2>;
      },

      h3({ ...props }) {
        return <h3 id={replaceSpaceToHyphen(props.children[0])}>{props.children}</h3>;
      },

      h4({ ...props }) {
        return <h4 id={replaceSpaceToHyphen(props.children[0])}>{props.children}</h4>;
      },

      img({ ...props }) {
        const image = post.images[props.src];

        return <PostContentImg image={image} alt={props.alt} />;
      },

      code({ ...props }) {
        const match = /language-(\w+)/.exec(props.className!);

        if (!match) {
          return <code className="small-code">{props.children}</code>;
        }

        const [, language] = match;

        return (
          <SyntaxHighlighter style={vscDarkPlus} language={language}>
            {String(props.children)}
          </SyntaxHighlighter>
        );
      },
    };
  }, [post]);

  return (
    <div className={postContent}>
      <div className={postThumbnail}>
        <Image src={post.thumbnail} fill sizes="100%" placeholder="blur" loading="lazy" alt={`${title!}-thumbnail`} />
      </div>
      <ReactMarkdown
        components={customComponent}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        className="post"
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default PostContent;
