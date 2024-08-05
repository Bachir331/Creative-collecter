import Picture from "./Picture";
import Drib from "./drib";
import { useDrop } from "react-dnd";
import "../App.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useRef, useState, useEffect, useCallback } from "react";

function DragDrop() {
  // State for board (selected pictures) and PictureList (all pictures)
  const [board, setBoard] = useState([]);
  const [PictureList, setPictureList] = useState([]);
  const [newPictureUrl, setNewPictureUrl] = useState("");

  // Drag and drop functionality
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image", // Specify the type of item accepted (e.g., 'image')
    drop: (item) => addImageToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  useEffect(() => {
    // console.log("PictureList changed:", PictureList);
  }, [PictureList]);
  // Function to add an image to board
  const addImageToBoard = (id) => {
    // Find the picture with the given id from PictureList
    const pictureToAdd = PictureList.find((picture) => picture.id === id);

    if (!pictureToAdd) {
      alert("Error: Image not found");
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
    setBoard((prevBoard) => [...prevBoard, pictureToAdd]);
  };
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

    const newId =
      PictureList.length === 0 ? 0 : PictureList[PictureList.length - 1].id + 1;
    const newPicture = {
      id: PictureList + 1,
      url: newPictureUrl,
    };
    PictureList.push(newPicture);

    // setNewPictureUrl(""); // Clear input after adding picture

    // console.log("PictureList updated:", PictureList);
    // console.log("Added new picture:", newPicture);
    // console.log("Current board:", board);
  };

  // Log PictureList and board whenever PictureList changes

  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragSpeedMultiplier, setDragSpeedMultiplier] = useState(0.5);
  const [isLocked, setIsLocked] = useState(false); // New state for lock

  // Handle the zooming functionality
  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
  };

  // Reset zoom to the default level
  const resetZoom = () => {
    setZoomLevel(1);
    setDragOffset({ x: 0, y: 0 });
  };

  // Event handler for mouse down
  const handleMouseDown = (e) => {
    if (e.button === 0 && !isLocked) {
      const target = e.target;
      const rect = target.getBoundingClientRect(); // Get bounding rectangle of the target element
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

  // Event handler for mouse move
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

  // Event handler for mouse up
  const handleMouseUp = () => {
    if (!isLocked) {
      setDragging(false);
    }
  };

  // Add and remove event listeners on mount and unmount
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, isLocked, dragSpeedMultiplier, dragStart]);

  // Inline style for zoom and pan
  const containerStyle = {
    transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
    transformOrigin: "0 0",
    transition: "transform 0.1s",
  };
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu from appearing
  };

  return (
    <div className="flex w-full h-full bg-black">
      <div className="w-56 h-full bg-red-500">
        {/* Bottom panel */}
        <div
          className="w-60 bg-white drop-shadow-md

shadow-gray-300  rounded-lg   pt-16 fixed inset-y-0 left-0 z-10 flex flex-col"
        >
          <div className="flex flex-col gap-5 items-center px-3">
            <input
              className="border border-gray-500 w-10/12 h-9 px-3 rounded-lg"
              placeholder="Enter picture URL"
              value={newPictureUrl}
              onChange={handleInputChange}
            />
            <button
              onClick={handleAddPicture}
              className="bg-primary  flex   justify-center	content-center	 items-center	 gap-4
               text-white font-bold w-10/12 h-11 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <svg
                width="20px"
                height="20px"
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
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
                    fill="#ffffff"
                  ></path>{" "}
                </g>
              </svg>
              Add Picture
            </button>
          </div>
          <div className="w-full flex flex-col gap-5 p-6 overflow-y-auto  mt-4">
            {PictureList.map((picture) => (
              <Picture key={picture.id} url={picture.url} id={picture.id} />
            ))}
          </div>
        </div>
      </div>
      <div className="w-96  h-full ">
        <div className=" w-full h-screen  overflow-hidden	fixed  z-0    ">
          <div
            style={{
              cursor: dragging ? "auto" : "grab",
            }}
            className=" w-full h-full grid justify-center  	 content-center "
          >
            <div
              style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                zIndex: 1000,
              }}
            >
              <div className="flex space-x-2">
                <button
                  onClick={zoomIn}
                  className="bg-primary text-white font-bold py-2 px-4 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Zoom In
                </button>
                <button
                  onClick={zoomOut}
                  className="bg-primary  text-white font-bold py-2 px-4 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Zoom Out
                </button>
                <button
                  onClick={resetZoom}
                  className="bg-primary  text-white font-bold py-2 px-4 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  Reset Zoom
                </button>
                <button
                  onClick={() => setIsLocked((prev) => !prev)}
                  className={`bg-${
                    isLocked ? "red" : "primary "
                  }-500 text-white px-4 py-2 rounded-lg m-1`}
                >
                  {isLocked ? "Unlock" : "Lock"}
                </button>
              </div>
            </div>
            <div
              onContextMenu={handleContextMenu}
              onMouseDown={handleMouseDown}
              style={{
                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                transformOrigin: "center",
                backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
                backgroundSize: "20px 20px",
                backgroundColor: "#f5f5f5", // Optional: Background color to set base color of the grid
              }}
              className="w-[50000px] h-[50000px]  z-1  grid  justify-center  content-center	"
              ref={drop}
            >
              {board.map((draggable, index) => {
                return (
                  <Drib
                    key={`board-${draggable.id}-${index}`}
                    url={draggable.url}
                    id={draggable.id}
                    removeItem={removeItem}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DragDrop;
