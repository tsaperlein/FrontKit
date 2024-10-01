/**
 * This file demonstrates the usage of the `useDebugValue` hook in React.
 *
 * The `useDebugValue` hook is primarily used in custom hooks to label or format the debug information displayed in React DevTools.
 * It helps developers get a clearer understanding of what a custom hook is doing without inspecting its internal state manually.
 *
 * --- What useDebugValue does ---
 * 1. It allows you to add a label or formatted value for custom hooks in React DevTools.
 * 2. It can help indicate the state or value of a custom hook for debugging purposes.
 * 3. It provides a way to format complex data structures and present them in a readable way in DevTools.
 *
 * --- When to use useDebugValue ---
 * 1. When building custom hooks that have complex state or logic, making it easier to inspect in DevTools.
 * 2. When sharing custom hooks in a shared library or package, making it easier for others to debug.
 * 3. When providing contextual information in DevTools that can help understand how a hook works.
 *
 * --- When to be careful ---
 * 1. Avoid using `useDebugValue` in every custom hook. It is most useful for hooks with complex internal state or shared hooks.
 * 2. Use it only to aid debugging, not for application logic or state management.
 * 3. If formatting the debug value is expensive, use the second argument of `useDebugValue` to defer formatting until inspected.
 *
 * --- Similar Hooks ---
 * - `useContext`: `useContext` can also help display contextual information, but it does so by providing direct access to context values, not by formatting or labeling.
 */

import React, { useState, useEffect, useDebugValue } from "react";

/**
 * Example 1: Basic useDebugValue with a Custom Hook
 *
 * This example demonstrates how to use `useDebugValue` to label a custom hook's value.
 * The `useOnlineStatus` hook checks if the user is online or offline, and the hook's status is displayed in React DevTools as `OnlineStatus: "Online"` or `OnlineStatus: "Offline"`.
 *
 * Use Case: Useful for monitoring the state of custom hooks in shared libraries or components.
 */
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  // Display the online status in React DevTools.
  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}

function OnlineStatusComponent() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <h1>useDebugValue Example - Online Status</h1>
      <p>{`You are currently ${isOnline ? "Online" : "Offline"}`}</p>
    </div>
  );
}

/**
 * Example 2: Using useDebugValue with a Formatting Function
 *
 * This example shows how to use `useDebugValue` with a formatting function.
 * The `useDate` custom hook formats the date, but only when inspected in React DevTools to avoid unnecessary computation.
 *
 * Use Case: Useful for deferring expensive calculations that are only needed for debugging purposes.
 */
function useDate() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  // Format the date only when inspected in DevTools to avoid unnecessary computations.
  useDebugValue(date, (d) => d.toLocaleTimeString());

  return date;
}

function DateComponent() {
  const date = useDate();

  return (
    <div>
      <h1>useDebugValue Example - Current Time</h1>
      <p>{`Current Time: ${date.toLocaleTimeString()}`}</p>
    </div>
  );
}

/**
 * Example 3: Combining useDebugValue with a State Management Custom Hook
 *
 * This example demonstrates a more complex hook that uses `useDebugValue` to show the count value in DevTools.
 * The `useCounter` hook manages a counter, and the count value is displayed as `Counter: [current count]`.
 *
 * Use Case: Useful for monitoring complex state in custom hooks, especially when building shared libraries.
 */
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  // Display the current count value in DevTools.
  useDebugValue(`Counter: ${count}`);

  return { count, increment, decrement };
}

function CounterComponent() {
  const { count, increment, decrement } = useCounter(10);

  return (
    <div>
      <h1>useDebugValue Example - Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useDebugValue Examples</h1>
      <OnlineStatusComponent />
      <hr />
      <DateComponent />
      <hr />
      <CounterComponent />
    </div>
  );
}

export default App;
