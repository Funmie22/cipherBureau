import React, { useState } from 'react';
import DailyCaseApp from './components/DailyCaseApp';

export default function App() {
  const [currentView, setCurrentView] = useState('DASHBOARD');

  return (
    <div className="min-h-screen bg-[#0B1416] text-[#F2F4F5] font-sans">
      <header className="sticky top-0 z-10 border-b border-[#2A3C42] bg-[#1A282D]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <button 
            onClick={() => setCurrentView('DASHBOARD')} 
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4500] text-sm font-bold text-white">
              🕵️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white hover:underline">r/DailyDeduction</span>
                <span className="text-[11px] text-[#82959B]">• Live Event</span>
              </div>
              <p className="text-xs text-[#82959B]">Official Devvit Case Hub</p>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-[#2A3C42] bg-[#1A282D] px-3 py-1 text-[11px] font-mono tracking-wide text-[#82959B]">
              24h Case Engine
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        {currentView === 'DASHBOARD' && (
          <div className="space-y-4">
            <article className="reddit-card overflow-hidden rounded-2xl shadow-sm">
              <div className="border-b border-[#2A3C42] bg-[#1E2E34] p-5">
                <div className="flex items-center gap-2 text-xs text-[#82959B]">
                  <span className="font-bold text-[#F2F4F5]">u/BureauDirector</span>
                  <span>pinned this daily ritual</span>
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Solve the day’s mystery before the next drop.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#D7E2E6]">
                  Cipher Bureau turns a single daily case into a community ritual: read the clues, crack the culprit, earn reputation, and return tomorrow for the next mystery.
                </p>
              </div>

              <div className="grid gap-3 border-b border-[#2A3C42] bg-[#1A282D] p-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Daily drop</p>
                  <p className="mt-1 text-sm font-semibold text-white">New case every 24h</p>
                </div>
                <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Hook</p>
                  <p className="mt-1 text-sm font-semibold text-white">Streaks and rank progression</p>
                </div>
                <div className="rounded-xl border border-[#2A3C42] bg-[#121C1F] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Why it loops</p>
                  <p className="mt-1 text-sm font-semibold text-white">Come back for the next clue</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#2A3C42] bg-[#1E2E34] px-5 py-3">
                <span className="text-xs font-mono text-[#82959B]">
                  ⚡ +10 Reputation per solve
                </span>
                <button
                  onClick={() => setCurrentView('DAILY_CASE')}
                  className="reddit-btn-primary rounded-full px-5 py-2 text-xs font-bold shadow-sm focus:outline-none"
                >
                  Open today's case
                </button>
              </div>
            </article>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="reddit-card rounded-2xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">What makes it work</p>
                <p className="mt-2 text-sm leading-relaxed text-[#D7E2E6]">
                  The experience is built around tension, discovery, and return behavior. Every solve feels like progress, and every day brings a new reason to come back.
                </p>
              </div>
              <div className="reddit-card rounded-2xl p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#82959B]">Submission angle</p>
                <p className="mt-2 text-sm leading-relaxed text-[#D7E2E6]">
                  A daily detective ritual for Reddit communities, designed to feel polished, replayable, and easy to understand in a single demo.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'DAILY_CASE' && (
          <DailyCaseApp onBack={() => setCurrentView('DASHBOARD')} />
        )}
      </main>
    </div>
  );
}