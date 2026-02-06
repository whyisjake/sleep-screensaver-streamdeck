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
    // Send WM_SYSCOMMAND (0x0112) with SC_SCREENSAVE (0xF140) to HWND_BROADCAST
    // to start the user's configured screensaver
    return `powershell -NoProfile -Command "Add-Type -TypeDefinition 'using System;using System.Runtime.InteropServices;public class SS{[DllImport(\\\"user32.dll\\\")]public static extern int SendMessage(IntPtr h,uint m,IntPtr w,IntPtr l);}';[SS]::SendMessage([IntPtr]::new(0xFFFF),0x0112,[IntPtr]::new(0xF140),[IntPtr]::Zero)"`;
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
