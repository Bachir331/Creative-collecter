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
        <div className="w-full flex flex-col h-screen  select-none">
          <div
            className="w-full h-14 bg-primary drop-shadow-md  p-6 flex items-center z-40"
            id="Navbar-bg"
          >
            <div id="Nav-content">
              <h1 className="text-white font-bold font-sans ml-11 text-base select-none sticky">
                Creative Collector
              </h1>
            </div>
            <div className="w-8/12 h-full flex items-center p-5">
              <div className="w-full h-10">
                <div className="w-full flex justify-evenly items-center"></div>
              </div>
            </div>
          </div>
          <DragDrop />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
