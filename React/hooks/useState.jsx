/**
 * This file demonstrates the usage of the `useState` hook in React.
 *
 * The `useState` hook allows you to add and manage state in a functional component.
 * It provides a way to track and update state in response to user actions or other events.
 *
 * --- What useState does ---
 * 1. It allows the addition of a state variable to a component.
 * 2. It returns a pair of values: the current state and a function to update it.
 * 3. Updates to state cause the component to re-render with new values.
 *
 * --- When to use useState ---
 * 1. To track user input values (e.g., form fields, search bars).
 * 2. To maintain local component state like counters, toggle states, or any temporary UI states.
 * 3. To update component data based on previous values (e.g., counters, adding items to a list).
 *
 * --- When to be careful ---
 * 1. Avoid direct state mutations.
 * 2. Avoid calling setState in loops or conditions.
 * 3. Handle asynchronous updates correctly when using state that depends on the previous state.
 *
 * --- Similar Hooks ---
 * - `useReducer`: For more complex state logic, consider using `useReducer`.
 *   It allows for a clearer separation of state management logic.
 */

import React, { useState, useReducer } from "react";

/**
 * Example 1: Simple Counter using useState
 *
 * This example demonstrates a simple counter using the `useState` hook.
 * It initializes a state variable `count` to zero and provides a button to increment the count.
 *
 * Use Case: Ideal for situations where you need to track a simple numeric value, such as a counter or score.
 */
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Simple Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

/**
 * Example 2: Managing Object State using useState
 *
 * This example shows how to manage an object state with `useState`.
 * The state variable `user` holds an object with `name` and `age` properties.
 * The `setUser` function is used to update the state while preserving other properties using the spread operator (`...`).
 *
 * Use Case: This is useful when managing form inputs or grouped data that needs to be updated together.
 */
function UserProfile() {
  const [user, setUser] = useState({ name: "", age: "" });

  const updateName = (e) =>
    setUser((prevState) => ({ ...prevState, name: e.target.value }));
  const updateAge = (e) =>
    setUser((prevState) => ({ ...prevState, age: e.target.value }));

  return (
    <div>
      <h1>User Profile</h1>
      <input value={user.name} onChange={updateName} placeholder="Name" />
      <input
        value={user.age}
        onChange={updateAge}
        placeholder="Age"
        type="number"
      />
      <p>User's name: {user.name}</p>
      <p>User's age: {user.age}</p>
    </div>
  );
}

/**
 * Example 3: Handling Previous State using useState (Counter with Step Increment)
 *
 * This example shows how to use the `setCount` function with a callback to handle updates based on the previous state.
 * The `incrementByStep` function increments the counter by a specified step.
 *
 * Use Case: Ideal when state updates depend on the previous state, such as adding or subtracting values.
 */
function StepCounter() {
  const [count, setCount] = useState(0);

  const incrementByStep = (step) => {
    setCount((prevCount) => prevCount + step);
  };

  return (
    <div>
      <h1>Step Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={() => incrementByStep(5)}>Increment by 5</button>
    </div>
  );
}

/**
 * Example 4: Using useReducer for Complex State Logic (Counter with Reducer)
 *
 * This example uses the `useReducer` hook to manage a counter with increment, decrement, and reset actions.
 * It demonstrates the use of a reducer function to handle multiple state transitions.
 *
 * Use Case: Use `useReducer` when state transitions are complex or involve multiple actions, like managing the state of a form or complex UI state.
 * It provides a more structured approach compared to `useState`.
 */
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      throw new Error("Unknown action type");
  }
}

function CounterWithReducer() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <h1>Counter with useReducer</h1>
      <p>Current Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useState Examples</h1>
      <Counter />
      <hr />
      <UserProfile />
      <hr />
      <StepCounter />
      <hr />
      <CounterWithReducer />
    </div>
  );
}

export default App;
