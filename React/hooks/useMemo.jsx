/**
 * This file demonstrates the usage of the `useMemo` hook in React.
 *
 * The `useMemo` hook is used to cache the result of an expensive calculation to avoid unnecessary re-renders and recomputations.
 * It returns a memoized value, which only recalculates when its dependencies change.
 *
 * --- What useMemo does ---
 * 1. It caches the result of a calculation between re-renders.
 * 2. It only re-runs the calculation when one of its dependencies changes.
 * 3. It helps optimize performance by preventing expensive calculations from running on every render.
 *
 * --- When to use useMemo ---
 * 1. When you have an expensive calculation that does not need to run every time the component renders.
 * 2. When memoizing values that depend on state or props to optimize child component rendering.
 * 3. When memoizing dependencies of other hooks like `useEffect` to avoid unnecessary re-runs.
 *
 * --- When to be careful ---
 * 1. Avoid using `useMemo` to replace state or for caching values that change frequently, as it can lead to unnecessary complexity.
 * 2. Use it as a performance optimization, not as a logic fix; if the component logic depends on it, there might be an issue with the underlying code.
 * 3. Memoizing too many values can add overhead, as React needs to track dependencies and determine when to re-run calculations.
 *
 * --- Similar Hooks ---
 * - `useCallback`: `useMemo` returns a memoized value, while `useCallback` returns a memoized function. Use `useCallback` when you need a stable function reference.
 */

import React, { useState, useMemo } from "react";

/**
 * Example 1: Basic useMemo to Optimize Expensive Calculation
 *
 * This example demonstrates how `useMemo` can be used to prevent an expensive calculation from running on every render.
 * The `expensiveCalculation` function runs only when the `count` state changes, improving performance.
 *
 * Use Case: Ideal for scenarios where calculations depend on state or props and should not re-run unless dependencies change.
 */
function ExpensiveCalculationComponent() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);

  const calculation = useMemo(() => expensiveCalculation(count), [count]);

  const addTodo = () => {
    setTodos((prevTodos) => [
      ...prevTodos,
      `New Todo #${prevTodos.length + 1}`,
    ]);
  };

  return (
    <div>
      <h1>Expensive Calculation with useMemo</h1>
      <div>
        <h2>My Todos</h2>
        {todos.map((todo, index) => (
          <p key={index}>{todo}</p>
        ))}
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <hr />
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <h2>Expensive Calculation Result</h2>
        <p>{calculation}</p>
      </div>
    </div>
  );
}

const expensiveCalculation = (num) => {
  console.log("Calculating...");
  for (let i = 0; i < 1000000000; i++) {
    num += 1;
  }
  return num;
};

/**
 * Example 2: Skipping Expensive Recalculation with useMemo
 *
 * This example shows how to use `useMemo` to memoize a filtered list of items.
 * The `filteredItems` value is only recalculated when `items` or `filter` changes, avoiding unnecessary recalculations.
 *
 * Use Case: Useful when filtering or transforming a large array where re-running the operation on every render would be costly.
 */
function FilteredListComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    console.log("Filtering items...");
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  return (
    <div>
      <h1>Filtered List with useMemo</h1>
      <p>Filter: {filter}</p>
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 3: Using useMemo for Referencing Objects in useEffect Dependencies
 *
 * This example shows how `useMemo` can be used to prevent unnecessary effects from running.
 * The `options` object is memoized using `useMemo`, so the effect only re-runs when `roomId` changes.
 *
 * Use Case: Useful when memoizing objects that are used as dependencies in other hooks, like `useEffect`.
 */
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState("");

  const options = useMemo(() => {
    return { serverUrl: "https://localhost:1234", roomId: roomId };
  }, [roomId]);

  React.useEffect(() => {
    console.log("Connecting to chat room with options:", options);
    // Simulate a chat room connection...
    const connection = {
      connect: () => console.log("Connected"),
      disconnect: () => console.log("Disconnected"),
    };
    connection.connect();

    return () => connection.disconnect();
  }, [options]);

  return (
    <div>
      <h1>Chat Room with useMemo</h1>
      <p>Room ID: {roomId}</p>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
    </div>
  );
}

/**
 * Example 4: Skipping Re-Renders with useMemo and React.memo
 *
 * This example demonstrates how to use `useMemo` and `React.memo` together to prevent re-renders of child components.
 * The `List` component is memoized, and the `visibleItems` array is memoized with `useMemo` to avoid re-renders unless necessary.
 *
 * Use Case: Useful when optimizing child components that only need to re-render if specific props change.
 */
const List = React.memo(({ items }) => {
  console.log("Rendering List Component...");
  return (
    <div>
      <h2>Item List</h2>
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
});

function ItemListComponent({ items, filter }) {
  const visibleItems = useMemo(() => {
    console.log("Filtering visible items...");
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  return (
    <div>
      <h1>Item List with useMemo and React.memo</h1>
      <List items={visibleItems} />
    </div>
  );
}

// Combine all components into a single display
function App() {
  const [filter, setFilter] = useState("");

  const items = ["Apple", "Banana", "Orange", "Grapes", "Watermelon"];

  return (
    <div>
      <h1>React useMemo Examples</h1>
      <ExpensiveCalculationComponent />
      <hr />
      <FilteredListComponent items={items} filter={filter} />
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <hr />
      <ChatRoom roomId="123" />
      <hr />
      <ItemListComponent items={items} filter={filter} />
    </div>
  );
}

export default App;
