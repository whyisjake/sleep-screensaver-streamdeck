import streamDeck, {
  action,
  KeyDownEvent,
  SingletonAction,
} from "@elgato/streamdeck";
import { exec } from "child_process";
import { UUIDS } from "../ids";

function getSleepCommand(): string {
  if (process.platform === "darwin") {
    return "pmset sleepnow";
  } else if (process.platform === "win32") {
    return "rundll32.exe powrprof.dll,SetSuspendState 0,1,0";
  }
  throw new Error(`Unsupported platform: ${process.platform}`);
}

const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";

@action({ UUID: UUIDS.SLEEP })
export class SleepAction extends SingletonAction<never> {
  override async onKeyDown(ev: KeyDownEvent<never>): Promise<void> {
    streamDeck.logger.info(`Sleep action triggered on ${process.platform}`);

    try {
      const command = getSleepCommand();
      exec(command, { shell }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          streamDeck.logger.error(`Sleep command failed: ${error.message}`);
          return;
        }
        if (stderr) {
          streamDeck.logger.warn(`Sleep command stderr: ${stderr}`);
        }
        streamDeck.logger.info("Sleep command executed successfully");
      });
    } catch (e) {
      streamDeck.logger.error(`Sleep action error: ${e}`);
    }
  }
}
