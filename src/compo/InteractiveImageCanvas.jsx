import DraggablePicture from "./DraggablePicture";
import ResizableDraggableItem from "./ResizableDraggableItem";
import { useDrop } from "react-dnd";
import "../App.css";
import React, { useState, useEffect } from "react";

function InteractiveImageCanvas() {
  // State
  const [board, setBoard] = useState([]);
  const [PictureList, setPictureList] = useState([]);
  const [newPictureUrl, setNewPictureUrl] = useState("");
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragSpeedMultiplier, setDragSpeedMultiplier] = useState(1.1);
  const [isLocked, setIsLocked] = useState(false);
  const [image, setImage] = useState(null);


  
  // Drag and drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item) => addImageToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Function to add an image to board
  const addImageToBoard = (id) => {
    // Find the picture with the given id from PictureList
    const pictureToAdd = PictureList.find((picture) => picture.id === id);

    if (!pictureToAdd) {
      alert("Error: Image not found");
      console.log(PictureList);
      return;
    }

    // Check if the picture id already exists in the board
    const isDuplicate = board.some((item) => item.id === pictureToAdd.id);

    if (isDuplicate) {
      console.log("This image is already in the board.");
      console.log("board :: ", board);
      return;
    }

    // Append the picture to the end of the board
    setBoard((prevBoard) => prevBoard.concat(pictureToAdd));
  };

  // Function to remove an item from the board based on its ID
  const removeItem = (id) => {
    setBoard((prevBoard) => {
      const itemExists = prevBoard.some((item) => item.id === id);

      if (!itemExists) {
        console.warn(`Item with id ${id} not found.`);
        return prevBoard;
      }

      const updatedBoard = prevBoard.filter((item) => item.id !== id);
      console.log(`Item with id ${id} removed. New board:`, updatedBoard);

      // Potentially perform other actions here, e.g., saving to a server

      return updatedBoard;
    });
  };

  useEffect(() => {
    // Use a map to track unique items based on id
    const uniqueIds = new Map();
    const filteredBoard = [];

    // Iterate through the current board state
    board.forEach((item) => {
      // Check if the item id is already in the map
      if (!uniqueIds.has(item.id)) {
        // If not, add it to the map and to the filtered board
        uniqueIds.set(item.id, true);
        filteredBoard.push(item);
      }
    });

    // Update board state only if there are changes
    if (filteredBoard.length !== board.length) {
      // Using a functional update to prevent stale state issues
      setBoard((prevBoard) => {
        // Check if the filteredBoard is actually different
        if (JSON.stringify(filteredBoard) !== JSON.stringify(prevBoard)) {
          return filteredBoard;
        }
        return prevBoard;
      });
    }
  }, [board]);

  // Function to handle input change for new picture URL
  const handleInputChange = (event) => {
    setNewPictureUrl(event.target.value);
  };

  // Function to add a new picture to PictureList
  const handleAddPicture = () => {
    if (newPictureUrl.trim() === "") {
      alert("Please enter a valid URL");
      return;
    }

    const newPicture = {
      id: PictureList.length + 1, // Use PictureList.length to get the correct id
      url: newPictureUrl,
    };

    PictureList.push(newPicture); // Add new picture to PictureList

    setNewPictureUrl(""); // Clear input after adding picture
  };

  // Function to handle mouse down events
  const handleMouseDown = (e) => {
    if (e.button === 0 && !isLocked) {
      const target = e.target;
      const rect = target.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  // Function to handle mouse move events during dragging
  const handleMouseMove = (e) => {
    if (dragging && !isLocked) {
      const offsetX = (e.clientX - dragStart.x) * dragSpeedMultiplier;
      const offsetY = (e.clientY - dragStart.y) * dragSpeedMultiplier;
      setDragOffset((prevOffset) => ({
        x: prevOffset.x + offsetX,
        y: prevOffset.y + offsetY,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Function to handle mouse up events, which stops dragging
  const handleMouseUp = () => {
    if (!isLocked) {
      setDragging(false);
    }
  };

  // Function to handle mouse wheel events for zooming in and out
  const handleWheel = (e) => {
    if (!isLocked) {
      const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prevZoom) =>
        Math.min(Math.max(prevZoom + zoomDelta, 0.3), 3)
      );
    }
  };

  // Function to reset zoom level and drag offset to their default values
  const handleReset = () => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  // useEffect hook to manage event listeners for mouse movements and zooming
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [dragging, isLocked, dragSpeedMultiplier, dragStart, zoomLevel]);

  // Function to handle file upload when button is clicked
  const handleFileUpload = (e) => {
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", "image/*");
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPictureUrl = reader.result;
          const newPicture = {
            id: PictureList.length + 1,
            url: newPictureUrl,
          };
          PictureList.push(newPicture);
          setImage(newPictureUrl); // Set image state to display uploaded image
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex w-full h-full">
      {/* Sidebar container for adding and managing pictures */}
      <div className="w-56 h-full ">
        <div className="w-60 bg-white flex drop-shadow-md shadow-gray-300  pt-16 fixed inset-y-0 left-0 z-10 flex flex-col">
          <div className="flex flex-col gap-5   items-center px-3">
            {/* Input field for entering the URL of a picture */}
            <input
              className="border border-gray-500 w-full h-9 px-3"
              placeholder="Enter picture URL"
              value={newPictureUrl}
              onChange={handleInputChange}
            />
            <div className="w-full   flex-col flex gap-4">
              {/* Button to add a picture using the URL from the input field */}
              <button
                onClick={handleAddPicture}
                className="bg-primary flex justify-center items-center p-3 gap-4 text-white  w-full	   hover:bg-third focus:outline-none focus:ring-2 focus:ring-third text-[16px]"
              >
                <svg
                  fill="#ffffff"
                  width="24px"
                  height="24px"
                  viewBox="0 0 56.00 56.00"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M 27.9999 51.9062 C 41.0546 51.9062 51.9063 41.0547 51.9063 28.0000 C 51.9063 14.9219 41.0312 4.0938 27.9765 4.0938 C 14.8983 4.0938 4.0937 14.9219 4.0937 28.0000 C 4.0937 41.0547 14.9218 51.9062 27.9999 51.9062 Z M 38.4062 17.1016 C 41.3124 19.9844 41.0546 23.5469 37.7030 26.875 L 33.6718 30.9297 C 33.9999 29.8047 33.9765 28.4922 33.6014 27.6016 L 35.9687 25.2344 C 38.2655 22.9844 38.5234 20.6172 36.6952 18.8125 C 34.8905 17.0313 32.5234 17.3125 30.2733 19.5625 L 26.9218 22.8672 C 24.6014 25.2109 24.2968 27.6016 26.1249 29.3828 C 26.6640 29.9453 27.4609 30.2969 28.4921 30.4844 C 28.1405 31.2344 27.4140 32.1016 26.7343 32.5703 C 26.0312 32.4531 25.1405 31.8906 24.3905 31.1172 C 21.4843 28.2344 21.7890 24.625 25.1874 21.2031 L 28.6093 17.8047 C 31.9609 14.4531 35.5234 14.2187 38.4062 17.1016 Z M 16.7499 38.7578 C 13.8436 35.875 14.1014 32.3125 17.4765 28.9844 L 21.5077 24.9297 C 21.1562 26.0547 21.1796 27.3672 21.5546 28.2578 L 19.1874 30.625 C 16.8905 32.8516 16.6327 35.2422 18.4609 37.0469 C 20.2655 38.8281 22.6562 38.5469 24.8827 36.2969 L 28.2343 32.9922 C 30.5546 30.6484 30.8593 28.2578 29.0312 26.4766 C 28.4921 25.9140 27.6952 25.5625 26.6640 25.375 C 27.0155 24.625 27.7421 23.7578 28.4218 23.2891 C 29.1249 23.4062 30.0155 23.9687 30.7890 24.7422 C 33.6718 27.625 33.3671 31.2109 29.9687 34.6328 L 26.5468 38.0547 C 23.1952 41.4063 19.6327 41.6406 16.7499 38.7578 Z"></path>
                  </g>
                </svg>
                From Link
              </button>
              {/* Button to upload a picture file */}
              <button
                onClick={handleFileUpload}
                className="bg-primary flex justify-center items-center p-3 gap-4 text-white  w-full	   hover:bg-third focus:outline-none focus:ring-2 focus:ring-third text-[16px]"
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.82572 12.5556L9.45426 13.1841L11.524 11.1144V17H12.4129V11.1144L14.4826 13.1841L15.1111 12.5556L11.9684 9.41286L8.82572 12.5556ZM16 7.66667V8.55556H8V7.66667H16Z"
                      fill="#ffffff"
                    ></path>{" "}
                  </g>
                </svg>
                From File
              </button>
            </div>
          </div>
          {/* List of added pictures */}
          <div className="w-full flex flex-col gap-5 p-6 overflow-y-auto mt-4">
            {PictureList.map((picture) => (
              <DraggablePicture
                key={picture.id}
                url={picture.url}
                id={picture.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="w-96 h-full ">
        <div className="w-full h-screen overflow-hidden fixed z-0">
          {/* Container for board interactions */}
          <div
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu
            style={{
              cursor: dragging ? "auto" : "grab",
            }}
            className="w-full h-full grid justify-center content-center"
          >
            {/* Buttons for resetting the board and locking/unlocking */}
            <div
              style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                zIndex: 1000,
              }}
            >
              <div className="flex gap-5">
                <button
                  onClick={handleReset}
                  className="w-20 bg-primary text-white"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsLocked((prev) => !prev)}
                  className={`${
                    isLocked ? "bg-third" : "bg-primary"
                  } text-white px-4 py-2`}
                >
                  {isLocked ? "Unlock" : "Lock"}
                </button>
              </div>
            </div>
            {/* Board with zoom and drag capabilities */}
            <div
              onContextMenu={(e) => e.preventDefault()}
              onMouseDown={handleMouseDown}
              style={{
                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transformOrigin: "center",
                backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 2px, transparent 2px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 2px, transparent 2px)
                                 `,
                backgroundSize: "30px 30px",
                backgroundColor: isOver ? "#FFF4E6" : "white",
              }}
              className="w-[50000px] h-[50000px] z-1 grid justify-center content-center"
              ref={drop}
            >
              {board.map((draggable, index) => (
                <ResizableDraggableItem
                  key={`board-${draggable.id}-${index}`}
                  url={draggable.url}
                  id={draggable.id}
                  removeItem={removeItem}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveImageCanvas;
