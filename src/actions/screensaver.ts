import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";

function getScreensaverCommand(): string {
  if (process.platform === "darwin") {
    return "open -a ScreenSaverEngine";
  } else if (process.platform === "win32") {
    return "%windir%\\system32\\scrnsave.scr /s";
  }
  throw new Error(`Unsupported platform: ${process.platform}`);
}

@action({ UUID: "com.whyisjake.sleep-screensaver.screensaver" })
export class ScreensaverAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent<object>): Promise<void> {
    streamDeck.logger.info(`Screensaver action triggered on ${process.platform}`);

    try {
      const command = getScreensaverCommand();
      exec(command, { shell: true }, (error: Error | null, stdout: string, stderr: string) => {
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
