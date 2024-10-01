/**
 * This file demonstrates the usage of the `useContext` hook in React.
 *
 * The `useContext` hook provides a way to access values from a React Context, which allows passing data deeply in the component tree without manually passing props at every level.
 * It is typically used to share state or other information across components without "prop drilling."
 *
 * --- What useContext does ---
 * 1. It reads the current value of a context and subscribes to it, so it will automatically re-render whenever the context value changes.
 * 2. It returns the context value from the closest matching context provider above the calling component.
 * 3. It helps avoid passing down props through every component and simplifies state management.
 *
 * --- When to use useContext ---
 * 1. When you need to share data, state, or functions across multiple components without passing props through every level.
 * 2. When managing global state such as user authentication, themes, or localization settings.
 * 3. When consuming context in a functional component to access shared state or methods.
 *
 * --- When to be careful ---
 * 1. Avoid using `useContext` for state that frequently changes, as it may lead to unnecessary re-renders of components that depend on the context.
 * 2. Avoid using `useContext` to manage state that only affects a small part of the component tree; use local state with `useState` instead.
 * 3. Ensure that the provider is above the component using the context in the component tree, or it will return `undefined`.
 *
 * --- Similar Hooks ---
 * - `useState`: For local state management. Use `useState` when the state doesn't need to be shared globally.
 * - `useReducer`: For managing complex state logic that involves multiple sub-values or requires conditional updates.
 */

import React, { useState, useContext, createContext } from "react";

/**
 * Example 1: Basic useContext Usage
 *
 * This example demonstrates how to use `useContext` to share a simple value between components.
 * A `UserContext` is created and provided to components in the tree.
 *
 * Use Case: Useful for sharing simple values like user information or application settings across multiple components.
 */
const UserContext = createContext();

function Component1() {
  const [user, setUser] = useState("John Doe");

  return (
    <UserContext.Provider value={user}>
      <h1>Component 1</h1>
      <p>{`Hello ${user}`}</p>
      <Component2 />
      <button onClick={() => setUser("Jane Smith")}>Change User</button>
    </UserContext.Provider>
  );
}

function Component2() {
  return (
    <div>
      <h2>Component 2</h2>
      <Component3 />
    </div>
  );
}

function Component3() {
  return (
    <div>
      <h3>Component 3</h3>
      <Component4 />
    </div>
  );
}

function Component4() {
  return (
    <div>
      <h4>Component 4</h4>
      <Component5 />
    </div>
  );
}

function Component5() {
  const user = useContext(UserContext);

  return (
    <div>
      <h5>Component 5</h5>
      <p>{`Hello again, ${user}!`}</p>
    </div>
  );
}

/**
 * Example 2: Updating Context Value
 *
 * This example shows how to use `useContext` to consume and update context values.
 * A `ThemeContext` is created to toggle between light and dark themes.
 *
 * Use Case: Useful when you need to change a shared state (like a theme) and update all components that depend on it.
 */
const ThemeContext = createContext();

function ThemeComponent() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        style={{
          background: theme === "light" ? "#fff" : "#333",
          color: theme === "light" ? "#000" : "#fff",
        }}
      >
        <h1>Theme Component</h1>
        <p>The current theme is {theme}</p>
        <ThemeSwitcher />
      </div>
    </ThemeContext.Provider>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Switch to {theme === "light" ? "dark" : "light"} theme
    </button>
  );
}

/**
 * Example 3: Multiple Context Providers
 *
 * This example demonstrates how to use multiple context providers to pass different types of context values.
 *
 * Use Case: Useful for managing different kinds of global state, such as user info and theme, separately.
 */
const LanguageContext = createContext();

function MultiContextComponent() {
  const [language, setLanguage] = useState("English");

  return (
    <UserContext.Provider value="John Doe">
      <ThemeContext.Provider value={{ theme: "light", setTheme: () => {} }}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <MultiContextChild />
        </LanguageContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

function MultiContextChild() {
  const user = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div>
      <h1>Multi-Context Component</h1>
      <p>{`User: ${user}`}</p>
      <p>{`Theme: ${theme}`}</p>
      <p>{`Language: ${language}`}</p>
      <button
        onClick={() =>
          setLanguage(language === "English" ? "Spanish" : "English")
        }
      >
        Switch Language
      </button>
    </div>
  );
}

/**
 * Example 4: Context with a Custom Hook
 *
 * This example shows how to create a custom hook (`useAuth`) to simplify context usage.
 *
 * Use Case: Useful when you want to encapsulate context logic and access it through a custom hook.
 */
const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AuthComponent() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <h1>Authentication Component</h1>
      <p>{`Authenticated: ${isAuthenticated}`}</p>
      <button onClick={isAuthenticated ? logout : login}>
        {isAuthenticated ? "Logout" : "Login"}
      </button>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useContext Examples</h1>
      <Component1 />
      <hr />
      <ThemeComponent />
      <hr />
      <MultiContextComponent />
      <hr />
      <AuthProvider>
        <AuthComponent />
      </AuthProvider>
    </div>
  );
}

export default App;
