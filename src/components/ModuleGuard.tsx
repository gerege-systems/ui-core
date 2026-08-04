// ModuleGuard — идэвхгүй модулийн UI-г нуудаг wrapper (V4.0 Modular Platform).
//
// Хэрэглээ (жишээ: AI чат зөвхөн ai модуль идэвхтэй үед):
//
//   <ModuleGuard module="ai">
//     <AiChatView />
//   </ModuleGuard>
//
// fallback өгвөл идэвхгүй үед түүнийг харуулна (default: юу ч үгүй).
// АЮУЛГҮЙ БАЙДЛЫН ХИЛ БИШ — backend gate идэвхгүй модулийн API-г 404-өөр
// хаадаг; энэ нь зөвхөн UX (үхсэн цэс/дэлгэц харуулахгүй).
'use client';

import React from 'react';
import { useModuleEnabled } from '../lib/modules';

export default function ModuleGuard({
  module: moduleID,
  fallback = null,
  children,
}: {
  module: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const enabled = useModuleEnabled(moduleID);
  return <>{enabled ? children : fallback}</>;
}
