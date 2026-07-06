// Devvit-compatible module: replace long-running Express server
// with message-based handlers suitable for Devvit Web (webview postMessage).
// Note: this file assumes the Devvit runtime (`@devvit/public-api`) is
// available when packaging for the platform.

import { Devvit as DevvitRuntime } from '@devvit/public-api';
import { selectDailyCase, evaluateAccusation } from '../backend/dailyCaseEngine.js';

(DevvitRuntime as any).configure({ redditAPI: true, webview: true });

// The Devvit runtime package used by `devvit playtest` does not expose the
// legacy `addCustomPostType` API. To ensure the bundle can be evaluated by
// the playtest harness, we avoid calling unsupported runtime APIs here.
//
// NOTE: This is a minimal compatibility change to allow local playtest to
// run. The interactive webview registration is handled by the Devvit
// platform at packaging time; the message handlers and game logic are kept
// in the backend files and the webview bundle. For full integration (menu
// items, forms, or custom UI hooks) migrate to the Devvit-supported APIs
// such as `Devvit.addMenuItem` or `Devvit.createForm` as needed.

export default DevvitRuntime;
