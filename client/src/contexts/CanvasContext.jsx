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
  clearCanvas: () => {},
  canvasRef: null,
  resizeCanvas: () => {},
  prevCoordianates: {},
  setPrevCoordinates: () => {},
});

export const CanvasContextProvider = ({ children }) => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const ctxRef = useRef(null);
  const canvasRef = useRef(null);
  const [prevCoordianates, setPrevCoordinates] = useState({
    offsetX: 0,
    offsetY: 0,
  });
  const startDrawing = (
    offsetX,
    offsetY,
    color = currentColor,
    size = brushSize
  ) => {
    setIsDrawing(true);
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = size;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
  };
  const draw = (offsetX, offsetY) => {
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  const finishDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };
  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };
  const resizeCanvas = (width, height) => {
    canvasRef.current.width = width * 0.5;
    canvasRef.current.height = height * 0.6;
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
    clearCanvas,
    canvasRef,
    resizeCanvas,
    setPrevCoordinates,
    prevCoordianates,
  };
  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
