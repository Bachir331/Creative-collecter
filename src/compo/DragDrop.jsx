import React, { useEffect, useState } from "react";
import Picture from "./Picture";
import Drib from "./drib";
import { useDrop } from "react-dnd";
import Draggable from "react-draggable";
import "../App.css";

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
      return;
    }

    // Add the picture to the board
    board.push(pictureToAdd);
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
      setBoard(filteredBoard);
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

    setNewPictureUrl(""); // Clear input after adding picture

    // console.log("PictureList updated:", PictureList);
    // console.log("Added new picture:", newPicture);
    // console.log("Current board:", board);
  };

  // Log PictureList and board whenever PictureList changes
  const containerStyle = {
    border: "1px dashed gray",
    padding: "10px",
    overflow: "scroll",
  };

  return (
    <>
      <div>
        <h1>Picture List App</h1>
        <div>
          <input
            type="text"
            placeholder="Enter picture URL"
            value={newPictureUrl}
            onChange={handleInputChange}
          />
          <button onClick={handleAddPicture}>Add Picture</button>
        </div>
      </div>
      <div className="Pictures w-full  h-44  ">
        <div className="w-20  flex  h-20 bg-black">
          {PictureList.map((picture, index) => (
            <Picture
              key={`picture-${picture.id}-${index}`}
              url={picture.url}
              id={picture.id}
            />
          ))}
        </div>
      </div>

      <div
        className="Board w-full h-full  Grid    "
        style={containerStyle}
        ref={drop}
      >
        <div>
          {board.map((draggable, index) => {
            return (
              <Drib
                key={`board-${draggable.id}-${index}`}
                url={draggable.url}
                id={draggable.id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default DragDrop;
