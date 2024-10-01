/**
 * This file demonstrates the usage of the `useRef` hook in React.
 *
 * The `useRef` hook provides a way to persist values between renders without causing re-renders.
 * It is commonly used to reference DOM elements or store mutable values.
 *
 * --- What useRef does ---
 * 1. It creates a mutable object with a `current` property that can hold any value.
 * 2. It persists the value stored in `current` across re-renders without causing the component to re-render.
 * 3. It is often used for referencing DOM elements and keeping track of mutable values.
 *
 * --- When to use useRef ---
 * 1. To access or modify DOM elements directly (e.g., focus an input).
 * 2. To keep track of values that don’t need to trigger re-renders (e.g., timer IDs or previous state values).
 * 3. To avoid creating new references in each render for performance optimization.
 *
 * --- When to be careful ---
 * 1. Do not use `useRef` for values that need to be displayed or should trigger re-renders. Use `useState` for such cases.
 * 2. Avoid modifying `ref.current` inside the render method, as it can lead to unexpected behavior.
 * 3. Ensure that `useRef` is not used to hold state-like values, which may cause bugs if the component logic relies on it.
 *
 * --- Similar Hooks ---
 * - `useState`: Use `useState` for managing state that should cause re-renders. `useRef` should be used only for values that do not need to trigger re-renders.
 */

import React, { useRef, useState, useEffect } from "react";

/**
 * Example 1: Using useRef to Access a DOM Element
 *
 * This example demonstrates how to use `useRef` to access a DOM element and perform an action, like focusing an input field.
 *
 * Use Case: Useful for scenarios where you need direct access to a DOM node, like focusing an input or scrolling to a specific element.
 */
function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    // Use the ref to focus the input element
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div>
      <h1>Focus Input Example</h1>
      <input
        type="text"
        ref={inputRef}
        placeholder="Click button to focus me"
      />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

/**
 * Example 2: Tracking Render Count with useRef
 *
 * This example uses `useRef` to track how many times a component has rendered.
 * Since `useRef` does not cause re-renders, it is ideal for storing values that persist across renders.
 *
 * Use Case: Useful for debugging or performance tracking to see how many times a component has rendered.
 */
function RenderCounter() {
  const [inputValue, setInputValue] = useState("");
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current = renderCount.current + 1;
  });

  return (
    <div>
      <h1>Render Counter Example</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type something"
      />
      <h2>Render Count: {renderCount.current}</h2>
    </div>
  );
}

/**
 * Example 3: Storing Previous State with useRef
 *
 * This example demonstrates how to store and access the previous state value using `useRef`.
 *
 * Use Case: Useful when you need to compare the current state with the previous state, such as determining if a state value has changed.
 */
function PreviousStateTracker() {
  const [inputValue, setInputValue] = useState("");
  const previousInputValue = useRef("");

  useEffect(() => {
    previousInputValue.current = inputValue;
  }, [inputValue]); // Update ref whenever inputValue changes

  return (
    <div>
      <h1>Previous State Tracker Example</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type to see previous value"
      />
      <h2>Current Value: {inputValue}</h2>
      <h2>Previous Value: {previousInputValue.current}</h2>
    </div>
  );
}

/**
 * Example 4: Creating a Timer with useRef
 *
 * This example shows how to use `useRef` to store a timer ID and manage a timer without causing re-renders.
 *
 * Use Case: Useful for managing timers or intervals that do not need to update the UI directly.
 */
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (timerRef.current) return; // If already running, do nothing
    timerRef.current = setInterval(() => setSeconds((prev) => prev + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
  };

  return (
    <div>
      <h1>Timer Example</h1>
      <h2>Seconds: {seconds}</h2>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

/**
 * Example 5: Using useRef to Reference a Custom Component
 *
 * This example shows how to use `useRef` to reference a custom component using `React.forwardRef`.
 *
 * Use Case: Useful when you need to pass a ref to a child component to access its internal DOM element or methods.
 */
const CustomInput = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function ForwardRefExample() {
  const customInputRef = useRef(null);

  const focusCustomInput = () => {
    if (customInputRef.current) customInputRef.current.focus();
  };

  return (
    <div>
      <h1>Forward Ref Example</h1>
      <CustomInput
        ref={customInputRef}
        placeholder="Click button to focus me"
      />
      <button onClick={focusCustomInput}>Focus Custom Input</button>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useRef Examples</h1>
      <FocusInput />
      <hr />
      <RenderCounter />
      <hr />
      <PreviousStateTracker />
      <hr />
      <Timer />
      <hr />
      <ForwardRefExample />
    </div>
  );
}

export default App;
