/**
 * This file demonstrates the usage of the `useId` hook in React.
 *
 * The `useId` hook generates unique IDs that can be used for accessibility attributes or as unique identifiers in HTML elements.
 * It helps avoid hardcoding IDs, which can cause issues when the component is rendered multiple times on the page.
 *
 * --- What useId does ---
 * 1. It generates a unique ID string for each component instance where it is called.
 * 2. It ensures that IDs are unique even when a component is rendered multiple times on the page.
 * 3. It is often used for setting up accessibility attributes like `aria-describedby`, `aria-labelledby`, and more.
 *
 * --- When to use useId ---
 * 1. When you need to assign unique IDs to elements within a component, especially for accessibility attributes.
 * 2. When building reusable form components, ensuring that labels and inputs are properly connected.
 * 3. When managing IDs for multiple elements in a component, such as a list of form fields or other HTML elements.
 *
 * --- When to be careful ---
 * 1. Avoid using `useId` to generate keys for lists. Keys should be derived from your data, not generated IDs.
 * 2. Ensure that the ID is consistent between server-side and client-side rendering to avoid mismatches.
 * 3. If you need IDs for multiple related elements, use a shared prefix to manage them together.
 *
 * --- Similar Hooks ---
 * - `useState`: Use `useState` to manage state values that change during the component's lifecycle.
 * - `useContext`: Use `useContext` to pass values through the component tree without having to pass props manually.
 */

import React, { useId } from "react";

/**
 * Example 1: Basic useId Usage for Accessibility
 *
 * This example demonstrates how to use `useId` to generate unique IDs for accessibility attributes.
 * The `PasswordField` component uses `useId` to link the input's `aria-describedby` attribute with the paragraph's ID.
 *
 * Use Case: Useful when building accessible form components, ensuring that assistive technologies can correctly associate input fields and descriptions.
 */
function PasswordField() {
  const passwordHintId = useId();

  return (
    <div>
      <h1>useId Example - Password Field</h1>
      <label>
        Password:
        <input type="password" aria-describedby={passwordHintId} />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters.
      </p>
    </div>
  );
}

/**
 * Example 2: Generating IDs for Multiple Related Elements
 *
 * This example demonstrates how to use `useId` to create a shared prefix for multiple related elements.
 * Each input field has a unique ID generated using the shared prefix, ensuring that labels are correctly linked to their respective inputs.
 *
 * Use Case: Useful for building complex forms with multiple fields that need unique IDs for accessibility.
 */
function UserForm() {
  const id = useId();

  return (
    <div>
      <h1>useId Example - User Form</h1>
      <form>
        <label htmlFor={`${id}-firstName`}>First Name:</label>
        <input id={`${id}-firstName`} type="text" placeholder="First Name" />
        <br />
        <label htmlFor={`${id}-lastName`}>Last Name:</label>
        <input id={`${id}-lastName`} type="text" placeholder="Last Name" />
      </form>
    </div>
  );
}

/**
 * Example 3: Using useId with Multiple Components on the Same Page
 *
 * This example shows how `useId` can be used in multiple components on the same page without ID conflicts.
 * Each component generates its own unique ID, ensuring that no two components share the same ID, even if rendered multiple times.
 *
 * Use Case: Useful when building reusable components that may appear multiple times on a single page, such as in a dashboard or a list of form sections.
 */
function MultiplePasswordFields() {
  return (
    <div>
      <h1>useId Example - Multiple Password Fields</h1>
      <PasswordField />
      <PasswordField />
      <PasswordField />
    </div>
  );
}

/**
 * Example 4: Avoiding Hardcoded IDs and Server-Side Rendering Mismatches
 *
 * This example demonstrates using `useId` to avoid hardcoded IDs, which can cause issues during server-side rendering.
 * By using `useId`, the generated IDs are consistent between the client and server, avoiding mismatches and warnings.
 *
 * Use Case: Useful when building server-rendered React applications or components that must maintain consistent IDs across server and client renders.
 */
function ServerSideRenderedComponent() {
  const hintId = useId();

  return (
    <div>
      <h1>useId Example - Server-Side Rendering</h1>
      <label htmlFor={hintId}>Enter your code:</label>
      <input id={hintId} type="text" placeholder="Code" />
      <p id={hintId}>
        This is a server-rendered component with a consistent ID.
      </p>
    </div>
  );
}

/**
 * Example 5: Avoiding Key Generation with useId
 *
 * This example shows the common pitfall of using `useId` for key generation.
 * The correct way is to use a unique property from your data as the key.
 *
 * Use Case: This example highlights what **not** to do with `useId`.
 */
function ListComponent() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <div>
      <h1>useId Pitfall Example - Avoid Using useId for Keys</h1>
      <ul>
        {/* Do NOT use useId as keys for list items; use a unique identifier from the data instead. */}
        {items.map((item) => (
          <li key={item}>{item}</li> // Correct usage: Avoid using useId here.
        ))}
      </ul>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useId Examples</h1>
      <PasswordField />
      <hr />
      <UserForm />
      <hr />
      <MultiplePasswordFields />
      <hr />
      <ServerSideRenderedComponent />
      <hr />
      <ListComponent />
    </div>
  );
}

export default App;
