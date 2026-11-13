import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MAX_PEOPLE = 10;

export default function PeoplePanel({ people, expenses, onAdd, onRemove }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isInvolved = (id) => expenses.some((e) => e.paidBy === id || e.splitAmong.includes(id));

  const submit = (e) => {
    e.preventDefault();
    const clean = name.trim().slice(0, 20);
    if (!clean) return setError("Enter a name");
    if (people.some((p) => p.name.toLowerCase() === clean.toLowerCase())) return setError("That name is already added");
    if (people.length >= MAX_PEOPLE) return setError(`Up to ${MAX_PEOPLE} people`);
    onAdd(clean);
    setName("");
    setError("");
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-bold">Who's in?</h2>

      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Add a name"
          aria-label="Person name"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-tab-500 focus:ring-2 focus:ring-tab-500/20"
        />
        <button className="rounded-xl bg-tab-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tab-700">Add</button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <ul className="mt-4 flex flex-wrap gap-2">
        <AnimatePresence>
          {people.map((p) => {
            const locked = isInvolved(p.id);
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 rounded-full bg-tab-50 py-1.5 pl-4 pr-2 text-sm font-semibold text-tab-700"
              >
                {p.name}
                <button
                  onClick={() => onRemove(p.id)}
                  disabled={locked}
                  title={locked ? "Delete their expenses first" : `Remove ${p.name}`}
                  aria-label={`Remove ${p.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-base leading-none transition enabled:hover:bg-tab-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ×
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      {people.length === 0 && <p className="mt-2 text-sm text-slate-400">Add at least two people to start splitting.</p>}
    </section>
  );
}
