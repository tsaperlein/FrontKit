/**
 * This file demonstrates the usage of the `useLayoutEffect` hook in React.
 *
 * The `useLayoutEffect` hook is a version of `useEffect` that fires synchronously before the browser repaints the screen.
 * It is used when you need to measure the DOM or perform actions that affect the layout.
 *
 * --- What useLayoutEffect does ---
 * 1. It allows you to read layout information (e.g., element sizes, positions) before the browser repaints.
 * 2. It synchronously updates DOM-related properties, ensuring that the updates are applied immediately.
 * 3. It blocks the browser from painting until the effect is complete, making it suitable for measuring or manipulating the DOM.
 *
 * --- When to use useLayoutEffect ---
 * 1. When you need to measure or manipulate the DOM before the browser repaints, like measuring element size or adjusting layout.
 * 2. When performing operations like scroll positioning or animations that depend on the layout.
 * 3. When synchronizing visual changes based on dynamic measurements.
 *
 * --- When to be careful ---
 * 1. Avoid using `useLayoutEffect` for non-layout-related effects as it can hurt performance by blocking the browser.
 * 2. Prefer `useEffect` for side effects that don’t need to happen before the browser paints the screen.
 * 3. Avoid heavy computations or asynchronous tasks inside `useLayoutEffect` as it can cause the UI to freeze.
 *
 * --- Similar Hooks ---
 * - `useEffect`: Use `useEffect` for side effects that don’t require measuring or manipulating the DOM before the browser repaints.
 * - `useInsertionEffect`: Use `useInsertionEffect` for injecting styles or modifying stylesheets before the DOM updates.
 */

import React, { useState, useLayoutEffect, useRef } from "react";

/**
 * Example 1: Measuring DOM Elements Before Browser Paint
 *
 * This example demonstrates how `useLayoutEffect` can be used to measure a tooltip's height and adjust its position based on available space.
 * The tooltip first renders at an arbitrary position, then `useLayoutEffect` measures its height and updates its position accordingly.
 *
 * Use Case: Useful for components that need to dynamically position themselves based on available space, such as tooltips or popovers.
 */
function Tooltip({ children, targetRect }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    const { height } = tooltipRef.current.getBoundingClientRect();
    const topPosition =
      targetRect.top - height < 0 ? targetRect.bottom : targetRect.top - height;
    setPosition({ top: topPosition, left: targetRect.left });
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: "lightgray",
        padding: "5px",
        border: "1px solid black",
      }}
    >
      {children}
    </div>
  );
}

function TooltipExample() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [targetRect, setTargetRect] = useState({ top: 0, bottom: 0, left: 0 });

  const handleMouseOver = (e) => {
    const rect = e.target.getBoundingClientRect();
    setTargetRect(rect);
    setShowTooltip(true);
  };

  const handleMouseOut = () => setShowTooltip(false);

  return (
    <div>
      <h1>useLayoutEffect Example - Tooltip Positioning</h1>
      <button
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={{ marginTop: "50px", padding: "10px" }}
      >
        Hover over me!
      </button>
      {showTooltip && (
        <Tooltip targetRect={targetRect}>
          This tooltip adjusts its position based on available space.
        </Tooltip>
      )}
    </div>
  );
}

/**
 * Example 2: Synchronizing Scroll Position
 *
 * This example demonstrates how `useLayoutEffect` can be used to adjust the scroll position based on component size changes.
 * The scroll position is updated immediately after a component resizes, ensuring smooth scrolling.
 *
 * Use Case: Useful for keeping scroll positions consistent when dynamic content changes size, such as in chat applications or lists.
 */
function ScrollSyncComponent() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []); // Run only once after the component mounts.

  return (
    <div
      ref={containerRef}
      style={{
        height: "200px",
        overflowY: "scroll",
        border: "1px solid black",
        padding: "10px",
      }}
    >
      <div style={{ height: "600px" }}>
        <p>This content is scrollable.</p>
        <p>The scroll position is adjusted using useLayoutEffect.</p>
      </div>
    </div>
  );
}

/**
 * Example 3: Avoiding Flickering Effects with useLayoutEffect
 *
 * This example shows how `useLayoutEffect` can be used to prevent flickering effects during component updates.
 * The effect runs before the browser repaints, ensuring that visual changes are applied immediately.
 *
 * Use Case: Useful when working with animations or complex transitions that should not appear flickery or delayed.
 */
function FlickerFreeComponent() {
  const [count, setCount] = useState(0);
  const boxRef = useRef(null);

  useLayoutEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.backgroundColor =
        count % 2 === 0 ? "lightblue" : "lightcoral";
    }
  }, [count]); // Re-run the effect when `count` changes.

  return (
    <div>
      <h1>useLayoutEffect Example - Avoiding Flicker</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment Count
      </button>
      <div
        ref={boxRef}
        style={{
          width: "100px",
          height: "100px",
          marginTop: "20px",
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {count}
      </div>
    </div>
  );
}

/**
 * Example 4: Adjusting Component Size on Re-Renders
 *
 * This example demonstrates how `useLayoutEffect` can be used to measure and adjust the size of a component based on dynamic content.
 * The effect recalculates the size of the component each time the content changes, ensuring the component adapts correctly.
 *
 * Use Case: Useful for responsive components that need to adjust their size dynamically based on content changes.
 */
function ResizableComponent({ content }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerSize({ width, height });
    }
  }, [content]); // Re-run the effect when `content` changes.

  return (
    <div>
      <h1>useLayoutEffect Example - Resizable Component</h1>
      <div
        ref={containerRef}
        style={{
          border: "1px solid gray",
          padding: "10px",
          width: "fit-content",
        }}
      >
        {content}
      </div>
      <p>
        Component Size: {containerSize.width}px x {containerSize.height}px
      </p>
    </div>
  );
}

// Combine all components into a single display
function App() {
  return (
    <div>
      <h1>React useLayoutEffect Examples</h1>
      <TooltipExample />
      <hr />
      <ScrollSyncComponent />
      <hr />
      <FlickerFreeComponent />
      <hr />
      <ResizableComponent content="This is a dynamic content!" />
    </div>
  );
}

export default App;
