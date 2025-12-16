import streamDeck, { action, SingletonAction, LogLevel } from '@elgato/streamdeck';
import { exec } from 'child_process';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function getSleepCommand() {
    if (process.platform === "darwin") {
        return "pmset sleepnow";
    }
    else if (process.platform === "win32") {
        return "rundll32.exe powrprof.dll,SetSuspendState 0,1,0";
    }
    throw new Error(`Unsupported platform: ${process.platform}`);
}
let SleepAction = class SleepAction extends SingletonAction {
    async onKeyDown(ev) {
        streamDeck.logger.info(`Sleep action triggered on ${process.platform}`);
        try {
            const command = getSleepCommand();
            exec(command, { shell: true }, (error, stdout, stderr) => {
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
        catch (e) {
            streamDeck.logger.error(`Sleep action error: ${e}`);
        }
    }
};
SleepAction = __decorate([
    action({ UUID: "com.whyisjake.sleep-screensaver.sleep" })
], SleepAction);

function getScreensaverCommand() {
    if (process.platform === "darwin") {
        return "open -a ScreenSaverEngine";
    }
    else if (process.platform === "win32") {
        const windir = process.env.SystemRoot || process.env.windir || "C:\\Windows";
        return `${windir}\\system32\\scrnsave.scr /s`;
    }
    throw new Error(`Unsupported platform: ${process.platform}`);
}
let ScreensaverAction = class ScreensaverAction extends SingletonAction {
    async onKeyDown(ev) {
        streamDeck.logger.info(`Screensaver action triggered on ${process.platform}`);
        try {
            const command = getScreensaverCommand();
            exec(command, { shell: true }, (error, stdout, stderr) => {
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
        catch (e) {
            streamDeck.logger.error(`Screensaver action error: ${e}`);
        }
    }
};
ScreensaverAction = __decorate([
    action({ UUID: "com.whyisjake.sleep-screensaver.screensaver" })
], ScreensaverAction);

// Set up logging
streamDeck.logger.setLevel(LogLevel.DEBUG);
// Register actions
streamDeck.actions.registerAction(new SleepAction());
streamDeck.actions.registerAction(new ScreensaverAction());
// Connect to Stream Deck
streamDeck.connect();
//# sourceMappingURL=plugin.js.map
