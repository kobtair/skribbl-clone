import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { CanvasContextProvider } from "./contexts/CanvasContext";
import { GameContextProvider } from "./contexts/GameContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <GameContextProvider>
    <CanvasContextProvider>
      <App />
    </CanvasContextProvider>
  </GameContextProvider>
</React.StrictMode>
)
