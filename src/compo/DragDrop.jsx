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

  // Function to add an image to board
  const addImageToBoard = (id) => {
    // Find the picture with the given id from PictureList
    const pictureToAdd = PictureList.find((picture) => picture.id === id);

    if (!pictureToAdd) {
      alert("Error: Image not found");
      console.log(PictureList)
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

    setPictureList([...PictureList, newPicture]); // Add new picture to PictureList

    setNewPictureUrl(""); // Clear input after adding picture
  };

  useEffect(() => {
    console.log("PictureList changed:", PictureList);
  }, [PictureList]);

  // Log PictureList and board whenever PictureList changes

   const [zoomLevel, setZoomLevel] = useState(1);
   const [dragging, setDragging] = useState(false);
   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
   const [dragSpeedMultiplier, setDragSpeedMultiplier] = useState(0.5);
   const [isLocked, setIsLocked] = useState(false);

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

   const handleMouseUp = () => {
     if (!isLocked) {
       setDragging(false);
     }
   };

   const handleWheel = (e) => {
     if (!isLocked) {
       const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
       setZoomLevel((prevZoom) =>
         Math.min(Math.max(prevZoom + zoomDelta, 0.5), 3)
       );
     }
   };

   const handleReset = () => {
     setZoomLevel(1);
     setDragOffset({ x: 0, y: 0 });
   };

   const toggleLock = () => {
     setIsLocked((prevLocked) => !prevLocked);
   };

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

   const containerStyle = {
     transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
     transformOrigin: "0 0",
     transition: "transform 0.1s",
   };

  const [image, setImage] = useState(null);

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
    <div className="flex w-full h-full bg-black">
      <div className="w-56 h-full bg-red-500">
        {/* Bottom panel */}
        <div
          className="w-60 bg-white  flex drop-shadow-md

shadow-gray-300  rounded-lg   pt-16 fixed inset-y-0 left-0 z-10 flex flex-col"
        >
          <div className="flex flex-col gap-5 items-center px-3">
            <input
              className="border border-gray-500 w-full  h-9 px-3"
              placeholder="Enter picture URL"
              value={newPictureUrl}
              onChange={handleInputChange}
            />
            <div className=" w-full  flex  gap-4">
              <button
                onClick={handleAddPicture}
                className="bg-primary  flex   justify-center	content-center	 items-center	 p-1 gap-1
               text-white font-bold h-11 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-third  text-[11px]	 "
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
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
                      fill="#ffffff"
                    ></path>{" "}
                  </g>
                </svg>
                Add Picture
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-primary  flex   justify-center	content-center	 items-center	 p-1
               text-white font-bold  h-11 rounded hover:bg-third focus:outline-none focus:ring-2 focus:ring-third text-[11px]			"
              >
                <svg
                  width="24px"
                  height="24px"
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
                      d="M12 15.75C12.4142 15.75 12.75 15.4142 12.75 15V4.02744L14.4306 5.98809C14.7001 6.30259 15.1736 6.33901 15.4881 6.06944C15.8026 5.79988 15.839 5.3264 15.5694 5.01191L12.5694 1.51191C12.427 1.34567 12.2189 1.25 12 1.25C11.7811 1.25 11.573 1.34567 11.4306 1.51191L8.43056 5.01191C8.16099 5.3264 8.19741 5.79988 8.51191 6.06944C8.8264 6.33901 9.29988 6.30259 9.56944 5.98809L11.25 4.02744L11.25 15C11.25 15.4142 11.5858 15.75 12 15.75Z"
                      fill="#ffffff"
                    ></path>{" "}
                    <path
                      d="M16 9C15.2978 9 14.9467 9 14.6945 9.16851C14.5853 9.24148 14.4915 9.33525 14.4186 9.44446C14.25 9.69667 14.25 10.0478 14.25 10.75L14.25 15C14.25 16.2426 13.2427 17.25 12 17.25C10.7574 17.25 9.75004 16.2426 9.75004 15L9.75004 10.75C9.75004 10.0478 9.75004 9.69664 9.58149 9.4444C9.50854 9.33523 9.41481 9.2415 9.30564 9.16855C9.05341 9 8.70227 9 8 9C5.17157 9 3.75736 9 2.87868 9.87868C2 10.7574 2 12.1714 2 14.9998V15.9998C2 18.8282 2 20.2424 2.87868 21.1211C3.75736 21.9998 5.17157 21.9998 8 21.9998H16C18.8284 21.9998 20.2426 21.9998 21.1213 21.1211C22 20.2424 22 18.8282 22 15.9998V14.9998C22 12.1714 22 10.7574 21.1213 9.87868C20.2426 9 18.8284 9 16 9Z"
                      fill="#ffffff"
                    ></path>{" "}
                  </g>
                </svg>
                Upload Image
              </button>
            </div>
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
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu
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
              <div className="flex  bg-black ">
                <button
                  onClick={handleReset}
                  className="w-20 bg-secondary  text-white "
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsLocked((prev) => !prev)}
                  className={`${
                    isLocked ? "bg-third" : "bg-primary "
                  } text-white px-4 py-2  `}
                >
                  {isLocked ? "Unlock" : "Lock"}
                </button>
              </div>
            </div>
            <div
              onContextMenu={(e) => e.preventDefault()}
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
              className="w-[50000px] h-[50000px]  z-1  grid    justify-center  content-center	"
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
