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


function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
}
function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const BASE_PLUGIN_ID = "com.whyisjake.sleep-screensaver";
// Value injected by rollup-replace at build time
const VARIANT = ("dev").toLowerCase();
const PLUGIN_ID = VARIANT === "dev" ? `${BASE_PLUGIN_ID}.dev` : BASE_PLUGIN_ID;
const UUIDS = {
    SLEEP: `${PLUGIN_ID}.sleep`,
    SCREENSAVER: `${PLUGIN_ID}.screensaver`,
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
const shell$1 = process.platform === "win32" ? "cmd.exe" : "/bin/sh";
let SleepAction = (() => {
    let _classDecorators = [action({ UUID: UUIDS.SLEEP })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SingletonAction;
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        async onKeyDown(ev) {
            streamDeck.logger.info(`Sleep action triggered on ${process.platform}`);
            try {
                const command = getSleepCommand();
                exec(command, { shell: shell$1 }, (error, stdout, stderr) => {
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
    });
    return _classThis;
})();

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
const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";
let ScreensaverAction = (() => {
    let _classDecorators = [action({ UUID: UUIDS.SCREENSAVER })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SingletonAction;
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        async onKeyDown(ev) {
            streamDeck.logger.info(`Screensaver action triggered on ${process.platform}`);
            try {
                const command = getScreensaverCommand();
                exec(command, { shell }, (error, stdout, stderr) => {
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
    });
    return _classThis;
})();

// Set up logging
streamDeck.logger.setLevel(LogLevel.DEBUG);
// Register actions
streamDeck.actions.registerAction(new SleepAction());
streamDeck.actions.registerAction(new ScreensaverAction());
// Connect to Stream Deck
streamDeck.connect();
//# sourceMappingURL=plugin.js.map
