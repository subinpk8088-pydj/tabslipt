import { useCallback, useEffect, useReducer } from "react";
import { toPaise } from "../utils/split";

const KEY = "tab_split_v1";
const EMPTY = { people: [], expenses: [] };

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function reducer(state, action) {
  switch (action.type) {
    case "addPerson":
      return { ...state, people: [...state.people, { id: uid(), name: action.name }] };
    case "removePerson":
      return { ...state, people: state.people.filter((p) => p.id !== action.id) };
    case "addExpense":
      return { ...state, expenses: [{ id: uid(), ...action.expense }, ...state.expenses] };
    case "removeExpense":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.id) };
    case "load":
      return action.state;
    case "reset":
      return EMPTY;
    default:
      return state;
  }
}

// Restore saved data, discarding anything malformed so a bad save can never crash the app.
function init() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) || "null");
    if (!saved || !Array.isArray(saved.people) || !Array.isArray(saved.expenses)) return EMPTY;
    const people = saved.people.filter((p) => p && typeof p.id === "string" && typeof p.name === "string");
    const expenses = saved.expenses.filter(
      (e) => e && Number.isInteger(e.amountPaise) && e.amountPaise > 0 && typeof e.paidBy === "string" && Array.isArray(e.splitAmong)
    );
    return { people, expenses };
  } catch {
    return EMPTY;
  }
}

function sampleTrip() {
  const [a, b, c] = [uid(), uid(), uid()];
  return {
    people: [
      { id: a, name: "Anu" },
      { id: b, name: "Ben" },
      { id: c, name: "Cy" },
    ],
    expenses: [
      { id: uid(), description: "Scooter rental", amountPaise: toPaise(900), paidBy: c, splitAmong: [b, c] },
      { id: uid(), description: "Beach dinner", amountPaise: toPaise(2400), paidBy: b, splitAmong: [a, b, c] },
      { id: uid(), description: "Hotel (2 nights)", amountPaise: toPaise(6000), paidBy: a, splitAmong: [a, b, c] },
    ],
  };
}

export default function useTab() {
  const [state, dispatch] = useReducer(reducer, undefined, init);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // storage unavailable: data just won't survive a reload
    }
  }, [state]);

  return {
    people: state.people,
    expenses: state.expenses,
    addPerson: useCallback((name) => dispatch({ type: "addPerson", name }), []),
    removePerson: useCallback((id) => dispatch({ type: "removePerson", id }), []),
    addExpense: useCallback((expense) => dispatch({ type: "addExpense", expense }), []),
    removeExpense: useCallback((id) => dispatch({ type: "removeExpense", id }), []),
    loadSample: useCallback(() => dispatch({ type: "load", state: sampleTrip() }), []),
    reset: useCallback(() => dispatch({ type: "reset" }), []),
  };
}
