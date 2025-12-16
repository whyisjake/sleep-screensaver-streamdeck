import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";

@action({ UUID: "com.whyisjake.sleep-screensaver.sleep" })
export class SleepAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent<object>): Promise<void> {
    streamDeck.logger.info("Sleep action triggered");

    exec("pmset sleepnow", (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        streamDeck.logger.error(`Sleep command failed: ${error.message}`);
        return;
      }
      if (stderr) {
        streamDeck.logger.warn(`Sleep command stderr: ${stderr}`);
      }
      streamDeck.logger.info("Sleep command executed successfully");
    });
  }
}
