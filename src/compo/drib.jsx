import React, { useState, useCallback, useEffect } from "react";

function Drib({ id, url, removeItem }) {
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  // Function to handle zoom in
  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Max scale of 3
  };

  // Function to handle zoom out
  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min scale of 0.5
  };

  // Function to reset zoom
  const resetZoom = () => {
    setScale(1); // Reset to default scale of 1
  };

  // Mouse down event handler for dragging
  const handleMouseDown = (e) => {
    if (!isLocked && e.button === 2) {
      // Check for right mouse button
      e.preventDefault(); // Prevent default context menu
      setDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  // Mouse move event handler for dragging
  const handleMouseMove = useCallback(
    (e) => {
      if (dragging && !isLocked) {
        setPosition({
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y,
        });
      }
    },
    [dragging, isLocked, startPosition]
  );

  // Mouse up event handler for stopping dragging
  const handleMouseUp = () => {
    if (!isLocked) {
      setDragging(false);
    }
  };

  // Add event listeners for mouse move and mouse up
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  // Touch event handlers for mobile support
  const handleTouchStart = (e) => {
    if (!isLocked) {
      setDragging(true);
      const touch = e.touches[0];
      setStartPosition({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (dragging && !isLocked) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - startPosition.x,
          y: touch.clientY - startPosition.y,
        });
      }
    },
    [dragging, isLocked, startPosition]
  );

  const handleTouchEnd = () => {
    if (!isLocked) {
      setDragging(false);
    }
  };

  useEffect(() => {
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchMove]);

  // Toggle lock state
  const toggleLock = () => {
    setIsLocked((prevLocked) => !prevLocked);
  };

  return (
    <div
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: dragging ? "none" : "transform 0.3s",
        cursor: isLocked ? "default" : "context-menu", // Change cursor on drag
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="relative flex gap-10"
    >
      <div className="flex">
        <img
          src={url}
          key={id}
          className="rounded-lg shadow-lg border border-gray-300"
          alt="rescalable"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
            transition: "transform 0.3s",
          }} // Apply scaling
        />
      </div>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "left",
          transition: "transform 0.3s",
        }}
        className="relative flex flex-col right-2 z-10"
      >
        <button
          onClick={zoomIn}
          className="px-3 py-2 w-14 bg-primary hover:bg-third text-white rounded  mt-2"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M20 20L14.9497 14.9497M14.9497 14.9497C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10M14.9497 14.9497C13.683 16.2165 11.933 17 10 17C8.09269 17 6.36355 16.2372 5.10102 15M7 10H13M10 7V13"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="px-3 py-2 w-14 bg-primary hover:bg-third text-white rounded  mt-2"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M20 20L14.9497 14.9498M14.9497 14.9498C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10M14.9497 14.9498C13.683 16.2165 11.933 17 10 17C8.09269 17 6.36355 16.2372 5.10102 15M7 10H13"
                stroke="#ffffff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={resetZoom}
          className="px-3 py-2 w-14 bg-primary hover:bg-third text-white rounded  mt-2"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g
                fill="none"
                fill-rule="evenodd"
                stroke="#ffffff"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="matrix(0 1 1 0 2.5 2.5)"
              >
                {" "}
                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"></path>{" "}
                <circle cx="8" cy="8" fill="#ffffff" r="2"></circle>{" "}
                <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={() => removeItem(id)}
          className="px-3 py-2 w-14 bg-primary hover:bg-third text-white rounded  mt-2"
        >
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M10 12V17"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M14 12V17"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M4 7H20"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
        <button
          onClick={toggleLock}
          className={`px-3 py-2 mt-2 ${
            isLocked ? "bg-third" : "bg-primary"
          } text-white rounded hover:${isLocked ? "bg-primary" : "bg-third"}`}
        >
          {isLocked ? "Unlock" : "Lock"}
        </button>
      </div>
    </div>
  );
}

export default Drib;
