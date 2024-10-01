/**
 * This file demonstrates the usage of the `useEffect` hook in React.
 *
 * The `useEffect` hook allows you to perform side effects in your components.
 * It synchronizes your component with external systems such as APIs, event listeners, and other services.
 *
 * --- What useEffect does ---
 * 1. It allows the addition of side effects to a component.
 * 2. It provides a way to run code after the component mounts, updates, or unmounts.
 * 3. It can optionally clean up resources (e.g., remove event listeners, cancel API calls) when the component unmounts or before re-running the effect.
 *
 * --- When to use useEffect ---
 * 1. To fetch data from an external API when a component mounts.
 * 2. To manage subscriptions or event listeners that need to be set up and removed based on component lifecycle.
 * 3. To update the component in response to changes in props or state.
 *
 * --- When to be careful ---
 * 1. Avoid using useEffect for synchronous state updates; consider other hooks like useLayoutEffect.
 * 2. Use the dependency array correctly to avoid unwanted re-renders or infinite loops.
 * 3. Always include a cleanup function to prevent memory leaks when using effects that interact with external systems.
 *
 * --- Similar Hooks ---
 * - `useLayoutEffect`: Similar to `useEffect`, but it fires synchronously after all DOM mutations. Useful for layout measurement or animations.
 */

import React, { useState, useEffect } from "react";

/**
 * Example 1: Basic useEffect for Data Fetching
 *
 * This example demonstrates how to use `useEffect` to fetch data from an API when the component first mounts.
 * The `useEffect` hook runs once after the initial render because the dependency array is empty.
 *
 * Use Case: Ideal for fetching data on component load, such as user information or a list of items.
 */
function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []); // Empty array means this useEffect runs only once when the component mounts.

  return (
    <div>
      <h1>Data Fetcher</h1>
      {data ? (
        <ul>
          {data.slice(0, 5).map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

/**
 * Example 2: useEffect with Cleanup
 *
 * This example demonstrates how to use `useEffect` to set up and clean up a timer.
 * The cleanup function ensures that the timer is cleared when the component unmounts to avoid memory leaks.
 *
 * Use Case: Useful when setting up subscriptions or timers that need to be cleared when the component unmounts.
 */
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCount((count) => count + 1), 1000);

    // Cleanup function to clear the timer when the component unmounts.
    return () => clearInterval(timer);
  }, []); // Empty array means this useEffect runs only once when the component mounts.

  return (
    <div>
      <h1>Timer</h1>
      <p>Timer has counted: {count} seconds</p>
    </div>
  );
}

/**
 * Example 3: useEffect with Dependencies
 *
 * This example shows how to re-run an effect only when specific dependencies change.
 * The effect updates a derived value whenever the `count` state variable changes.
 *
 * Use Case: Ideal when the effect logic should be triggered only when certain variables change, such as re-calculating a total when an input changes.
 */
function CalculationEffect() {
  const [count, setCount] = useState(0);
  const [calculation, setCalculation] = useState(0);

  useEffect(() => {
    setCalculation(count * 2);
  }, [count]); // The effect will run only when `count` changes.

  return (
    <div>
      <h1>Calculation Effect</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Calculation: {calculation}</p>
    </div>
  );
}

/**
 * Example 4: useEffect with Async Data Fetching and Cleanup
 *
 * This example shows how to use `useEffect` to fetch data asynchronously and handle cleanup to prevent memory leaks.
 * If the component unmounts before the data is fetched, the cleanup function ensures that the state update is prevented.
 *
 * Use Case: Useful when dealing with async operations that may complete after the component unmounts.
 */
function AsyncDataFetcher() {
  const [person, setPerson] = useState("Alice");
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchBio() {
      const response = await fetch(`https://api.example.com/bio/${person}`);
      const result = await response.json();
      if (!ignore) {
        setBio(result);
      }
    }
    fetchBio();

    // Cleanup function to ignore setting state if the component unmounts.
    return () => {
      ignore = true;
    };
  }, [person]); // The effect will re-run only when `person` changes.

  return (
    <div>
      <h1>Async Data Fetcher</h1>
      <select onChange={(e) => setPerson(e.target.value)} value={person}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
      </select>
      <p>Bio: {bio ? bio : "Loading bio..."}</p>
    </div>
  );
}

/**
 * Example 5: Conditionally Running useEffect
 *
 * This example shows how to use `useEffect` to perform actions based on conditional logic.
 * Here, the effect only updates the `didMount` state after the initial render to differentiate between server-side and client-side rendering.
 *
 * Use Case: Useful for differentiating between server-side and client-side rendering or performing actions only on client render.
 */
function ConditionalEffect() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []); // Empty array means this useEffect runs only once when the component mounts.

  if (didMount) {
    return <h1>This content is only rendered on the client</h1>;
  }

  return <h1>Initial content during server-side rendering</h1>;
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useEffect Examples</h1>
      <DataFetcher />
      <hr />
      <Timer />
      <hr />
      <CalculationEffect />
      <hr />
      <AsyncDataFetcher />
      <hr />
      <ConditionalEffect />
    </div>
  );
}

export default App;
