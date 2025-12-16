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

let SleepAction = class SleepAction extends SingletonAction {
    async onKeyDown(ev) {
        streamDeck.logger.info("Sleep action triggered");
        exec("pmset sleepnow", (error, stdout, stderr) => {
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
};
SleepAction = __decorate([
    action({ UUID: "com.whyisjake.sleep-screensaver.sleep" })
], SleepAction);

let ScreensaverAction = class ScreensaverAction extends SingletonAction {
    async onKeyDown(ev) {
        streamDeck.logger.info("Screensaver action triggered");
        exec("open -a ScreenSaverEngine", (error, stdout, stderr) => {
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
