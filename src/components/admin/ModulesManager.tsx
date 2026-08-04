'use client';

// Gerege Systems Development Team болон Claude AI хамтран бүтээв, 2026.
//
// Модулийн удирдлага (V4.0 Modular Platform) — супер админы дэлгэц.
// Асаах/унтраах нь restart-гүй: backend-ийн registry төлвөө DB-д хадгалж,
// route gate нь идэвхгүй модулийн бүх замыг 404 болгоно.

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Power, ShieldCheck, Puzzle } from 'lucide-react';
import { useT } from '../../lib/lang';
import { getJSON, sendJSON } from '../../lib/client';

interface AdminModule {
  id: string;
  name: string;
  kind: 'core' | 'business';
  enabled: boolean;
  depends_on?: string[];
  routes?: string[];
}

export default function ModulesManager() {
  const { T } = useT();
  const qc = useQueryClient();
  const [pending, setPending] = useState<AdminModule | null>(null);
  const [error, setError] = useState<string>('');

  const q = useQuery<AdminModule[]>({
    queryKey: ['admin', 'modules'],
    queryFn: async () => (await getJSON<{ data?: AdminModule[] }>('/api/admin/platform/modules')).data ?? [],
  });

  const toggle = useMutation({
    mutationFn: async (m: AdminModule) =>
      sendJSON(`/api/admin/platform/module/${m.id}`, 'PUT', { enabled: !m.enabled }),
    onSuccess: (res: { ok?: boolean; message?: string }) => {
      setPending(null);
      // Backend дүрэм зөрчсөнийг (core унтраах, хамаарагчтай модуль)
      // ИЛ харуулна — чимээгүй амжилтгүй болгохгүй.
      if (res && res.ok === false) {
        setError(res.message || T('modules.err'));
        return;
      }
      setError('');
      void qc.invalidateQueries({ queryKey: ['admin', 'modules'] });
      void qc.invalidateQueries({ queryKey: ['platform', 'modules'] });
    },
    onError: (e: unknown) => {
      setPending(null);
      setError(e instanceof Error ? e.message : T('modules.err'));
    },
  });

  const mods = q.data ?? [];
  const core = mods.filter((m) => m.kind === 'core');
  const business = mods.filter((m) => m.kind === 'business');

  const row = (m: AdminModule) => (
    <div key={m.id} className="modrow">
      <div className="modrow__main">
        <div className="modrow__name">
          {m.kind === 'core' ? <ShieldCheck size={15} /> : <Puzzle size={15} />}
          <span>{m.name || m.id}</span>
          <code className="modrow__id">{m.id}</code>
        </div>
        {m.depends_on && m.depends_on.length > 0 && (
          <div className="modrow__meta">{T('modules.dependsOn')}: {m.depends_on.join(', ')}</div>
        )}
        {m.routes && m.routes.length > 0 && (
          <div className="modrow__meta mono">{m.routes.join('  ')}</div>
        )}
      </div>
      <div className="modrow__side">
        <span className={`badge ${m.enabled ? 'badge--success' : ''}`}>
          {m.enabled ? T('modules.on') : T('modules.off')}
        </span>
        {m.kind === 'core' ? (
          // Core модуль зарчмын хувьд унтардаггүй — товчийг идэвхгүй
          // болгож шалтгааныг нь хэлнэ (дарж эхлээд алдаа авахаас дээр).
          <button type="button" className="btn btn--ghost" disabled title={T('modules.coreLocked')}>
            <Power size={15} />
          </button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={() => { setError(''); setPending(m); }}>
            <Power size={15} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <section className="card" aria-label={T('modules.title')}>
      <div className="card__head card__head--with-sub">
        <div className="card__title"><h2>{T('modules.title')}</h2></div>
        <span className="card__sub">{T('modules.sub')}</span>
      </div>

      {error && <p className="alert alert--danger" role="alert">{error}</p>}
      {q.isLoading && <p className="muted">{T('modules.loading')}</p>}
      {q.isError && <p className="alert alert--danger">{T('modules.loadErr')}</p>}

      {business.length > 0 && (
        <>
          <h3 className="modgroup">{T('modules.business')}</h3>
          {business.map(row)}
        </>
      )}
      {core.length > 0 && (
        <>
          <h3 className="modgroup">{T('modules.core')}</h3>
          {core.map(row)}
        </>
      )}

      {pending && (
        <div className="modconfirm" role="dialog" aria-modal="true">
          <div className="modconfirm__box">
            <p>
              {pending.enabled ? T('modules.confirmOff') : T('modules.confirmOn')}
              {' '}<strong>{pending.name || pending.id}</strong>?
            </p>
            {pending.enabled && (
              <p className="muted">{T('modules.offWarn')}</p>
            )}
            <div className="modconfirm__actions">
              <button type="button" className="btn" onClick={() => setPending(null)}>{T('common.cancel')}</button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={toggle.isPending}
                onClick={() => toggle.mutate(pending)}
              >
                {pending.enabled ? T('modules.off') : T('modules.on')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
