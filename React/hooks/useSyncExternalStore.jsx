/**
 * This file demonstrates the usage of the `useSyncExternalStore` hook in React.
 *
 * The `useSyncExternalStore` hook lets you subscribe to an external data store, providing a way to read and react to changes in a non-React state.
 * It is often used to integrate React with external state management libraries or browser APIs that have their own state and subscriptions.
 *
 * --- What useSyncExternalStore does ---
 * 1. It allows React components to read and subscribe to external data sources like global state managers, browser APIs, or other shared data.
 * 2. It returns the current snapshot of the external data, re-rendering the component when the external store changes.
 * 3. It ensures consistent reads between client and server rendering when used with a `getServerSnapshot` function.
 *
 * --- When to use useSyncExternalStore ---
 * 1. When integrating with state managers or APIs that exist outside of React's state management, such as Redux or browser APIs.
 * 2. When reading from data that is shared across different parts of the application but isn’t directly managed by React.
 * 3. When needing a consistent snapshot for server-side rendering or hydration.
 *
 * --- When to be careful ---
 * 1. Avoid using it for values that can be managed within React’s own state management (`useState` or `useReducer`).
 * 2. Ensure that the snapshot returned by `getSnapshot` is immutable to avoid re-renders due to mutation.
 * 3. Avoid using `useSyncExternalStore` to suspend rendering, as it may cause poor user experiences if not handled correctly.
 *
 * --- Similar Hooks ---
 * - `useState` or `useReducer`: Use these hooks for managing internal component state instead of subscribing to external stores.
 * - `useEffect`: Use `useEffect` for side effects, while `useSyncExternalStore` is meant for synchronizing React components with external data.
 */

import React, { useState, useEffect, useSyncExternalStore } from "react";

/**
 * Example 1: Subscribing to an External Store
 *
 * This example demonstrates how `useSyncExternalStore` can be used to connect a component to an external store.
 * The `Counter` component subscribes to changes in a global `counterStore`, updating whenever the store value changes.
 *
 * Use Case: Useful for integrating with third-party state management libraries that manage state outside of React.
 */
const counterStore = {
  value: 0,
  listeners: new Set(),
  increment() {
    this.value++;
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  getSnapshot() {
    return this.value;
  },
};

function Counter() {
  const count = useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getSnapshot
  );

  return (
    <div>
      <h1>useSyncExternalStore Example - Counter</h1>
      <p>Counter Value: {count}</p>
      <button onClick={() => counterStore.increment()}>
        Increment Counter
      </button>
    </div>
  );
}

/**
 * Example 2: Subscribing to a Browser API
 *
 * This example shows how to use `useSyncExternalStore` to subscribe to browser APIs like `navigator.onLine`.
 * The `NetworkStatus` component updates whenever the user's network status changes.
 *
 * Use Case: Useful for subscribing to browser events or APIs that expose state outside of React.
 */
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,
    () => true // Return true as the initial server snapshot during server rendering.
  );
}

function NetworkStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div>
      <h1>useSyncExternalStore Example - Network Status</h1>
      <p>{isOnline ? "You are online ✅" : "You are offline ❌"}</p>
    </div>
  );
}

/**
 * Example 3: Using useSyncExternalStore in a Custom Hook
 *
 * This example demonstrates how to encapsulate `useSyncExternalStore` within a custom hook.
 * The `useWindowSize` hook subscribes to the window's resize events, updating the component whenever the window size changes.
 *
 * Use Case: Useful for creating reusable hooks that can be shared across different components in your application.
 */
function useWindowSize() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    () => ({
      width: 1024, // Default width for server-side rendering.
      height: 768, // Default height for server-side rendering.
    })
  );
}

function WindowSize() {
  const size = useWindowSize();

  return (
    <div>
      <h1>useSyncExternalStore Example - Window Size</h1>
      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
    </div>
  );
}

/**
 * Example 4: Adding Server-Side Support with useSyncExternalStore
 *
 * This example demonstrates how `useSyncExternalStore` can be used to provide server-side rendering support.
 * The `useWindowSize` hook includes a `getServerSnapshot` function to provide an initial snapshot for server rendering.
 *
 * Use Case: Useful for ensuring consistent state between server and client during the initial render, such as for server-side rendered apps.
 */
function useDocumentTitle() {
  return useSyncExternalStore(
    (callback) => {
      document.addEventListener("visibilitychange", callback);
      return () => document.removeEventListener("visibilitychange", callback);
    },
    () => document.title,
    () => "Document Title" // Default server-side snapshot
  );
}

function DocumentTitle() {
  const title = useDocumentTitle();

  return (
    <div>
      <h1>useSyncExternalStore Example - Document Title</h1>
      <p>Current Document Title: {title}</p>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useSyncExternalStore Examples</h1>
      <Counter />
      <hr />
      <NetworkStatus />
      <hr />
      <WindowSize />
      <hr />
      <DocumentTitle />
    </div>
  );
}

export default App;
