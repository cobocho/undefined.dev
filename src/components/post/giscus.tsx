"use client";

import { useEffect, useRef } from "react";

import { useTheme } from "../theme-provider";

export const Giscus = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const giscusTheme = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) {
      return;
    }

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    scriptElem.setAttribute("data-repo", "cobocho/cobocho.dev.comments");
    scriptElem.setAttribute("data-repo-id", "R_kgDOJhwQXw");
    scriptElem.setAttribute("data-category", "Announcements");
    scriptElem.setAttribute("data-category-id", "DIC_kwDOJhwQX84CWani");
    scriptElem.setAttribute("data-mapping", "pathname");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "0");
    scriptElem.setAttribute("data-input-position", "bottom");
    scriptElem.setAttribute("data-theme", giscusTheme);
    scriptElem.setAttribute("data-lang", "ko");
    scriptElem.setAttribute("crossorigin", "anonymous");

    ref.current.appendChild(scriptElem);
  }, [giscusTheme]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame",
    );
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: giscusTheme } } },
      "https://giscus.app",
    );
  }, [giscusTheme]);

  return <section id="giscus" ref={ref} />;
};
