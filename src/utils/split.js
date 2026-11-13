// All money is handled as integer paise so splits never drift by floating-point error.

export const toPaise = (rupees) => Math.round(Number(rupees) * 100);

export const formatMoney = (paise) =>
  `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

/** Splits a total into `count` shares that sum exactly to the total (extra paise go to the first shares). */
export function splitEqually(totalPaise, count) {
  const base = Math.floor(totalPaise / count);
  const remainder = totalPaise - base * count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

/** Net position per person in paise: positive = is owed money, negative = owes money. */
export function computeBalances(people, expenses) {
  const net = Object.fromEntries(people.map((p) => [p.id, 0]));
  for (const e of expenses) {
    if (!(e.paidBy in net)) continue;
    const participants = people.filter((p) => e.splitAmong.includes(p.id));
    if (participants.length === 0) continue;
    net[e.paidBy] += e.amountPaise;
    const shares = splitEqually(e.amountPaise, participants.length);
    participants.forEach((p, i) => {
      net[p.id] -= shares[i];
    });
  }
  return net;
}

/** Greedy settle-up: pairs the biggest debtor with the biggest creditor. Never needs more than n-1 payments. */
export function settleUp(net) {
  const creditors = [];
  const debtors = [];
  for (const [id, v] of Object.entries(net)) {
    if (v > 0) creditors.push({ id, amt: v });
    else if (v < 0) debtors.push({ id, amt: -v });
  }
  creditors.sort((a, b) => b.amt - a.amt);
  debtors.sort((a, b) => b.amt - a.amt);

  const transfers = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    transfers.push({ from: debtors[i].id, to: creditors[j].id, amountPaise: pay });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt === 0) i++;
    if (creditors[j].amt === 0) j++;
  }
  return transfers;
}

/** Plain-text summary that can be pasted into a group chat. */
export function buildSummary(people, transfers) {
  if (transfers.length === 0) return "All settled up. Nobody owes anything.";
  const name = (id) => people.find((p) => p.id === id)?.name ?? "Someone";
  return ["Settle up:", ...transfers.map((t) => `• ${name(t.from)} pays ${name(t.to)} ${formatMoney(t.amountPaise)}`)].join("\n");
}
