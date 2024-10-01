/**
 * This file demonstrates the usage of the `useCallback` hook in React.
 *
 * The `useCallback` hook is used to memoize functions to prevent unnecessary re-creations, which helps optimize performance by reducing re-renders.
 *
 * --- What useCallback does ---
 * 1. It returns a memoized function that remains the same between re-renders, unless its dependencies change.
 * 2. It helps avoid unnecessary re-renders when the memoized function is passed as a prop to child components.
 * 3. It can be used to skip effects or prevent performance issues caused by constantly recreating functions.
 *
 * --- When to use useCallback ---
 * 1. When you need to pass a stable function reference to a child component that depends on it (especially when the child uses `React.memo`).
 * 2. When a component has expensive re-render logic, and you want to avoid re-renders unless necessary.
 * 3. When you need to prevent unnecessary function recreations, particularly in the case of useEffect or other hooks that depend on the function.
 *
 * --- When to be careful ---
 * 1. Avoid using `useCallback` when there is no clear performance benefit, as it adds unnecessary complexity.
 * 2. Only use it when passing functions to components that are optimized using `React.memo` or similar tools.
 * 3. Do not use it to replace state or refs; use it only for function references.
 *
 * --- Similar Hooks ---
 * - `useMemo`: `useMemo` is used to memoize values, while `useCallback` is used to memoize functions. Use `useCallback` when you need a stable function reference and `useMemo` when you need a stable value.
 */

import React, { useState, useCallback, useMemo } from "react";

/**
 * Example 1: Basic useCallback with React.memo
 *
 * This example demonstrates the use of `useCallback` to prevent unnecessary re-renders.
 * A memoized function (`addTodo`) is passed as a prop to the `Todos` component.
 * Since `useCallback` ensures the function remains the same between renders, the child component will not re-render unless the `todos` prop changes.
 *
 * Use Case: Ideal when you have child components that should only re-render when specific props change.
 */
const Todos = React.memo(({ todos, addTodo }) => {
  console.log("Rendering Todos Component");

  return (
    <div>
      <h2>My Todos</h2>
      {todos.map((todo, index) => (
        <p key={index}>{todo}</p>
      ))}
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
});

function TodoApp() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);

  // Memoized function that only changes if `todos` changes.
  const addTodo = useCallback(() => {
    setTodos((prevTodos) => [
      ...prevTodos,
      `New Todo #${prevTodos.length + 1}`,
    ]);
  }, [todos]);

  return (
    <div>
      <h1>useCallback with React.memo Example</h1>
      <Todos todos={todos} addTodo={addTodo} />
      <hr />
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment Count</button>
      </div>
    </div>
  );
}

/**
 * Example 2: Preventing Re-Creation of Functions in useEffect
 *
 * This example shows how `useCallback` can be used to prevent effects from re-running unnecessarily.
 * A memoized callback (`createOptions`) is used inside the effect, ensuring that the effect only runs when the `roomId` changes.
 *
 * Use Case: Useful when passing functions as dependencies to useEffect, ensuring that the effect does not trigger unless necessary.
 */
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState("");

  const createOptions = useCallback(() => {
    return {
      serverUrl: "https://localhost:1234",
      roomId: roomId,
    };
  }, [roomId]); // `createOptions` will only change if `roomId` changes.

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);

    connection.connect();

    return () => connection.disconnect();
  }, [createOptions]); // Effect only depends on `createOptions`

  return (
    <div>
      <h1>Chat Room Example</h1>
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
 * Example 3: Optimizing List Rendering with useCallback
 *
 * This example uses `useCallback` to optimize rendering of a list with item actions.
 * Each `Item` component receives a memoized function, ensuring that only the changed item re-renders.
 *
 * Use Case: Useful when rendering lists with item actions to prevent all items from re-rendering unnecessarily.
 */
const Item = React.memo(({ item, onClick }) => {
  console.log(`Rendering Item ${item.id}`);
  return (
    <div>
      <p>{item.name}</p>
      <button onClick={onClick}>Action</button>
    </div>
  );
});

function ItemList() {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ]);

  const handleItemClick = useCallback((id) => {
    console.log(`Clicked item ${id}`);
  }, []); // Function reference remains the same for all items.

  return (
    <div>
      <h1>Item List with useCallback Example</h1>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          onClick={() => handleItemClick(item.id)}
        />
      ))}
    </div>
  );
}

/**
 * Example 4: Using useCallback in Custom Hooks
 *
 * This example demonstrates how to use `useCallback` inside a custom hook.
 * The custom hook `useCustomCounter` returns memoized increment and decrement functions.
 *
 * Use Case: Ideal for custom hooks that expose functions, ensuring stable function references.
 */
function useCustomCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // `increment` remains the same between renders.

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []); // `decrement` remains the same between renders.

  return { count, increment, decrement };
}

function Counter() {
  const { count, increment, decrement } = useCustomCounter();

  return (
    <div>
      <h1>Custom Hook with useCallback Example</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useCallback Examples</h1>
      <TodoApp />
      <hr />
      <ChatRoom roomId="123" />
      <hr />
      <ItemList />
      <hr />
      <Counter />
    </div>
  );
}

// Simulate a connection API for demonstration purposes.
function createConnection(options) {
  console.log("Connecting to server with options:", options);
  return {
    connect: () => console.log("Connected to server"),
    disconnect: () => console.log("Disconnected from server"),
  };
}

export default App;
