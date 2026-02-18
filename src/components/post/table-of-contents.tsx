/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useLayoutEffect, useState } from "react";

interface HeadingEl {
  id: string;
  text: string;
  level: number;
}

function getAllHeadings(): HeadingEl[] {
  const elements = Array.from(document.querySelectorAll("h1, h2, h3"));
  const idCount: Record<string, number> = {};

  elements.forEach((el) => {
    if (idCount[el.id] >= 1) {
      idCount[el.id]++;
      el.id = `${el.id}-${idCount[el.id] - 1}`;
    } else {
      idCount[el.id] = 1;
    }
  });

  return elements.map((el) => ({
    id: el.id,
    text: el.textContent ?? "",
    level: Number(el.nodeName[1]),
  }));
}

function getCurrentHeadingId(headings: HeadingEl[]): string {
  const elements = headings
    .map(({ id }) => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  const current =
    elements.filter((el) => el.getBoundingClientRect().top < 80).reverse()[0] ??
    elements[0];

  return current?.id ?? "";
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<HeadingEl[]>([]);
  const [activeId, setActiveId] = useState("");

  useLayoutEffect(() => {
    const allHeadings = getAllHeadings();
    const [, ...contentHeadings] = allHeadings;
    setHeadings(contentHeadings);
    setActiveId(getCurrentHeadingId(contentHeadings));
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const wrapper = document.getElementById("content-wrapper");
    if (!wrapper) return;

    const handleScroll = () => {
      setActiveId(getCurrentHeadingId(headings));
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => wrapper.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav>
      <h4 className="mb-4 text-xs font-bold tracking-wider text-blue-500 uppercase">
        Table of Contents
      </h4>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
            <a
              href={`#${id}`}
              className="relative block text-sm leading-snug transition-all duration-200"
            >
              {text}
              {activeId === id && (
                <div className="absolute top-0 left-[-8px] h-5 w-0.5 bg-blue-500" />
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
