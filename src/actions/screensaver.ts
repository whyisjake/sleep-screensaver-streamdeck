import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";

@action({ UUID: "com.whyisjake.sleep-screensaver.screensaver" })
export class ScreensaverAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent<object>): Promise<void> {
    streamDeck.logger.info("Screensaver action triggered");

    exec("open -a ScreenSaverEngine", (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        streamDeck.logger.error(`Screensaver command failed: ${error.message}`);
        return;
      }
      if (stderr) {
        streamDeck.logger.warn(`Screensaver command stderr: ${stderr}`);
      }
      streamDeck.logger.info("Screensaver command executed successfully");
    });
  }
}
