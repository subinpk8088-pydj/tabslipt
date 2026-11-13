# Tab — Bill Splitter

Add people and expenses, see who owes whom, and settle up in the fewest payments.

**Stack:** Vite, React 18, Tailwind CSS, Framer Motion

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in /dist
npm run test:split   # verifies the split and settle-up logic
```

## How it works
- Each expense has a payer and a set of people it's split equally between (the payer can be left out).
- Money is stored as integer paise, so splits never drift. When a total doesn't divide evenly
  (e.g. ₹1.00 across 3), the leftover paise go to the first people in the list.
- Settle-up pairs the biggest debtor with the biggest creditor, so a group of n people never needs more than n-1 payments.
- Data is saved in localStorage. People who appear in an expense can't be removed until that expense is deleted.

## Structure
- `src/utils/split.js` — `splitEqually`, `computeBalances`, `settleUp`, `buildSummary`, formatting (pure functions)
- `src/utils/split.check.mjs` — assertions plus a 200-round randomized test that balances net to zero and settle-up clears them
- `src/hooks/useTab.js` — reducer, persistence, sample data
- `src/components/` — PeoplePanel, ExpenseForm, ExpenseList, Balances
