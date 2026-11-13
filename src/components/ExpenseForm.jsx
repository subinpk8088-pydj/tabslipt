import { useState } from "react";
import { toPaise } from "../utils/split";

export default function ExpenseForm({ people, onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidById, setPaidById] = useState("");
  const [excluded, setExcluded] = useState([]); // track who is OUT, so new people default to IN
  const [error, setError] = useState("");

  if (people.length < 2) {
    return (
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-bold">Add an expense</h2>
        <p className="mt-2 text-sm text-slate-400">Add at least two people above to log an expense.</p>
      </section>
    );
  }

  const paidBy = people.some((p) => p.id === paidById) ? paidById : people[0].id;
  const splitAmong = people.filter((p) => !excluded.includes(p.id)).map((p) => p.id);

  const toggle = (id) => {
    setExcluded((ex) => (ex.includes(id) ? ex.filter((x) => x !== id) : [...ex, id]));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const amountPaise = toPaise(amount);
    if (!description.trim()) return setError("Describe what it was for");
    if (!(amountPaise > 0) || amountPaise > 1_000_000_000) return setError("Enter an amount greater than 0");
    if (splitAmong.length === 0) return setError("Pick at least one person to split with");
    onAdd({ description: description.trim().slice(0, 40), amountPaise, paidBy, splitAmong });
    setDescription("");
    setAmount("");
    setExcluded([]);
    setError("");
  };

  const field = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-tab-500 focus:ring-2 focus:ring-tab-500/20";

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-lg font-bold">Add an expense</h2>
      <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
        <div className="grid gap-3 sm:grid-cols-5">
          <input className={`${field} sm:col-span-3`} placeholder="What was it for?" value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Description" />
          <div className="relative sm:col-span-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">₹</span>
            <input className={`${field} pl-8`} inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} aria-label="Amount" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Paid by</label>
          <select className={field} value={paidBy} onChange={(e) => setPaidById(e.target.value)}>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Split equally between</label>
          <div className="flex flex-wrap gap-2">
            {people.map((p) => {
              const on = !excluded.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  aria-pressed={on}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${on ? "bg-tab-600 text-white" : "bg-slate-100 text-slate-400 line-through"}`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Add expense</button>
      </form>
    </section>
  );
}
