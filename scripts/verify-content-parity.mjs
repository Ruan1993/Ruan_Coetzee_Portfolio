import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const legacyHtmlPath = existsSync(resolve(root, 'legacy.html')) ? 'legacy.html' : 'index.html';
const legacyHtml = readFileSync(resolve(root, legacyHtmlPath), 'utf8');
const expectedProjectCounts = {
  websites: 6,
  'gis-maps': 11,
  research: 2,
  logos: 9,
  'posters-stickers': 8,
  'qr-designs': 2,
};
const expectedCertificateCounts = {
  'ba-degree': 1,
  'bsc-honours-degree': 1,
  'ai-engineering': 5,
  'web-development-sql': 4,
};
const expectedMissingPaths = new Set([
  'Portfolio Content (For Website)/GIS & Remote Sensing Projects/Research Projects/GEOG 671 Mini Dissertation - R. Coetzee 30195543.pdf',
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countBy(records, key) {
  return records.reduce((counts, record) => {
    const value = record[key];
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function localPathFromLegacyPath(path) {
  return decodeURIComponent(path).replaceAll('\\', '/');
}

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

try {
  const { legacyProjects } = await server.ssrLoadModule('/src/data/legacyPortfolio.ts');
  const { certificateGroups } = await server.ssrLoadModule('/src/data/certificates.ts');
  const certificates = certificateGroups.flatMap((group) => group.records);

  assert(legacyProjects.length === 38, `Expected 38 project/gallery records, found ${legacyProjects.length}.`);
  assert(certificates.length === 11, `Expected 11 certificate records, found ${certificates.length}.`);

  const actualProjectCounts = countBy(legacyProjects, 'category');
  const actualCertificateCounts = countBy(certificates, 'category');
  assert(JSON.stringify(actualProjectCounts) === JSON.stringify(expectedProjectCounts), `Project category counts differ: ${JSON.stringify(actualProjectCounts)}.`);
  assert(JSON.stringify(actualCertificateCounts) === JSON.stringify(expectedCertificateCounts), `Certificate category counts differ: ${JSON.stringify(actualCertificateCounts)}.`);

  const records = [...legacyProjects, ...certificates];
  const legacyParityRecords = records.filter((record) => record.origin !== 'verified-addition');
  const missingFromLegacyHtml = legacyParityRecords.filter((record) => !legacyHtml.includes(record.legacyPath));
  assert(missingFromLegacyHtml.length === 0, `Typed records not found verbatim in ${legacyHtmlPath}: ${missingFromLegacyHtml.map((record) => record.id).join(', ')}.`);

  const missingAssets = legacyParityRecords
    .filter((record) => !record.legacyPath.startsWith('http'))
    .map((record) => ({ ...record, normalizedPath: localPathFromLegacyPath(record.legacyPath) }))
    .filter((record) => !existsSync(resolve(root, record.normalizedPath)));
  const unexpectedMissingAssets = missingAssets.filter((record) => !expectedMissingPaths.has(record.normalizedPath));
  assert(unexpectedMissingAssets.length === 0, `Unexpected missing assets: ${unexpectedMissingAssets.map((record) => record.normalizedPath).join(', ')}.`);

  const unexpectedWeddingRecords = records.filter((record) => /c\s*(?:&|and)\s*c\s+wedding/i.test(`${record.title} ${record.description ?? ''}`));
  assert(unexpectedWeddingRecords.length === 0, 'C&C Wedding must not be published before 9 January 2027.');

  const additions = legacyProjects.filter((record) => record.origin === 'verified-addition');
  assert(additions.length === 2, `Expected 2 verified additions, found ${additions.length}.`);
  console.log(`Verified ${legacyParityRecords.length} legacy records, ${additions.length} approved additions, and ${certificates.length} certificate records.`);
  console.log(`Expected missing assets (${missingAssets.length}):`);
  for (const record of missingAssets) console.log(`- ${record.normalizedPath}`);
} finally {
  await server.close();
}
