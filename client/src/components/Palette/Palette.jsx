import "./palette.style.scss";
import colors from "../../data/colors";
import { useContext } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { GameContext } from "../../contexts/GameContext";

export default function Palette() {
  const { setCurrentColor, currentColor, clearCanvas } = useContext(CanvasContext);
  const { socket } = useContext(GameContext);
  const {isAllowedToDraw} = useContext(GameContext);
  const handleClear = ()=>{
    clearCanvas();
    socket.emit("clear_canvas");
  }
  return (
    <div className={`palette-container ${isAllowedToDraw?"":"hidden"}`}>
      <div style={{backgroundColor: currentColor}} className="selected-color"></div>
      <div className="colors">
        {colors.map((color) => (
          <div
            className="color"
            key={color.id}
            data={color.value}
            onClick={()=>setCurrentColor(color.value)}
            style={{backgroundColor: color.value }}
          >
            &zwnj;
          </div>
        ))}
      </div>
      <button onClick={handleClear}>Clear Canvas</button>
    </div>
  );
}
