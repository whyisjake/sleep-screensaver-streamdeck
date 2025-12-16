# Copilot Instructions for Sleep Screensaver Stream Deck Plugin

## Project Overview

This is a Stream Deck plugin for macOS that provides two actions:
1. **Sleep Action**: Puts the Mac to sleep using `pmset sleepnow`
2. **Screensaver Action**: Starts the screensaver using `open -a ScreenSaverEngine`

The plugin is built with TypeScript and uses the Elgato Stream Deck SDK.

## Technology Stack

- **Language**: TypeScript (ES2022)
- **Runtime**: Node.js
- **Build Tool**: Rollup
- **SDK**: @elgato/streamdeck v0.3.0
- **Target Platform**: macOS only (uses macOS-specific commands)

## Project Structure

```
.
├── src/
│   ├── plugin.ts              # Main entry point, registers actions
│   └── actions/
│       ├── sleep.ts           # Sleep action implementation
│       └── screensaver.ts     # Screensaver action implementation
├── com.whyisjake.sleep-screensaver.sdPlugin/
│   ├── manifest.json          # Stream Deck plugin manifest
│   ├── bin/                   # Compiled JavaScript output
│   └── imgs/                  # Plugin icons and images
├── package.json
├── tsconfig.json
└── rollup.config.js
```

## Build Process

- **Build command**: `npm run build` - Compiles TypeScript to JavaScript using Rollup
- **Watch mode**: `npm run watch` - Automatically rebuilds on file changes
- **Link plugin**: `npm run link` - Links the plugin to Stream Deck for development
- **Output**: Code is compiled to `com.whyisjake.sleep-screensaver.sdPlugin/bin/plugin.js`

## Coding Conventions

### TypeScript

- Use strict TypeScript with all strict checks enabled
- Use ES2022 features and ES modules
- Use decorators for Stream Deck actions (e.g., `@action`)
- Always type function parameters and return types explicitly

### Action Implementation

- All actions should extend `SingletonAction` from `@elgato/streamdeck`
- Use the `@action` decorator with a unique UUID
- Implement `onKeyDown` for button press handling
- Use `streamDeck.logger` for logging (info, warn, error)

### Error Handling

- Always handle errors from `exec` commands
- Log errors using `streamDeck.logger.error()`
- Log warnings for stderr output using `streamDeck.logger.warn()`

### Code Style

- Use async/await patterns
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Prefer `const` over `let`

## macOS Specifics

This plugin is macOS-only and uses system commands:
- `pmset sleepnow` - Requires appropriate permissions to put the system to sleep
- `open -a ScreenSaverEngine` - Opens the screensaver application

When modifying or adding actions, ensure they use macOS-compatible commands.

## Stream Deck SDK Guidelines

- Actions are registered in `src/plugin.ts`
- Each action needs a unique UUID in the format `com.whyisjake.sleep-screensaver.{action}`
- The plugin connects to Stream Deck using `streamDeck.connect()`
- Use `streamDeck.logger.setLevel()` to control log verbosity

## Adding New Actions

To add a new action:
1. Create a new file in `src/actions/`
2. Extend `SingletonAction` and use the `@action` decorator
3. Implement `onKeyDown` method
4. Register the action in `src/plugin.ts`
5. Add corresponding icons to `com.whyisjake.sleep-screensaver.sdPlugin/imgs/actions/`
6. Update the manifest.json if needed

## Dependencies

- Keep dependencies minimal
- Only use `@elgato/streamdeck` for plugin functionality
- Use Node.js built-in modules (like `child_process`) when possible
- All dependencies should be compatible with the Stream Deck runtime environment

## Testing

There is no automated test infrastructure in this project. Changes should be manually tested by:
1. Building the plugin with `npm run build`
2. Linking it with `npm run link`
3. Testing the actions on actual Stream Deck hardware or Stream Deck Mobile

## Notes for AI Assistants

- This is a simple, focused plugin - avoid over-engineering
- Maintain consistency with existing code style
- Don't add unnecessary abstractions or complexity
- Test changes manually since there are no automated tests
- Remember this is macOS-specific - don't suggest cross-platform alternatives unless explicitly requested
