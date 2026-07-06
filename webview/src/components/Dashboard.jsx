import React from 'react';
import { ArrowRight, Clock3, Sparkles } from 'lucide-react';

export default function Dashboard({ onSelectSolo }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 text-zinc-300">
      <section className="rounded-[24px] border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">r/CipherBureau</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">A fresh case appears every day.</h2>
        <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
          Read the case file, crack the clue, make your accusation, and share your result with the community.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={onSelectSolo}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-950/20 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-950/40"
          >
            Open today’s case <ArrowRight className="h-4 w-4" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-400">
            <Clock3 className="h-4 w-4 text-emerald-400" /> Next drop in 23h 58m
          </div>
        </div>
      </section>
    </div>
  );
}
