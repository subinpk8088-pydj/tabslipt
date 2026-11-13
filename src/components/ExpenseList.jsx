import { AnimatePresence, motion } from "framer-motion";
import { formatMoney } from "../utils/split";

export default function ExpenseList({ people, expenses, onRemove }) {
  const name = (id) => people.find((p) => p.id === id)?.name ?? "Someone";

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">Expenses</h2>
        {expenses.length > 0 && <span className="text-sm text-slate-400">{formatMoney(expenses.reduce((s, e) => s + e.amountPaise, 0))} total</span>}
      </div>

      {expenses.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">Nothing yet. Expenses you add will show up here.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {expenses.map((e) => (
              <motion.li key={e.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{e.description}</p>
                    <p className="text-xs text-slate-400">
                      {name(e.paidBy)} paid · split {e.splitAmong.length === people.length ? "between everyone" : `${e.splitAmong.length} ways`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatMoney(e.amountPaise)}</span>
                    <button onClick={() => onRemove(e.id)} aria-label={`Delete ${e.description}`} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-red-50 hover:text-red-600">
                      ×
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
