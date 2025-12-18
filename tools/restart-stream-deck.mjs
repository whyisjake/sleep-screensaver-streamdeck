import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { platform } from 'node:os';

const sh = promisify(exec);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function isRunningMac() {
  try {
    await sh('pgrep -x "Stream Deck"');
    return true;
  } catch {
    return false;
  }
}

async function quitMac() {
  // Try AppleScript first, then fall back to pkill
  try { await sh('osascript -e "tell application \"Elgato Stream Deck\" to quit"'); } catch {}
  try { await sh('pkill -x "Stream Deck"'); } catch {}
  // Wait up to ~10s for the process to go away
  for (let i = 0; i < 20; i++) {
    if (!(await isRunningMac())) return;
    await sleep(500);
  }
}

async function startMac() {
  const appNames = [
    'Elgato Stream Deck',
    'Stream Deck',
  ];
  for (let attempt = 0; attempt < 5; attempt++) {
    for (const name of appNames) {
      try {
        await sh(`open -a "${name}"`);
        // Give it a moment to boot
        await sleep(800);
        if (await isRunningMac()) return;
      } catch {}
    }
    await sleep(1000);
  }
  throw new Error('Failed to start Stream Deck after retries');
}

async function quitWindows() {
  try { await sh('taskkill /IM StreamDeck.exe /F'); } catch {}
}

async function startWindows() {
  // Attempt to start from common install location
  const cmd = 'powershell -NoProfile -Command "Start-Process \"$Env:LOCALAPPDATA\\Programs\\Elgato\\StreamDeck\\StreamDeck.exe\""';
  await sh(cmd);
}

(async () => {
  const plt = platform();
  if (plt === 'darwin') {
    await quitMac();
    await startMac();
    console.log('[restart-stream-deck] Restarted Stream Deck on macOS');
  } else if (plt === 'win32') {
    await quitWindows();
    await startWindows();
    console.log('[restart-stream-deck] Restarted Stream Deck on Windows');
  } else {
    console.log('[restart-stream-deck] Unsupported platform, skipping');
  }
})().catch((e) => {
  console.error('[restart-stream-deck] Failed:', e);
  process.exit(1);
});
