import "./palette.style.scss";
import colors from "../../data/colors";
import { useContext } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";

export default function Palette() {
  const { setCurrentColor, currentColor, ctxRef } = useContext(CanvasContext);
  const clearCanvas = ()=>{
    ctxRef.current.clearRect(0,0,window.innerWidth, window.innerHeight)
  }

  return (
    <div className="palette-container">
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
      <button onClick={clearCanvas}>Clear Canvas</button>
    </div>
  );
}