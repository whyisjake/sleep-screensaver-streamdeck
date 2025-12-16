import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { SleepAction } from "./actions/sleep";
import { ScreensaverAction } from "./actions/screensaver";

// Set up logging
streamDeck.logger.setLevel(LogLevel.DEBUG);

// Register actions
streamDeck.actions.registerAction(new SleepAction());
streamDeck.actions.registerAction(new ScreensaverAction());

// Connect to Stream Deck
streamDeck.connect();
