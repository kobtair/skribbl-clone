import "./canvas.styles.scss";
import { useContext, useEffect, useRef } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { GameContext } from "../../contexts/GameContext";
import pencil from "../../assets/pencil.png"

export default function Canvas() {
  const {
    ctxRef,
    finishDrawing,
    isDrawing,
    startDrawing,
    draw,
  } = useContext(CanvasContext);
  const { socket, isAllowedToDraw } = useContext(GameContext);
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 0.6;
    canvas.width = window.innerWidth * 0.489;
    const ctx = canvas.getContext("2d");
    // ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  const handleMouseEnter = ()=>{
    if(isAllowedToDraw){
      canvasRef.current.style.cursor = `url(${pencil}), auto`
    }
  }
  const handleMouseDown = ({ nativeEvent }) => {
    if (!isAllowedToDraw) return;
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("start_drawing", { offsetX, offsetY });
    startDrawing(offsetX, offsetY);
  };
  const handleMouseUp = () => {
    if (!isAllowedToDraw) return;
    socket.emit("finish_drawing");
    finishDrawing();
  };
  const handleMouseMove = ({ nativeEvent }) => {
    if (!isAllowedToDraw) return;
    const { offsetX, offsetY } = nativeEvent;
    if (isDrawing) {
      socket.emit("draw", { offsetX, offsetY });
      draw(offsetX, offsetY);
    }
    else{
      return;
    }
  };
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      >
      </canvas>
    </div>
  );
}
