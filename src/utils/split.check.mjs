import { buildSummary, computeBalances, settleUp, splitEqually, toPaise } from "./split.js";

const assert = (cond, msg) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok  :", msg);
};
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

assert(toPaise("12.34") === 1234 && toPaise(0.1 + 0.2) === 30, "rupees convert to integer paise without float drift");

const shares = splitEqually(100, 3);
assert(sum(shares) === 100 && shares.join() === "34,33,33", "₹1.00 across 3 people = 34+33+33 paise");

const people = [{ id: "a", name: "Anu" }, { id: "b", name: "Ben" }, { id: "c", name: "Cy" }];

// Anu pays ₹300 for all three: Ben and Cy each owe ₹100
const simple = computeBalances(people, [{ paidBy: "a", amountPaise: 30000, splitAmong: ["a", "b", "c"] }]);
assert(simple.a === 20000 && simple.b === -10000 && simple.c === -10000, "payer is owed the other shares");

const transfers = settleUp(simple);
assert(transfers.length === 2 && transfers.every((t) => t.to === "a" && t.amountPaise === 10000), "settle-up: Ben and Cy each pay Anu ₹100");

// Payer excluded from the split: Anu pays ₹200 for Ben and Cy only
const excl = computeBalances(people, [{ paidBy: "a", amountPaise: 20000, splitAmong: ["b", "c"] }]);
assert(excl.a === 20000 && excl.b === -10000 && excl.c === -10000, "payer not in the split is fully reimbursed");

// Orphaned / empty expenses are ignored and balances still net to zero
const odd = computeBalances(people, [
  { paidBy: "ghost", amountPaise: 5000, splitAmong: ["a"] },
  { paidBy: "a", amountPaise: 5000, splitAmong: [] },
]);
assert(sum(Object.values(odd)) === 0 && Object.values(odd).every((v) => v === 0), "orphaned and empty-split expenses are ignored");

// Property test with a deterministic pseudo-random generator
let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
for (let round = 0; round < 200; round++) {
  const n = 2 + Math.floor(rand() * 6);
  const ppl = Array.from({ length: n }, (_, i) => ({ id: `p${i}`, name: `P${i}` }));
  const exps = Array.from({ length: 1 + Math.floor(rand() * 8) }, () => {
    const split = ppl.filter(() => rand() > 0.4).map((p) => p.id);
    return { paidBy: ppl[Math.floor(rand() * n)].id, amountPaise: 1 + Math.floor(rand() * 500000), splitAmong: split.length ? split : [ppl[0].id] };
  });
  const net = computeBalances(ppl, exps);
  const tr = settleUp(net);
  const after = { ...net };
  tr.forEach((t) => {
    after[t.from] += t.amountPaise;
    after[t.to] -= t.amountPaise;
  });
  if (sum(Object.values(net)) !== 0 || Object.values(after).some((v) => v !== 0) || tr.length > n - 1) {
    console.error("FAIL: property test, round", round, { net, tr });
    process.exit(1);
  }
}
console.log("ok  : 200 random groups — balances net to zero, settle-up clears every balance in at most n-1 payments");

assert(buildSummary(people, transfers).includes("Ben pays Anu ₹100"), "summary names who pays whom");
assert(buildSummary(people, []).startsWith("All settled up"), "summary handles the settled case");
