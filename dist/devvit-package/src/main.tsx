// Devvit-compatible module: replace long-running Express server
// with message-based handlers suitable for Devvit Web (webview postMessage).
// Note: this file assumes the Devvit runtime (`@devvit/public-api`) is
// available when packaging for the platform.

import { Devvit as DevvitRuntime } from '@devvit/public-api';
import { selectDailyCase, evaluateAccusation } from '../backend/dailyCaseEngine.js';

(DevvitRuntime as any).configure({ redditAPI: true, webview: true });

(DevvitRuntime as any).addCustomPostType({
  name: 'Cipher Bureau Game',
  height: 'tall',
  render: (context: any) => {
    const dayKey = new Date().toISOString().slice(0, 10);
    const initialCase = selectDailyCase(dayKey);

    const onMessageFromWebview = async (message: any) => {
      const msg = message?.type ? message : message?.data || {};
      const id = msg.id;

      if (msg.type === 'INIT_GAME') {
        context.ui.webView.postMessage('gameWebview', {
          type: 'LOAD_CASE',
          data: {
            ...initialCase,
            clue: { title: initialCase.clue?.title, prompt: initialCase.clue?.prompt }
          }
        });
      }

      if (msg.type === 'SUBMIT_ACCUSATION') {
        const result = evaluateAccusation(initialCase, msg.payload?.selection || msg.selection);

        try {
          if (result.correct) {
            const userKey = 'leaderboard';
            const userName = msg.payload?.author || msg.user?.name || 'u/Unknown';
            let board: Record<string, number> = {};
            try {
              board = (await context.storage.get(userKey)) || {};
            } catch {
              board = {};
            }
            board[userName] = (board[userName] || 0) + 10;
            try {
              await context.storage.set(userKey, board);
            } catch {
              // ignore storage errors
            }
            context.ui.webView.postMessage('gameWebview', { type: 'LEADERBOARD_UPDATED', data: board, inResponseTo: id });

            try {
              const thresholds = [150, 60, 10] as const;
              const labels: Record<number, string> = { 150: 'Master Sleuth', 60: 'Inspector', 10: 'Beat Detective' };
              const newScore = board[userName] || 0;
              const grantedScore = [...thresholds].reverse().find((t) => newScore >= t);
              if (grantedScore && context.reddit && context.reddit.flair && context.post?.subreddit) {
                const flairText = labels[grantedScore];
                try {
                  await context.reddit.flair.set({ subredditName: context.post.subreddit, username: userName, flairText });
                } catch {
                  // ignore flair errors
                }
              }
            } catch {
              // ignore flair errors
            }
          }
        } catch {
          // ignore storage errors
        }

        context.ui.webView.postMessage('gameWebview', { type: 'ACCUSATION_RESULT', data: result, inResponseTo: id });
      }

      if (msg.type === 'CLUE_UNLOCK') {
        const attempt = msg.payload?.attempt ?? msg.attempt;
        const correct = String(attempt || '').trim().toUpperCase() === String(initialCase.clue?.answer || '').trim().toUpperCase();
        context.ui.webView.postMessage('gameWebview', {
          type: 'CLUE_UNLOCK_RESULT',
          data: { unlocked: correct, message: correct ? 'Unlocked' : 'Incorrect' },
          inResponseTo: id
        });
      }

      if (msg.type === 'POST_COMMENT') {
        const payload = msg.payload || {};
        const postId = context.post?.id || 'global';
        const key = `comments_${postId}`;
        const comment = { id: Date.now(), author: payload.author || 'u/Unknown', text: payload.text };
        try {
          const existing = (await context.storage.get(key)) || [];
          const updated = [comment, ...existing].slice(0, 200);
          await context.storage.set(key, updated);
          context.ui.webView.postMessage('gameWebview', { type: 'COMMENTS_UPDATED', data: updated, inResponseTo: id });
        } catch {
          context.ui.webView.postMessage('gameWebview', { type: 'COMMENTS_UPDATED', data: [comment], inResponseTo: id });
        }
      }

      if (msg.type === 'REQUEST_COMMENTS') {
        const postId = context.post?.id || 'global';
        const key = `comments_${postId}`;
        try {
          const existing = (await context.storage.get(key)) || [];
          context.ui.webView.postMessage('gameWebview', { type: 'COMMENTS_UPDATED', data: existing, inResponseTo: id });
        } catch {
          context.ui.webView.postMessage('gameWebview', { type: 'COMMENTS_UPDATED', data: [], inResponseTo: id });
        }
      }

      if (msg.type === 'REQUEST_LEADERBOARD') {
        try {
          const board = (await context.storage.get('leaderboard')) || {};
          context.ui.webView.postMessage('gameWebview', { type: 'LEADERBOARD_UPDATED', data: board, inResponseTo: id });
        } catch {
          context.ui.webView.postMessage('gameWebview', { type: 'LEADERBOARD_UPDATED', data: {}, inResponseTo: id });
        }
      }
    };

    return (
      <vstack grow alignment="center middle">
        <webview id="gameWebview" url="index.html" onMessage={onMessageFromWebview} grow />
      </vstack>
    );
  }
});

export default DevvitRuntime;
