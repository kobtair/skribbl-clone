import { createContext, useState, useRef } from "react";

export const CanvasContext = createContext({
  currentColor: "",
  setCurrentColor: () => {},
  ctxRef: null,
  brushSize: 5,
  setBrushSize: () => {},
  startDrawing: () => {},
  isDrawing: false,
  setIsDrawing: () => {},
  draw: () => {},
  finishDrawing: () => {},
});

export const CanvasContextProvider = ({ children }) => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const ctxRef = useRef(null);
  const startDrawing = (offsetX, offsetY) => {
    setIsDrawing(true);
    console.log("setIsDrawing by startDrawing"+ setIsDrawing);
    ctxRef.current.strokeStyle = currentColor;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };
  const draw = (offsetX, offsetY) => {
    if (!isDrawing) {
      return null;
    }
    else{
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
    }
  };
  const finishDrawing = () => {
    setIsDrawing(false);
    console.log("setIsDrawing by finishDrawing"+ setIsDrawing);
    ctxRef.current.closePath();
  };
  const value = {
    currentColor,
    setCurrentColor,
    ctxRef,
    brushSize,
    setBrushSize,
    startDrawing,
    isDrawing,
    setIsDrawing,
    draw,
    finishDrawing,
  };
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};