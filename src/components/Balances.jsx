import { useMemo, useState } from "react";
import { buildSummary, computeBalances, formatMoney, settleUp } from "../utils/split";

export default function Balances({ people, expenses }) {
  const [copied, setCopied] = useState(false);

  const { net, transfers } = useMemo(() => {
    const net = computeBalances(people, expenses);
    return { net, transfers: settleUp(net) };
  }, [people, expenses]);

  const name = (id) => people.find((p) => p.id === id)?.name ?? "Someone";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(people, transfers));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked: nothing to do
    }
  };

  if (people.length === 0 || expenses.length === 0) {
    return (
      <section className="rounded-3xl bg-slate-900 p-6 text-white">
        <h2 className="text-lg font-bold">Balances</h2>
        <p className="mt-3 text-sm text-white/60">Add people and expenses to see who owes whom.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-slate-900 p-6 text-white">
      <h2 className="text-lg font-bold">Balances</h2>
      <ul className="mt-4 space-y-3">
        {people.map((p) => {
          const v = net[p.id] ?? 0;
          return (
            <li key={p.id} className="flex items-center justify-between text-sm">
              <span className="font-semibold">{p.name}</span>
              {v === 0 ? (
                <span className="text-white/40">settled</span>
              ) : v > 0 ? (
                <span className="font-bold text-emerald-400">gets back {formatMoney(v)}</span>
              ) : (
                <span className="font-bold text-tab-500">owes {formatMoney(-v)}</span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Settle up</h3>
        {transfers.length === 0 ? (
          <p className="mt-3 text-sm text-emerald-400">All settled up.</p>
        ) : (
          <>
            <ul className="mt-3 space-y-2">
              {transfers.map((t) => (
                <li key={`${t.from}-${t.to}`} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                  <span>
                    <b>{name(t.from)}</b> <span className="text-white/50">pays</span> <b>{name(t.to)}</b>
                  </span>
                  <span className="font-bold">{formatMoney(t.amountPaise)}</span>
                </li>
              ))}
            </ul>
            <button onClick={copy} className="mt-4 w-full rounded-xl bg-tab-600 py-3 text-sm font-semibold transition hover:bg-tab-700">
              {copied ? "Copied!" : "Copy summary for the group chat"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
