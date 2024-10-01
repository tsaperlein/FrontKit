/**
 * This file demonstrates the usage of the `useDeferredValue` hook in React.
 *
 * The `useDeferredValue` hook is used to create a deferred version of a value, which allows React to delay updating a part of the UI when higher priority updates, such as user interactions, are occurring.
 *
 * --- What useDeferredValue does ---
 * 1. It defers the value update until React has more time, prioritizing more urgent updates such as input handling.
 * 2. It returns a version of the value that "lags behind" the actual value, updating later to avoid blocking the UI.
 * 3. It is often used to keep a part of the UI responsive while rendering other parts in the background.
 *
 * --- When to use useDeferredValue ---
 * 1. When a component update is computationally expensive, and it’s okay for this part of the UI to update more slowly.
 * 2. When managing text input or other UI elements that should respond immediately, while secondary UI elements update more slowly.
 * 3. When using `Suspense` to display a fallback UI, allowing React to render the new value in the background without blocking user interactions.
 *
 * --- When to be careful ---
 * 1. Avoid using `useDeferredValue` if the deferred value is necessary for the UI to feel complete or accurate.
 * 2. Use `useDeferredValue` only for values that can lag behind, like search results or secondary UI updates.
 * 3. Ensure that deferred components are wrapped in `React.memo` to prevent unnecessary renders.
 *
 * --- Similar Hooks ---
 * - `useTransition`: Use `useTransition` to defer an entire update, while `useDeferredValue` defers a single value.
 * - `useMemo`: Use `useMemo` to cache expensive calculations, but use `useDeferredValue` when you want to delay updates for a specific value.
 */

import React, { useState, useDeferredValue, useMemo, memo } from "react";

/**
 * Example 1: Basic useDeferredValue Usage with Search Input
 *
 * This example demonstrates how `useDeferredValue` can be used to show stale content while new content is loading.
 * When typing in the search box, the input updates immediately, but the displayed search results are deferred.
 *
 * Use Case: Useful when managing text input, such as filtering a list or searching, where the input should update immediately while the filtered results can update later.
 */
function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredResults = useMemo(() => {
    const results = ["Apple", "Banana", "Orange", "Grape", "Watermelon"];
    console.log("Filtering results for query:", deferredQuery);
    return results.filter((item) =>
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery]);

  return (
    <div>
      <h1>Search Page with useDeferredValue</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a fruit..."
      />
      <h2>Search Results</h2>
      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

/**
 * Example 2: Using useDeferredValue to Indicate Stale Content
 *
 * This example uses `useDeferredValue` to visually indicate when the displayed content is stale.
 * The opacity of the results changes to indicate that the content is being updated.
 *
 * Use Case: Useful for showing the user that the displayed results are out of sync with the input while new results are being loaded.
 */
function SearchWithStaleIndicator() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredResults = useMemo(() => {
    const results = ["Cat", "Dog", "Elephant", "Giraffe", "Lion"];
    console.log("Filtering results for query:", deferredQuery);
    return results.filter((item) =>
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery]);

  const isStale = query !== deferredQuery;

  return (
    <div>
      <h1>Search with Stale Content Indicator</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an animal..."
      />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <h2>Search Results</h2>
        {filteredResults.length > 0 ? (
          <ul>
            {filteredResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
      {isStale && <p style={{ color: "gray" }}>Results are updating...</p>}
    </div>
  );
}

/**
 * Example 3: Deferring Re-Renders of a Slow Component
 *
 * This example uses `useDeferredValue` to defer the re-rendering of a slow list component.
 * The list component (`SlowList`) updates at a slower pace, allowing the input field to remain responsive.
 *
 * Use Case: Useful when rendering complex or large lists that can block the main thread and cause the UI to freeze.
 */
const SlowList = memo(({ text }) => {
  console.log("Rendering SlowList...");
  const items = Array.from(
    { length: 10000 },
    (_, index) => `${text} - Item ${index + 1}`
  );
  return (
    <div>
      <h2>Deferred Slow List</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
});

function App() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  return (
    <div>
      <h1>useDeferredValue Examples</h1>
      <SearchPage />
      <hr />
      <SearchWithStaleIndicator />
      <hr />
      <div>
        <h1>Slow Component with useDeferredValue</h1>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here to see deferred updates"
        />
        <SlowList text={deferredText} />
      </div>
    </div>
  );
}

export default App;
