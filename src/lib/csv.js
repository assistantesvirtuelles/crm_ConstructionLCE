// Shared helpers for mapping CSV headers (French/English, accent/BOM tolerant).

export function normalizeKey(key) {
  return String(key)
    .replace(/^﻿/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

// Turn { field: [aliases...] } into { normalizedAlias: field }.
export function buildAliasLookup(aliasMap) {
  const lookup = {};
  for (const [field, aliases] of Object.entries(aliasMap)) {
    for (const alias of aliases) lookup[normalizeKey(alias)] = field;
  }
  return lookup;
}
