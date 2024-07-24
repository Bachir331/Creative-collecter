import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./compo/DragDrop";
import React, { useState } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");

  // Function to handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="w-full flex flex-col h-screen">
          {/* Nav-bar section */}

          <DragDrop />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
