import "./canvas.styles.scss";
import { useContext, useEffect, useRef } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";
import { GameContext } from "../../contexts/GameContext";


export default function Canvas() {
  const {
    ctxRef,
    finishDrawing,
    isDrawing,
    startDrawing,
    draw,
    brushSize,
    currentColor,
    canvasRef,
    prevCoordianates,
    setPrevCoordinates
  } = useContext(CanvasContext);
  const { socket, isAllowedToDraw } = useContext(GameContext);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);
  useEffect(()=>{
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 0.6;
    canvas.width = window.innerWidth * 0.5;
  },[window.innerWidth])

  const handleMouseEnter = ()=>{
    if(isAllowedToDraw){
      canvasRef.current.style.cursor = "url(./assets/pencil.png)"
    }
  }
  const handleMouseDown = ({ nativeEvent }) => {
    if (!isAllowedToDraw) return;
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("start_drawing", { offsetX, offsetY, color: currentColor, size: brushSize });
    startDrawing(offsetX, offsetY);
  };
  const handleMouseUp = () => {
    if (!isAllowedToDraw) return;
    setPrevCoordinates({offsetX: 0, offsetY: 0});
    socket.emit("finish_drawing");
    finishDrawing();
  };
  const handleMouseMove = ({ nativeEvent }) => {
    if (!isAllowedToDraw) return;
    const { offsetX, offsetY } = nativeEvent;
    if (isDrawing && (Math.abs(offsetX -prevCoordianates.offsetX)>brushSize+5 || Math.abs(offsetY - prevCoordianates.offsetY)>brushSize+5)) {
      socket.emit("draw", { offsetX, offsetY });
      draw(offsetX, offsetY);
      setPrevCoordinates({offsetX, offsetY});
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
