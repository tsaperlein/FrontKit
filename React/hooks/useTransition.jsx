/**
 * This file demonstrates the usage of the `useTransition` hook in React.
 *
 * The `useTransition` hook allows you to mark state updates as non-blocking transitions, keeping the UI responsive even when handling expensive operations.
 * It is particularly useful for scenarios where you want to prioritize certain UI updates (e.g., responding to user input) over others.
 *
 * --- What useTransition does ---
 * 1. It lets you mark state updates as transitions, which are deferred and do not block the UI from responding to more urgent updates.
 * 2. It returns a boolean `isPending` indicating whether the transition is ongoing and a `startTransition` function to wrap state updates as transitions.
 * 3. It prevents UI stalls by marking certain state updates as lower priority.
 *
 * --- When to use useTransition ---
 * 1. When performing complex or expensive updates that should not block user interactions, such as filtering a large list or switching tabs with intensive content.
 * 2. When handling state updates that can be deferred without affecting the responsiveness of interactive elements.
 * 3. When managing animations or complex layouts that can be updated asynchronously without interrupting more urgent tasks.
 *
 * --- When to be careful ---
 * 1. Avoid using `useTransition` for immediate or synchronous state updates (e.g., updating controlled form inputs).
 * 2. Only use `useTransition` when there is a clear performance benefit, as overusing it can complicate your code.
 * 3. Ensure that the state updates wrapped in `startTransition` are synchronous; asynchronous state updates will not be treated as transitions.
 *
 * --- Similar Hooks ---
 * - `useDeferredValue`: Use `useDeferredValue` to defer a value update rather than wrapping a state update in a transition.
 * - `useEffect`: Use `useEffect` for managing side effects, while `useTransition` is used for managing state transitions.
 */

import React, { useState, useTransition } from "react";

/**
 * Example 1: Updating State in a Transition
 *
 * This example demonstrates how `useTransition` can be used to update a tab's state while keeping the UI responsive.
 * The `isPending` flag indicates whether the transition is ongoing, allowing you to show a loading indicator during the transition.
 *
 * Use Case: Useful when switching between different views or tabs that require expensive rendering or data fetching.
 */
function TabContainer() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (nextTab) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <h1>useTransition Example - Tab Container</h1>
      <div>
        <button onClick={() => handleTabClick("home")}>Home</button>
        <button onClick={() => handleTabClick("about")}>About</button>
        <button onClick={() => handleTabClick("contact")}>Contact</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        {isPending ? <p>Loading content...</p> : <TabContent tab={tab} />}
      </div>
    </div>
  );
}

function TabContent({ tab }) {
  // Simulating a slow rendering process
  const renderTabContent = () => {
    const start = performance.now();
    while (performance.now() - start < 500) {
      // Intentional delay
    }
    return tab === "home"
      ? "Welcome to the Home Page!"
      : tab === "about"
      ? "About Us Page"
      : "Contact Us Page";
  };

  return <p>{renderTabContent()}</p>;
}

/**
 * Example 2: Preventing UI Blocking with List Filtering
 *
 * This example shows how `useTransition` can be used to perform filtering operations on a large list without blocking the UI.
 * The `isPending` flag indicates when the filtering is still in progress, showing a loading indicator while filtering.
 *
 * Use Case: Useful for operations like filtering or sorting a large dataset, where UI responsiveness is critical.
 */
function ListFilter() {
  const [filter, setFilter] = useState("");
  const [items] = useState(
    Array.from({ length: 20000 }, (_, index) => `Item ${index + 1}`)
  );
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    startTransition(() => {
      setFilteredItems(items.filter((item) => item.includes(value)));
    });
  };

  return (
    <div>
      <h1>useTransition Example - List Filtering</h1>
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Type to filter the list..."
      />
      <div style={{ marginTop: "20px" }}>
        {isPending ? (
          <p>Filtering items...</p>
        ) : (
          <ItemList items={filteredItems} />
        )}
      </div>
    </div>
  );
}

function ItemList({ items }) {
  return (
    <ul
      style={{
        maxHeight: "200px",
        overflowY: "scroll",
        border: "1px solid #ccc",
        padding: "10px",
      }}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Example 3: Managing Transitions with useTransition and Suspense
 *
 * This example demonstrates how `useTransition` can be combined with `Suspense` to create a responsive Suspense-enabled UI.
 * The `startTransition` function is used to trigger page navigation, while `Suspense` handles the loading state.
 *
 * Use Case: Useful when building page transitions or route changes that can take time due to data fetching or complex rendering.
 */
const Suspense = React.Suspense;

function SuspenseExample() {
  const [page, setPage] = useState("home");
  const [isPending, startTransition] = useTransition();

  const navigate = (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <div>
      <h1>useTransition Example - Suspense Integration</h1>
      <div>
        <button onClick={() => navigate("home")}>Home</button>
        <button onClick={() => navigate("about")}>About</button>
        <button onClick={() => navigate("contact")}>Contact</button>
      </div>
      <Suspense fallback={<p>Loading page...</p>}>
        <PageContent page={page} isPending={isPending} />
      </Suspense>
    </div>
  );
}

function PageContent({ page, isPending }) {
  // Simulating a delay for rendering the content
  const content =
    page === "home"
      ? "Welcome to the Home Page!"
      : page === "about"
      ? "About Us Page"
      : "Contact Us Page";

  return <p>{isPending ? "Loading..." : content}</p>;
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useTransition Examples</h1>
      <TabContainer />
      <hr />
      <ListFilter />
      <hr />
      <SuspenseExample />
    </div>
  );
}

export default App;
