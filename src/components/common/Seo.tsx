import React, { useEffect } from "react";

interface SeoProps {
  title: string; // <60 chars
  description?: string; // <160 chars
  canonical?: string;
}

export const Seo: React.FC<SeoProps> = ({ title, description, canonical }) => {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (description) {
      if (metaDesc) metaDesc.setAttribute("content", description);
      else {
        const m = document.createElement("meta");
        m.name = "description";
        m.content = description;
        document.head.appendChild(m);
      }
    }

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical]);
  return null;
};
