import "./canvas.styles.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { CanvasContext } from "../../contexts/CanvasContext";

export default function Canvas() {
  const {ctxRef, currentColor} = useContext(CanvasContext)
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false)
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 5;
    ctxRef.current = ctx;
  }, []);

  const startDrawing = ({nativeEvent}) => {
    const {offsetX, offsetY} = nativeEvent;
    ctxRef.current.strokeStyle = currentColor;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true);
  };
  const finishDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();

  };
  const draw = ({nativeEvent}) => {
    if(!isDrawing){
        return
    }
    const {offsetX, offsetY} = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseMove={draw}
        onMouseUp={finishDrawing}
        onMouseDown={startDrawing}
      ></canvas>
    </div>
  );
}
