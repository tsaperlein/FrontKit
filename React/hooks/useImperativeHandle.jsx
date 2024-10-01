/**
 * This file demonstrates the usage of the `useImperativeHandle` hook in React.
 *
 * The `useImperativeHandle` hook allows you to customize the value exposed to parent components when using `ref`.
 * It is often used to create custom methods or properties that can be called imperatively from the parent component.
 *
 * --- What useImperativeHandle does ---
 * 1. It customizes the handle (methods or properties) exposed to the parent component when a component is wrapped with `forwardRef`.
 * 2. It allows creating and exposing specific methods to be used outside of the component, like custom DOM manipulations or triggering specific actions.
 * 3. It provides fine-grained control over what part of a component is exposed through `ref`.
 *
 * --- When to use useImperativeHandle ---
 * 1. When building components that need to expose custom methods or properties to their parent, such as focus methods or custom animations.
 * 2. When managing complex component interactions that are difficult to handle through props alone.
 * 3. When needing to perform imperative actions on child components that are not directly exposed through props.
 *
 * --- When to be careful ---
 * 1. Avoid using `useImperativeHandle` for actions that can be expressed through props or state changes. Use it only for imperative actions.
 * 2. Ensure that the ref passed to `useImperativeHandle` is created with `React.createRef` or `useRef`.
 * 3. Make sure to use `useImperativeHandle` inside a `forwardRef` component.
 *
 * --- Similar Hooks ---
 * - `useRef`: Use `useRef` when you only need to access a DOM element or a component instance directly.
 * - `forwardRef`: Use `forwardRef` to pass down refs to child components. `useImperativeHandle` is often used together with `forwardRef`.
 */

import React, { useRef, useImperativeHandle, forwardRef } from "react";

/**
 * Example 1: Basic useImperativeHandle Usage
 *
 * This example demonstrates how `useImperativeHandle` can expose custom methods like `focus` and `scrollIntoView` from an input field.
 * The `MyInput` component uses `useImperativeHandle` to create a custom handle that includes these methods.
 *
 * Use Case: Useful for exposing custom methods or properties from a component that aren't available through its props.
 */
const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) inputRef.current.focus();
    },
    scrollIntoView: () => {
      if (inputRef.current)
        inputRef.current.scrollIntoView({ behavior: "smooth" });
    },
  }));

  return <input {...props} ref={inputRef} />;
});

function ParentComponent() {
  const inputRef = useRef(null);

  const handleFocusClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleScrollClick = () => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
    }
  };

  return (
    <div>
      <h1>useImperativeHandle Example - Custom Input Methods</h1>
      <MyInput ref={inputRef} placeholder="Click buttons to interact" />
      <button onClick={handleFocusClick}>Focus Input</button>
      <button onClick={handleScrollClick}>Scroll Input into View</button>
    </div>
  );
}

/**
 * Example 2: Exposing Multiple Methods from a Custom Component
 *
 * This example shows how to use `useImperativeHandle` to expose multiple methods like `open`, `close`, and `toggle` from a custom component.
 * The `Modal` component uses `useImperativeHandle` to provide an API for controlling its visibility.
 *
 * Use Case: Useful when building reusable components that need to be controlled imperatively from parent components.
 */
const Modal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }));

  return isOpen ? (
    <div className="modal">
      <p>Modal Content</p>
      <button onClick={() => setIsOpen(false)}>Close</button>
    </div>
  ) : null;
});

function ModalController() {
  const modalRef = useRef(null);

  return (
    <div>
      <h1>useImperativeHandle Example - Modal Control</h1>
      <button onClick={() => modalRef.current?.open()}>Open Modal</button>
      <button onClick={() => modalRef.current?.close()}>Close Modal</button>
      <button onClick={() => modalRef.current?.toggle()}>Toggle Modal</button>
      <Modal ref={modalRef} />
    </div>
  );
}

/**
 * Example 3: Avoiding Full DOM Exposure
 *
 * This example shows how `useImperativeHandle` can be used to expose only specific methods from a component, without giving access to the full DOM node.
 * The `CustomButton` component provides a `click` method without exposing the entire button's DOM node to the parent.
 *
 * Use Case: Useful for restricting access to only specific parts of a component's functionality.
 */
const CustomButton = forwardRef((props, ref) => {
  const buttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      if (buttonRef.current) buttonRef.current.click();
    },
  }));

  return (
    <button {...props} ref={buttonRef}>
      Click Me
    </button>
  );
});

function ButtonController() {
  const buttonRef = useRef(null);

  return (
    <div>
      <h1>useImperativeHandle Example - Custom Button</h1>
      <button onClick={() => buttonRef.current?.click()}>
        Trigger Button Click
      </button>
      <CustomButton ref={buttonRef} />
    </div>
  );
}

/**
 * Example 4: Managing Animation Control with useImperativeHandle
 *
 * This example uses `useImperativeHandle` to control a simple animation component. The exposed methods start and stop the animation.
 *
 * Use Case: Useful for controlling animations or triggering visual changes in a component.
 */
const AnimatedBox = forwardRef((props, ref) => {
  const boxRef = useRef(null);

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      if (boxRef.current) {
        boxRef.current.style.transition = "transform 1s ease-in-out";
        boxRef.current.style.transform = "translateX(200px)";
      }
    },
    stopAnimation: () => {
      if (boxRef.current) {
        boxRef.current.style.transform = "translateX(0)";
      }
    },
  }));

  return (
    <div
      {...props}
      ref={boxRef}
      style={{ width: "100px", height: "100px", backgroundColor: "blue" }}
    />
  );
});

function AnimationController() {
  const animationRef = useRef(null);

  return (
    <div>
      <h1>useImperativeHandle Example - Animation Control</h1>
      <button onClick={() => animationRef.current?.startAnimation()}>
        Start Animation
      </button>
      <button onClick={() => animationRef.current?.stopAnimation()}>
        Stop Animation
      </button>
      <AnimatedBox ref={animationRef} />
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useImperativeHandle Examples</h1>
      <ParentComponent />
      <hr />
      <ModalController />
      <hr />
      <ButtonController />
      <hr />
      <AnimationController />
    </div>
  );
}

export default App;
