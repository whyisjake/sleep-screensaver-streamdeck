import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";
import { UUIDS } from "../ids";

function getScreensaverCommand(): string {
  if (process.platform === "darwin") {
    return "open -a ScreenSaverEngine";
  } else if (process.platform === "win32") {
    const windir = process.env.SystemRoot || process.env.windir || "C:\\Windows";
    return `${windir}\\system32\\scrnsave.scr /s`;
  }
  throw new Error(`Unsupported platform: ${process.platform}`);
}

const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";

@action({ UUID: UUIDS.SCREENSAVER })
export class ScreensaverAction extends SingletonAction<never> {
  override async onKeyDown(ev: KeyDownEvent<never>): Promise<void> {
    streamDeck.logger.info(`Screensaver action triggered on ${process.platform}`);

    try {
      const command = getScreensaverCommand();
      exec(command, { shell }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          streamDeck.logger.error(`Screensaver command failed: ${error.message}`);
          return;
        }
        if (stderr) {
          streamDeck.logger.warn(`Screensaver command stderr: ${stderr}`);
        }
        streamDeck.logger.info("Screensaver command executed successfully");
      });
    } catch (e) {
      streamDeck.logger.error(`Screensaver action error: ${e}`);
    }
  }
}
