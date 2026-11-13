import { motion } from "framer-motion";
import PeoplePanel from "./components/PeoplePanel";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Balances from "./components/Balances";
import useTab from "./hooks/useTab";

export default function App() {
  const { people, expenses, addPerson, removePerson, addExpense, removeExpense, loadSample, reset } = useTab();
  const isEmpty = people.length === 0 && expenses.length === 0;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <span className="text-2xl font-extrabold tracking-tight text-tab-600">Tab</span>
        {!isEmpty && (
          <button
            onClick={() => window.confirm("Clear all people and expenses?") && reset()}
            className="text-sm font-semibold text-slate-400 transition hover:text-red-600"
          >
            Start over
          </button>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-16">
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Split costs with friends. Settle up in fewer payments.
        </motion.h1>
        {isEmpty && (
          <button onClick={loadSample} className="mt-5 rounded-full border-2 border-tab-600 px-5 py-2 text-sm font-semibold text-tab-700 transition hover:bg-tab-50">
            Try a sample trip
          </button>
        )}

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <PeoplePanel people={people} expenses={expenses} onAdd={addPerson} onRemove={removePerson} />
            <ExpenseForm people={people} onAdd={addExpense} />
            <ExpenseList people={people} expenses={expenses} onRemove={removeExpense} />
          </div>
          <div className="lg:sticky lg:top-6 lg:col-span-2">
            <Balances people={people} expenses={expenses} />
          </div>
        </div>
      </main>
    </div>
  );
}
