import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_PLUGIN_ID = 'com.whyisjake.sleep-screensaver';
const variant = (process.env.STREAM_DECK_VARIANT || 'prod').toLowerCase();
const targetFolder = variant === 'dev'
  ? 'com.whyisjake.sleep-screensaver.dev.sdPlugin'
  : 'com.whyisjake.sleep-screensaver.sdPlugin';

const targetManifestPath = resolve(__dirname, '..', targetFolder, 'manifest.json');
const sourceManifestPath = resolve(__dirname, '..', 'com.whyisjake.sleep-screensaver.sdPlugin', 'manifest.json');

const nameBase = 'Sleep & Screensaver';

(async () => {
  // Always read from the source (production) manifest
  const buf = await readFile(sourceManifestPath, 'utf8');
  const manifest = JSON.parse(buf);

  const pluginId = variant === 'dev' ? `${BASE_PLUGIN_ID}.dev` : BASE_PLUGIN_ID;
  manifest.UUID = pluginId;
  manifest.Name = variant === 'dev' ? `${nameBase} (Dev)` : nameBase;

  if (Array.isArray(manifest.Actions)) {
    for (const act of manifest.Actions) {
      if (typeof act.UUID === 'string') {
        // Normalize to base IDs first, then re-apply variant
        const suffix = act.UUID.endsWith('.screensaver') ? '.screensaver' : '.sleep';
        act.UUID = `${pluginId}${suffix}`;
      }
    }
  }

  // Ensure target folder exists
  await mkdir(resolve(__dirname, '..', targetFolder), { recursive: true });
  await writeFile(targetManifestPath, JSON.stringify(manifest, null, '\t') + '\n', 'utf8');
  console.log(`[prepare-manifest] Wrote ${targetManifestPath} for variant: ${variant}`);

  // Copy assets (imgs/) from source plugin folder so icons resolve
  try {
    const srcImgs = resolve(__dirname, '..', 'com.whyisjake.sleep-screensaver.sdPlugin', 'imgs');
    const dstImgs = resolve(__dirname, '..', targetFolder, 'imgs');
    await cp(srcImgs, dstImgs, { recursive: true, force: true });
    console.log(`[prepare-manifest] Synced images to ${dstImgs}`);
  } catch (e) {
    console.warn('[prepare-manifest] Skipped copying images:', e?.message || e);
  }
})().catch((e) => {
  console.error('[prepare-manifest] Failed:', e);
  process.exit(1);
});
