/**
 * This file demonstrates the usage of the `useReducer` hook in React.
 *
 * The `useReducer` hook is similar to `useState` but is more powerful in scenarios where state management is complex.
 * It helps manage multiple pieces of state and allows grouping state updates into a single function, the reducer.
 *
 * --- What useReducer does ---
 * 1. It adds a reducer function to your component, which manages complex state logic.
 * 2. It returns the current state and a `dispatch` function that can trigger state updates based on action types.
 * 3. It allows separating state transition logic from the component, making it more predictable and easier to manage.
 *
 * --- When to use useReducer ---
 * 1. When you have complex state logic that involves multiple state variables or dependencies.
 * 2. When managing multiple state variables that need to be updated together based on a single user action.
 * 3. When using state transition logic that can be extracted into a separate function, making it easier to debug.
 *
 * --- When to be careful ---
 * 1. Avoid using `useReducer` if state management is simple; `useState` is more suitable for simple cases.
 * 2. The `dispatch` function should not be called inside the render loop, as it can cause an infinite loop.
 * 3. Always return a new state object from the reducer to avoid state mutation issues.
 *
 * --- Similar Hooks ---
 * - `useState`: Use `useState` for simpler state updates. Use `useReducer` when state logic becomes complex and involves multiple actions.
 */

import React, { useReducer } from "react";

/**
 * Example 1: Basic Counter with useReducer
 *
 * This example demonstrates how to use `useReducer` to implement a basic counter.
 * The reducer function handles `increment` and `decrement` actions to update the state.
 *
 * Use Case: Ideal for simple counters where actions can be easily handled by a single reducer.
 */
const initialCount = { count: 0 };

function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialCount);

  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
    </div>
  );
}

/**
 * Example 2: Todo List with useReducer
 *
 * This example demonstrates how to use `useReducer` to manage a todo list.
 * The reducer handles adding, toggling, and deleting todo items.
 *
 * Use Case: Useful for managing lists or collections of items where different actions can be performed.
 */
const initialTodos = [
  { id: 1, title: "Learn React", completed: false },
  { id: 2, title: "Learn useReducer", completed: false },
];

function todoReducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), title: action.title, completed: false },
      ];
    case "toggle":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "delete":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [newTodo, setNewTodo] = React.useState("");

  const handleAddTodo = () => {
    dispatch({ type: "add", title: newTodo });
    setNewTodo("");
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New Todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: "toggle", id: todo.id })}
              />
              {todo.title}
              <button onClick={() => dispatch({ type: "delete", id: todo.id })}>
                Delete
              </button>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example 3: Managing Forms with useReducer
 *
 * This example demonstrates how to use `useReducer` to manage form inputs.
 * The reducer handles updates to form fields and resetting the form.
 *
 * Use Case: Useful for forms with multiple fields that need to be managed together.
 */
const initialFormState = {
  username: "",
  email: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "updateField":
      return { ...state, [action.field]: action.value };
    case "reset":
      return initialFormState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  return (
    <div>
      <h1>Form with useReducer</h1>
      <label>
        Username:
        <input
          value={state.username}
          onChange={(e) =>
            dispatch({
              type: "updateField",
              field: "username",
              value: e.target.value,
            })
          }
        />
      </label>
      <br />
      <label>
        Email:
        <input
          value={state.email}
          onChange={(e) =>
            dispatch({
              type: "updateField",
              field: "email",
              value: e.target.value,
            })
          }
        />
      </label>
      <br />
      <button onClick={() => dispatch({ type: "reset" })}>Reset Form</button>
      <p>Username: {state.username}</p>
      <p>Email: {state.email}</p>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useReducer Examples</h1>
      <Counter />
      <hr />
      <TodoList />
      <hr />
      <Form />
    </div>
  );
}

export default App;
