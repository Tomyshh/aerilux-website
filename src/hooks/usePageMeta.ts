import { useEffect } from 'react';

const SITE_NAME = 'Aerilux';

/**
 * Updates document title and meta description for SEO.
 * Also updates Open Graph and Twitter meta tags for correct sharing per page.
 */
export function usePageMeta(
  title: string,
  description: string,
  options?: { canonicalPath?: string }
) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (selector: string, attr: 'content' | 'property' | 'name', value: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement | null;
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="title"]', 'content', fullTitle);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);

    if (options?.canonicalPath) {
      const canonical = `https://www.aerilux.io${options.canonicalPath}`;
      const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (link) link.href = canonical;
    }
  }, [title, description, options?.canonicalPath]);
}
