import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, Copy, Sparkles, ShieldAlert, Trophy } from 'lucide-react';
import { selectDailyCase } from '../../../backend/dailyCaseEngine.js';

const STORAGE_KEY = 'cipher-bureau-progress';

function readProgress() {
  if (typeof window === 'undefined') return { streak: 0, reputation: 0 };
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return { streak: 0, reputation: 0 };
  }
}

function writeProgress(progress) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function DailyCaseApp({ onBack }) {
  const [caseData, setCaseData] = useState(null);
  const [view, setView] = useState('entry');
  const [selection, setSelection] = useState({ suspectId: '', evidenceId: '', motiveId: '' });
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [streak, setStreak] = useState(() => readProgress().streak || 0);
  const [reputation, setReputation] = useState(() => readProgress().reputation || 0);
  const [revealPhase, setRevealPhase] = useState(0);
  const [commentDraft, setCommentDraft] = useState('');
  const [clueInput, setClueInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [communityComments, setCommunityComments] = useState([
    { id: 1, author: 'u/CaseHunter', text: 'The timeline points to the missing ledger.' },
    { id: 2, author: 'u/RedditSleuth', text: 'The motive feels personal, not financial.' },
    { id: 3, author: 'u/ClueChaser', text: 'The interview quote is the missing key.' }
  ]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    let didResolve = false;

    const handleMessage = (event) => {
      const msg = event.data;
      // Devvit-style messages (from parent webview handler)
      if (msg?.type === 'LOAD_CASE' && msg.data) {
        didResolve = true;
        setCaseData(msg.data);
        setStreak(msg.data.streak || 0);
        setReputation(msg.data.reputation || 0);
        setStartedAt(Date.now());
      }

      if (msg?.type === 'ACCUSATION_RESULT' && msg.data) {
        setFeedback({ correct: !!msg.data.correct, message: msg.data.message });
        if (msg.data.correct) {
          setStreak((prev) => prev + 1);
          setReputation((prev) => prev + 10);
          setView('results');
        }
      }

      if (msg?.type === 'CLUE_UNLOCK_RESULT' && msg.data) {
        if (msg.data.unlocked) setUnlocked(true);
      }
      if (msg?.type === 'COMMENTS_UPDATED' && Array.isArray(msg.data)) {
        setCommunityComments(msg.data);
      }
      if (msg?.type === 'LEADERBOARD_UPDATED' && msg.data) {
        // msg.data is a map of user->score
        const entries = Object.entries(msg.data || {}).map(([user, score]) => ({ user, score }));
        entries.sort((a, b) => b.score - a.score);
        setLeaderboard(entries.slice(0, 10));
        // Update local reputation if current user present
        const current = entries.find((e) => e.user === (window?.REDDIT_USER || 'u/You'));
        if (current) setReputation(current.score);
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      if (!didResolve) {
        const fallbackCase = selectDailyCase(new Date().toISOString().slice(0, 10));
        setCaseData(fallbackCase);
        setStartedAt(Date.now());
      }
    }, 1200);

    window.addEventListener('message', handleMessage);
    // Ask the parent (Devvit host) for the initial case and comments
    window.parent.postMessage({ type: 'INIT_GAME' }, '*');
    window.parent.postMessage({ type: 'REQUEST_COMMENTS' }, '*');
    window.parent.postMessage({ type: 'REQUEST_LEADERBOARD' }, '*');

    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!startedAt || view === 'results') return;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, view]);

  useEffect(() => {
    if (!caseData) return;
    const timer = window.setInterval(() => {
      setRevealPhase((prev) => (prev < 3 ? prev + 1 : 3));
    }, 800);
    return () => window.clearInterval(timer);
  }, [caseData]);

  useEffect(() => {
    writeProgress({ streak, reputation });
  }, [streak, reputation]);

  const selectOption = (type, value) => {
    setSelection((prev) => ({ ...prev, [type]: value }));
  };

  const submitAccusation = () => {
    if (!caseData) return;

    const payload = { caseId: caseData.id, selection };
    // If hosted inside a parent (Devvit), post message to parent for evaluation
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SUBMIT_ACCUSATION', payload: { caseId: caseData.id, selection, author: 'u/You' } }, '*');
      return;
    }

    // Fallback: try local server evaluation (dev)
    fetch('/api/daily-case/accuse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.correct) {
          setFeedback({ correct: true, message: 'Correct! Your choices match the evidence.' });
          window.parent.postMessage({ type: 'RESOLVE_SUCCESS' }, '*');
          setStreak((prev) => prev + 1);
          setReputation((prev) => prev + 10);
          setView('results');
        } else {
          setFeedback({ correct: false, message: result.message || 'Wrong answer. Check the clues and try again.' });
        }
      })
      .catch(() => {
        const sol = caseData.solution;
        const isCorrect = sol && selection.suspectId === sol.suspectId && selection.evidenceId === sol.evidenceId && selection.motiveId === sol.motiveId;
        if (isCorrect) {
          setFeedback({ correct: true, message: 'Correct! Your choices match the evidence.' });
          window.parent.postMessage({ type: 'RESOLVE_SUCCESS' }, '*');
          setStreak((prev) => prev + 1);
          setReputation((prev) => prev + 10);
          setView('results');
        } else {
          setFeedback({ correct: false, message: 'Wrong answer. Check the clues and try again.' });
        }
      });
  };

  const unlockClue = async () => {
    if (!caseData) return;
    setUnlocking(true);
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'CLUE_UNLOCK', payload: { caseId: caseData.id, attempt: clueInput } }, '*');
        setUnlocking(false);
        return;
      }

      const res = await fetch('/api/clue-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseData.id, attempt: clueInput })
      });
      const j = await res.json();
      if (j.unlocked) setUnlocked(true);
    } catch (e) {
      // fallback: if the client has the answer (local dev), allow unlock by matching
      if (caseData.clue?.answer && String(clueInput).trim().toUpperCase() === String(caseData.clue.answer).trim().toUpperCase()) {
        setUnlocked(true);
      }
    } finally {
      setUnlocking(false);
    }
  };

  const playerRank = useMemo(() => {
    if (reputation >= 150) return 'Master Sleuth';
    if (reputation >= 60) return 'Inspector';
    if (reputation >= 10) return 'Beat Detective';
    return 'Cadet';
  }, [reputation]);

  const rankProgress = useMemo(() => {
    if (reputation >= 150) return 100;
    if (reputation >= 60) return ((reputation - 60) / 90) * 100;
    if (reputation >= 10) return ((reputation - 10) / 50) * 100;
    return (reputation / 10) * 100;
  }, [reputation]);

  const communityPulse = useMemo(() => {
    const base = 180 + streak * 16 + Math.min(reputation, 120);
    return {
      solved: base,
      trend: `+${Math.min(12, streak + 2)}% today`,
      note: 'The community is actively cracking this case.'
    };
  }, [streak, reputation]);

  const addComment = () => {
    const trimmed = commentDraft.trim();
    if (!trimmed) return;
    // If a parent (Devvit) is available, post the comment to persistent storage
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'POST_COMMENT', payload: { caseId: caseData?.id, author: 'u/You', text: trimmed } }, '*');
      setCommentDraft('');
      return;
    }

    // Local fallback
    setCommunityComments((prev) => [
      { id: Date.now(), author: 'u/You', text: trimmed },
      ...prev
    ]);
    setCommentDraft('');
  };

  const copyShare = async () => {
    const shareText = `🕵️ Daily Case Solved\nCase: ${caseData?.title}\nRank: ${playerRank}\nStreak: ${streak} Days\nTime: ${formatTime(elapsed)}\nShared from r/DailyDeduction`;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  if (!caseData) {
    return (
      <div className="w-full max-w-3xl mx-auto reddit-card rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#FF4500] border-t-transparent" />
        <p className="text-xs font-bold uppercase tracking-wider text-[#82959B]">Loading game data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 text-[#F2F4F5]">
      <div className="reddit-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#FF4500]">Today's Case</p>
            <h2 className="mt-0.5 text-xl font-bold text-white">{caseData.title}</h2>
            <p className="text-xs text-[#82959B]">{caseData.location}</p>
          </div>
          <div className="rounded-full border border-[#2A3C42] bg-[#121C1F] px-3 py-1.5 text-xs text-[#82959B] flex items-center gap-1.5 font-mono">
            <Clock3 className="h-3.5 w-3.5 text-[#FF4500]" />
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {view === 'entry' && (
        <>
        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="reddit-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Case Reveal</p>
                  <h3 className="text-md font-bold text-white">The evidence board is coming alive.</h3>
                </div>
                <div className="rounded-full border border-[#2A3C42] bg-[#121C1F] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#FF4500]">
                  Live
                </div>
              </div>

              <div className="case-reveal-shell rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3">
                <div className="mb-3 flex gap-2">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${revealPhase >= index + 1 ? 'bg-[#FF4500]' : 'bg-[#2A3C42]'}`}
                    />
                  ))}
                </div>
                <div className="rounded-lg border border-[#2A3C42] bg-[#1A282D] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Signal</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {revealPhase === 0 && 'Initializing the evidence feed...'}
                    {revealPhase === 1 && 'A new thread is surfacing from the timeline.'}
                    {revealPhase === 2 && 'The clue is tightening around a single suspect.'}
                    {revealPhase === 3 && 'The board is clear — the case is ready to solve.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="reddit-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#82959B]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF4500]" />
                Story
              </div>
              <p className="text-sm leading-relaxed text-[#D7E2E6]">{caseData.synopsis}</p>

              <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-4 space-y-3">
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Timeline</p>
                  <ul className="space-y-1 text-xs text-[#82959B] font-mono">
                    {caseData.dossier.timeline.map((entry) => <li key={entry}>{entry}</li>)}
                  </ul>
                </div>

                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Interviews</p>
                  <ul className="space-y-2 text-xs">
                    {caseData.dossier.interviews.map((entry) => (
                      <li key={entry.name} className="rounded-lg border border-[#2A3C42] bg-[#1A282D] p-2.5 text-[#D7E2E6]">
                        <span className="font-bold text-white">u/{entry.name.replace(/\s+/g, '')}</span> ({entry.role}): "{entry.quote}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="reddit-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#82959B]">
                <ShieldAlert className="h-3.5 w-3.5 text-[#FF4500]" />
                Clue
              </div>
              <p className="text-xs leading-relaxed text-[#D7E2E6]">{caseData.clue.prompt}</p>
              <div className="space-y-2">
                {!unlocked ? (
                  <>
                    <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-2 text-center">
                      <input
                        value={clueInput}
                        onChange={(e) => setClueInput(e.target.value)}
                        placeholder="Type the evidence keyword"
                        className="w-full rounded-md border border-[#2A3C42] bg-[#0F1A1D] px-2 py-2 text-xs font-mono text-white placeholder:text-[#82959B] focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={unlockClue} disabled={unlocking || !clueInput.trim()} className="flex-1 rounded-full bg-[#FF4500] px-3 py-2 text-xs font-bold text-white">
                        {unlocking ? 'Checking…' : 'Unlock clue'}
                      </button>
                      <button onClick={() => { setClueInput(''); setUnlocked(false); }} className="rounded-full border border-[#2A3C42] px-3 py-2 text-xs text-[#82959B]">Reset</button>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-[#2A3C42] bg-[#071012] p-3 text-center text-xs font-mono text-[#FF4500]">Unlocked — proceed to accusation</div>
                )}
              </div>
            </div>

            <div className="reddit-card rounded-2xl p-4 space-y-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Ready to solve?</p>
              <button
                onClick={() => unlocked && setView('accuse')}
                disabled={!unlocked}
                className={`reddit-btn-secondary w-full rounded-full py-2 text-xs flex items-center justify-center gap-1.5 ${!unlocked ? 'opacity-50 pointer-events-none' : ''}`}
              >
                Make Your Accusation <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="reddit-card rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#82959B]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF4500]" />
                Community feed
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-[#2A3C42] bg-[#121C1F] p-2 text-xs text-[#D7E2E6]">
                  <textarea
                    value={commentDraft}
                    onChange={(event) => setCommentDraft(event.target.value)}
                    rows={2}
                    placeholder="Add your own clue or theory..."
                    className="w-full resize-none rounded-lg border border-[#2A3C42] bg-[#1A282D] px-2.5 py-2 text-xs text-[#F2F4F5] placeholder:text-[#82959B] focus:border-[#FF4500] focus:outline-none"
                  />
                  <button
                    onClick={addComment}
                    className="mt-2 rounded-full bg-[#FF4500] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
                  >
                    Post comment
                  </button>
                </div>
                {communityComments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-[#2A3C42] bg-[#121C1F] p-2.5 text-xs text-[#D7E2E6]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white">{comment.author}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#82959B]">just now</span>
                    </div>
                    <p className="mt-1 leading-relaxed">“{comment.text}”</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#82959B]">
                      <span>▲ 3</span>
                      <span>▼ 0</span>
                    </div>
                  </div>
                ))}
                {leaderboard.length > 0 && (
                  <div className="mt-3 rounded-lg border border-[#2A3C42] bg-[#121C1F] p-3 text-xs text-[#D7E2E6]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">Top Solvers</span>
                      <span className="text-[11px] text-[#82959B]">Leaderboard</span>
                    </div>
                    <ol className="space-y-1">
                      {leaderboard.map((row, idx) => (
                        <li key={row.user} className="flex items-center justify-between">
                          <span className="text-sm">{idx + 1}. {row.user}</span>
                          <span className="text-sm font-mono text-[#FF4500]">{row.score}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {view === 'accuse' && (
        <div className="reddit-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-[#2A3C42] pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Accusation Board</p>
              <h3 className="text-md font-bold text-white">Choose the correct answers</h3>
            </div>
            <button onClick={() => setView('entry')} className="text-xs text-[#82959B] hover:underline font-semibold">Cancel</button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Suspect</p>
              <div className="grid gap-2">
                {caseData.accusation.suspects.map((option) => (
                  <button 
                    key={option.id} 
                    onClick={() => selectOption('suspectId', option.id)} 
                    className={`rounded-xl border p-3 text-left transition-all ${selection.suspectId === option.id ? 'border-[#FF4500] bg-[#121C1F]' : 'border-[#2A3C42] bg-[#121C1F]/40 hover:bg-[#121C1F]'}`}
                  >
                    <span className={`block text-xs font-bold ${selection.suspectId === option.id ? 'text-[#FF4500]' : 'text-white'}`}>u/{option.name.replace(/\s+/g, '')}</span>
                    <span className="mt-0.5 block text-[11px] text-[#82959B] leading-relaxed">{option.detail}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Evidence</p>
              <div className="grid gap-2">
                {caseData.accusation.evidence.map((option) => (
                  <button 
                    key={option.id} 
                    onClick={() => selectOption('evidenceId', option.id)} 
                    className={`rounded-xl border p-3 text-left transition-all ${selection.evidenceId === option.id ? 'border-[#FF4500] bg-[#121C1F]' : 'border-[#2A3C42] bg-[#121C1F]/40 hover:bg-[#121C1F]'}`}
                  >
                    <span className={`block text-xs font-bold ${selection.evidenceId === option.id ? 'text-[#FF4500]' : 'text-white'}`}>{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-[#82959B] leading-relaxed">{option.detail}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Motive</p>
              <div className="grid gap-2">
                {caseData.accusation.motives.map((option) => (
                  <button 
                    key={option.id} 
                    onClick={() => selectOption('motiveId', option.id)} 
                    className={`rounded-xl border p-3 text-left transition-all ${selection.motiveId === option.id ? 'border-[#FF4500] bg-[#121C1F]' : 'border-[#2A3C42] bg-[#121C1F]/40 hover:bg-[#121C1F]'}`}
                  >
                    <span className={`block text-xs font-bold ${selection.motiveId === option.id ? 'text-[#FF4500]' : 'text-white'}`}>{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-[#82959B] leading-relaxed">{option.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {feedback && !feedback.correct && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3.5 text-xs text-red-400">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" /> Wrong Answer
              </div>
              <p className="mt-1 text-xs text-[#D7E2E6] leading-relaxed">{feedback.message}</p>
            </div>
          )}

          <button 
            onClick={submitAccusation} 
            className="reddit-btn-primary w-full rounded-full py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2"
          >
            Submit Accusation <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {view === 'results' && (
        <div className="space-y-4">
          <div className="reddit-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A3C42] pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Your Profile</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-lg font-bold text-white">{playerRank}</h3>
                  <span className="rounded-full bg-[#2A3C42] px-2 py-0.5 text-[10px] font-mono text-[#FF4500]">{reputation} REP</span>
                </div>
              </div>
              <Trophy className="h-5 w-5 text-[#FF4500]" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#82959B] font-semibold">
                <span>Next Rank Progress</span>
                <span>{Math.floor(rankProgress)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-[#2A3C42] bg-[#121C1F]">
                <div className="h-full bg-[#FF4500] transition-all duration-500" style={{ width: `${rankProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="reddit-card rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Community Pulse</p>
              <h3 className="mt-0.5 text-md font-bold text-white">Your solve is now part of today’s ritual.</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Community solves</p>
                <p className="mt-0.5 text-lg font-black text-[#FF4500]">{communityPulse.solved}</p>
              </div>
              <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Momentum</p>
                <p className="mt-0.5 text-lg font-black text-white">{communityPulse.trend}</p>
              </div>
              <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Next drop</p>
                <p className="mt-0.5 text-lg font-black text-white">24h</p>
              </div>
            </div>

            <p className="text-sm text-[#D7E2E6]">{communityPulse.note}</p>
          </div>

          <div className="reddit-card rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Share Results</p>
              <h3 className="mt-0.5 text-md font-bold text-white">Today's score is locked.</h3>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#121C1F] border border-[#2A3C42] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Current Streak</p>
                <p className="mt-0.5 text-lg font-black text-[#FF4500]">{streak} days</p>
              </div>
              <div className="rounded-xl bg-[#121C1F] border border-[#2A3C42] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Solve Time</p>
                <p className="mt-0.5 text-lg font-black text-white font-mono">{formatTime(elapsed)}</p>
              </div>
              <div className="rounded-xl bg-[#121C1F] border border-[#2A3C42] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Accuracy</p>
                <p className="mt-0.5 text-lg font-black text-white">100%</p>
              </div>
            </div>
            
            <button 
              onClick={copyShare} 
              className="reddit-btn-primary w-full rounded-full py-2 text-xs flex items-center justify-center gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy Results Summary'}
            </button>
          </div>
        </div>
      )}

      <div className="pt-2 text-center">
        <button onClick={onBack} className="text-xs font-semibold text-[#82959B] hover:underline focus:outline-none">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}