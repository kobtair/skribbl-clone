import "./canvas.styles.scss";
import { useContext, useEffect, useRef } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { GameContext } from "../../contexts/GameContext";

export default function Canvas() {
  const { ctxRef, currentColor, brushSize, finishDrawing, startDrawing, draw, } = useContext(CanvasContext);
  const {socket} = useContext(GameContext);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 0.6;
    canvas.width = window.innerWidth * 0.489;
    const ctx = canvas.getContext("2d");
    // ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;
  }, []);

  const handleMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("start_drawing", {offsetX, offsetY});
    startDrawing(offsetX, offsetY);
  };
  const handleMouseUp = () => {
    socket.emit("finish_drawing");
    finishDrawing();
  };
  const handleMouseMove = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("draw", {offsetX, offsetY});
    draw(offsetX, offsetY);
  };
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
      ></canvas>
    </div>
  );
}
