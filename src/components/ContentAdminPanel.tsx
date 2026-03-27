import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/src/lib/api';

type SectionType = 'text' | 'html' | 'image' | 'list' | 'faq' | 'review';

type PageListItem = { _id: string; slug: string; title: string };
type SectionItem = { _id: string; key: string; type: SectionType; content: unknown; order: number; isDeleted: boolean };
type PageFull = { _id: string; slug: string; title: string; __v: number; sections: SectionItem[] };
type AuditItem = { _id: string; entity: string; action: string; actorEmail: string; createdAt: string };

const SECTION_TYPES: SectionType[] = ['text', 'html', 'image', 'list', 'faq', 'review'];
const TYPE_COLOR: Record<SectionType, string> = {
  text: 'bg-blue-100 text-blue-700',
  html: 'bg-purple-100 text-purple-700',
  image: 'bg-pink-100 text-pink-700',
  list: 'bg-emerald-100 text-emerald-700',
  faq: 'bg-amber-100 text-amber-700',
  review: 'bg-orange-100 text-orange-700',
};
const ACTION_COLOR: Record<string, string> = {
  create: 'bg-emerald-100 text-emerald-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  restore: 'bg-amber-100 text-amber-700',
  login: 'bg-slate-100 text-slate-600',
  logout: 'bg-slate-100 text-slate-600',
};

export const ContentAdminPanel = () => {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [page, setPage] = useState<PageFull | null>(null);
  const [pageTitleDraft, setPageTitleDraft] = useState('');
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState<SectionItem[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [tab, setTab] = useState<'sections' | 'audit' | 'new'>('sections');

  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newSectionKey, setNewSectionKey] = useState('');
  const [newSectionType, setNewSectionType] = useState<SectionType>('text');
  const [newSectionOrder, setNewSectionOrder] = useState(0);
  const [newSectionContent, setNewSectionContent] = useState('{\n  "text": ""\n}');

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sortedSections = useMemo(
    () => [...(page?.sections ?? [])].sort((a, b) => a.order - b.order),
    [page],
  );

  const loadAll = async (slug = selectedSlug) => {
    setBusy(true); setError(null);
    try {
      const data = await api.get<PageListItem[]>('/content');
      setPages(data ?? []);
      const s = slug || data?.[0]?.slug || '';
      if (s) { setSelectedSlug(s); await loadPage(s); }
      const logs = await api.get<AuditItem[]>('/admin/content/audit?limit=30');
      setAudit(logs ?? []);
    } catch (e: any) { setError(e?.message ?? 'Ошибка загрузки'); }
    finally { setBusy(false); }
  };

  const loadPage = async (slug: string) => {
    const full = await api.get<PageFull>(`/content/${slug}`);
    setPage(full); setPageTitleDraft(full.title);
  };

  useEffect(() => { void loadAll(); }, []);
  useEffect(() => {
    if (selectedSlug) void loadPage(selectedSlug).catch((e: any) => setError(e?.message));
  }, [selectedSlug]);

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    try {
      await api.post('/admin/content/pages', { slug: newPageSlug.trim(), title: newPageTitle.trim() });
      const s = newPageSlug.trim(); setNewPageSlug(''); setNewPageTitle('');
      setSelectedSlug(s); await loadAll(s);
    } catch (e: any) { setError(e?.message ?? 'Не удалось создать страницу'); }
  };

  const savePageTitle = async () => {
    if (!page) return; setError(null);
    try {
      const updated = await api.patch<PageFull>(`/admin/content/pages/${page._id}`, { title: pageTitleDraft, __v: page.__v });
      setPage(updated);
      setPages(p => p.map(pg => pg._id === updated._id ? { ...pg, title: updated.title } : pg));
      const logs = await api.get<AuditItem[]>('/admin/content/audit?limit=30');
      setAudit(logs ?? []);
    } catch (e: any) { setError(e?.message ?? 'Не удалось сохранить'); }
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault(); if (!page) return; setError(null);
    let content: unknown = newSectionContent;
    try { content = JSON.parse(newSectionContent); } catch { /* keep as string */ }
    try {
      await api.post('/admin/content/sections', { pageId: page._id, key: newSectionKey.trim(), type: newSectionType, order: newSectionOrder, content });
      setNewSectionKey(''); setNewSectionType('text'); setNewSectionOrder(0); setNewSectionContent('{\n  "text": ""\n}');
      await loadAll(page.slug); setTab('sections');
    } catch (e: any) { setError(e?.message ?? 'Не удалось добавить секцию'); }
  };

  const updateSection = async (sectionId: string, patch: Partial<SectionItem>): Promise<boolean> => {
    if (!page) return false; setError(null);
    try {
      await api.patch(`/admin/content/sections/${sectionId}`, patch);
      await loadPage(page.slug);
      const logs = await api.get<AuditItem[]>('/admin/content/audit?limit=30');
      setAudit(logs ?? []);
      return true;
    } catch (e: any) { setError(e?.message ?? 'Не удалось обновить'); return false; }
  };

  const deleteSection = async (section: SectionItem) => {
    if (!page) return;
    try {
      await api.delete(`/admin/content/sections/${section._id}`);
      setRecentlyDeleted(p => [section, ...p.filter(s => s._id !== section._id)]);
      setActiveSection(a => a === section._id ? null : a);
      await loadPage(page.slug);
    } catch (e: any) { setError(e?.message ?? 'Ошибка удаления'); }
  };

  const restoreSection = async (sectionId: string) => {
    if (!page) return;
    try {
      await api.patch(`/admin/content/sections/${sectionId}/restore`);
      setRecentlyDeleted(p => p.filter(s => s._id !== sectionId));
      await loadPage(page.slug);
    } catch (e: any) { setError(e?.message ?? 'Ошибка восстановления'); }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Страница:</span>
          <select
            value={selectedSlug}
            onChange={e => setSelectedSlug(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-orange-500 bg-slate-50"
          >
            <option value="">Выберите...</option>
            {pages.map(p => <option key={p._id} value={p.slug}>{p.slug} — {p.title}</option>)}
          </select>
          {page && (
            <div className="flex items-center gap-2">
              <input
                value={pageTitleDraft}
                onChange={e => setPageTitleDraft(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 w-52"
              />
              <button type="button" onClick={() => void savePageTitle()}
                className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-700 transition">
                Сохранить
              </button>
            </div>
          )}
        </div>
        <button type="button" onClick={() => void loadAll()}
          disabled={busy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50">
          {busy ? '⟳ Загрузка…' : '↻ Обновить'}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-center gap-2">
          <span className="text-red-500">✕</span> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-200 rounded-2xl p-1">
        {(['sections', 'new', 'audit'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${tab === t ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>
            {t === 'sections' ? `Секции (${sortedSections.length})` : t === 'new' ? '+ Новая секция' : 'Аудит'}
          </button>
        ))}
      </div>

      {/* Sections tab */}
      {tab === 'sections' && (
        <div className="space-y-2">
          {/* Deleted notice */}
          {recentlyDeleted.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Удалённые (можно восстановить)</div>
              <div className="flex flex-wrap gap-2">
                {recentlyDeleted.map(s => (
                  <div key={s._id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-amber-200 text-sm">
                    <span className="font-semibold text-slate-800">{s.key}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLOR[s.type]}`}>{s.type}</span>
                    <button type="button" onClick={() => void restoreSection(s._id)}
                      className="text-xs font-bold text-emerald-600 hover:underline">Restore</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!sortedSections.length && !busy && (
            <div className="text-center py-12 text-slate-500">Нет активных секций. Добавьте первую.</div>
          )}

          {sortedSections.map(s => (
            <div key={s._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Section header row */}
              <button type="button"
                onClick={() => setActiveSection(a => a === s._id ? null : s._id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.order}
                </span>
                <span className="font-semibold text-slate-900 flex-1 truncate">{s.key}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${TYPE_COLOR[s.type]}`}>{s.type}</span>
                <span className="text-xs text-slate-400 flex-shrink-0 hidden md:block">{s._id.slice(-8)}</span>
                <span className={`text-slate-400 transition-transform duration-200 ${activeSection === s._id ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {/* Expanded editor */}
              {activeSection === s._id && (
                <SectionEditor
                  section={s}
                  onSave={patch => updateSection(s._id, patch)}
                  onDelete={() => void deleteSection(s)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* New section tab */}
      {tab === 'new' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h4 className="font-bold text-slate-900 mb-4 text-lg">Добавить секцию</h4>
          {!page && <p className="text-sm text-slate-500">Сначала выберите страницу сверху.</p>}
          {page && (
            <form onSubmit={createSection} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ключ секции</label>
                  <input value={newSectionKey} onChange={e => setNewSectionKey(e.target.value)} required
                    placeholder="hero, faq, stats…"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Тип</label>
                  <select value={newSectionType} onChange={e => setNewSectionType(e.target.value as SectionType)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                    {SECTION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Порядок</label>
                  <input type="number" value={newSectionOrder} onChange={e => setNewSectionOrder(+e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Контент (JSON)</label>
                <textarea value={newSectionContent} onChange={e => setNewSectionContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono text-xs outline-none focus:border-orange-500 bg-slate-950 text-green-400" />
              </div>
              <button type="submit"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 font-bold text-sm transition">
                Добавить секцию
              </button>
            </form>
          )}
        </div>
      )}

      {/* Audit tab */}
      {tab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <h4 className="font-bold text-slate-900 mb-3">Последние действия</h4>
          {!audit.length && <p className="text-sm text-slate-500">{busy ? 'Загрузка…' : 'Пока нет записей'}</p>}
          <div className="space-y-2">
            {audit.map(a => (
              <div key={a._id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${ACTION_COLOR[a.action] ?? 'bg-slate-100 text-slate-600'}`}>
                  {a.action}
                </span>
                <span className="text-sm text-slate-700 flex-1">{a.entity}</span>
                <span className="text-xs text-slate-400 truncate hidden md:block">{a.actorEmail}</span>
                <span className="text-xs text-slate-400 flex-shrink-0">{new Date(a.createdAt).toLocaleString('ru')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create page form */}
      <details className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-slate-600 hover:text-slate-900 select-none">
          + Создать новую страницу
        </summary>
        <form onSubmit={createPage} className="p-4 pt-2 grid md:grid-cols-3 gap-3">
          <input value={newPageSlug} onChange={e => setNewPageSlug(e.target.value)} placeholder="slug (home, about…)" required
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" />
          <input value={newPageTitle} onChange={e => setNewPageTitle(e.target.value)} placeholder="Название страницы" required
            className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" />
          <button type="submit" className="rounded-xl bg-orange-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-orange-600 transition">
            Создать
          </button>
        </form>
      </details>
    </div>
  );
};

// ─── Section editor ────────────────────────────────────────────────────────────

const SectionEditor = ({
  section,
  onSave,
  onDelete,
}: {
  section: SectionItem;
  onSave: (patch: Partial<SectionItem>) => Promise<boolean>;
  onDelete: () => void;
}) => {
  const [keyDraft, setKeyDraft] = useState(section.key);
  const [typeDraft, setTypeDraft] = useState<SectionType>(section.type);
  const [orderDraft, setOrderDraft] = useState(section.order);
  const [contentDraft, setContentDraft] = useState(JSON.stringify(section.content, null, 2));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setKeyDraft(section.key);
    setTypeDraft(section.type);
    setOrderDraft(section.order);
    setContentDraft(JSON.stringify(section.content, null, 2));
  }, [section]);

  const save = async () => {
    setMsg(null);
    let parsed: unknown;
    try { parsed = JSON.parse(contentDraft); }
    catch { setMsg({ ok: false, text: 'Невалидный JSON' }); return; }

    setSaving(true);
    const ok = await onSave({ key: keyDraft, type: typeDraft, order: Number(orderDraft), content: parsed });
    setSaving(false);
    if (ok) {
      setMsg({ ok: true, text: '✓ Сохранено' });
      setTimeout(() => setMsg(null), 2000);
    } else {
      setMsg({ ok: false, text: '✕ Ошибка сохранения' });
    }
  };

  return (
    <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Ключ</label>
          <input value={keyDraft} onChange={e => setKeyDraft(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Тип</label>
          <select value={typeDraft} onChange={e => setTypeDraft(e.target.value as SectionType)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500">
            {SECTION_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Порядок</label>
          <input type="number" value={orderDraft} onChange={e => setOrderDraft(+e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500" />
        </div>
        <div className="flex items-end">
          <span className="text-xs text-slate-400 pb-2">ID: {section._id.slice(-12)}</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">Контент (JSON)</label>
        <textarea
          value={contentDraft}
          onChange={e => setContentDraft(e.target.value)}
          rows={10}
          spellCheck={false}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-xs outline-none focus:border-orange-500 bg-slate-950 text-green-400 leading-relaxed"
        />
      </div>

      {msg && (
        <div className={`text-sm font-semibold px-3 py-2 rounded-xl ${msg.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={() => void save()} disabled={saving}
          className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold transition disabled:opacity-60">
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
        <button type="button" onClick={onDelete}
          className="rounded-xl border border-red-300 bg-white text-red-600 hover:bg-red-50 px-5 py-2.5 text-sm font-bold transition">
          Удалить
        </button>
      </div>
    </div>
  );
};
