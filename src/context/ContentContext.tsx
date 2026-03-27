import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type Section = {
  _id: string;
  key: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
};

type ContentCtx = {
  sections: Record<string, Section['content']>;
  loading: boolean;
  reload: () => void;
};

const ContentContext = createContext<ContentCtx>({
  sections: {},
  loading: true,
  reload: () => undefined,
});

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<Record<string, Section['content']>>({});
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/content/home`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch content');
      const page = await res.json();
      const map: Record<string, Section['content']> = {};
      for (const s of page.sections ?? []) {
        map[s.key] = s.content;
      }
      setSections(map);
    } catch {
      // keep existing / fallback to hardcoded
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchContent(); }, [fetchContent]);

  return (
    <ContentContext.Provider value={{ sections, loading, reload: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};

// Returns a typed section by key, falling back to `fallback` if CMS not loaded yet
export function useSection<T extends Record<string, unknown>>(key: string, fallback: T): T {
  const { sections } = useContext(ContentContext);
  const s = sections[key];
  return (s ?? fallback) as T;
}

export function useContentReload() {
  return useContext(ContentContext).reload;
}
