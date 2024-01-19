import "./palette.style.scss";
import colors from "../../data/colors";
import { useContext, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { GameContext } from "../../contexts/GameContext";

export default function Palette() {
  const { setCurrentColor, currentColor, clearCanvas, setBrushSize } =
    useContext(CanvasContext);
  const { socket } = useContext(GameContext);
  const { isAllowedToDraw } = useContext(GameContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleClear = () => {
    clearCanvas();
    socket.emit("clear_canvas");
  };
  return (
    <div className={`palette-container ${isAllowedToDraw ? "" : "hidden"}`}>
      <div
        style={{ backgroundColor: currentColor }}
        className="selected-color"
      ></div>
      <div className="colors">
        {colors.map((color) => (
          <div
            className="color"
            key={color.id}
            data={color.value}
            onClick={() => setCurrentColor(color.value)}
            style={{ backgroundColor: color.value }}
          >
            &zwnj;
          </div>
        ))}
      </div>
      <button className="clear" onClick={handleClear}>
        Clear Canvas
      </button>
      <div className="brush-selector">
        <button className="brush" onClick={toggleMenu}>
          Select Brush Size
        </button>
        {isMenuOpen && (
          <div className="menu">
            <div
              onClick={() => {
                setIsMenuOpen(false);
                setBrushSize(5);
              }}
            >
              Small (5px)
            </div>
            <div
              onClick={() => {
                setIsMenuOpen(false);
                setBrushSize(10);
              }}
            >
              Medium (10px)
            </div>
            <div
              onClick={() => {
                setIsMenuOpen(false);
                setBrushSize(15);
              }}
            >
              Large (15px)
            </div>
            {/* Add more sizes as needed */}
          </div>
        )}
      </div>
    </div>
  );
}
