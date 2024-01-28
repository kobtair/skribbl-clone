import "./homepage.scss";
import logo from "../../assets/logo.png";
import greaterThan from "../../assets/greater_than.png";
import lessThan from "../../assets/less_than.png";
import {
  hairStyles,
  clothingStyles,
  eyesStyles,
  mouthStyles,
} from "../../data/avatar";
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../../contexts/GameContext";

const HomePage = () => {
  const { setUsername, username, setAvatar, setIsLoggedIn, setPlayersList, socket } = useContext(GameContext);
  useEffect(() => {
    socket.on("game_joined", () =>{
      setIsLoggedIn(true);
      socket.emit("game_joined")
    })
  },[])
  const [topType, setTopType] = useState(10);
  const [clotheType, setClotheType] = useState(0);
  const [eyeType, setEyeType] = useState(2);
  const [mouthType, setMouthType] = useState(0);
  const types = ["top", "eye", "mouth", "clothe"];
  const login = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      const avatar = {
        top: hairStyles[topType],
        eye: eyesStyles[eyeType],
        mouth: mouthStyles[mouthType],
        clothe: clothingStyles[clotheType],
      }
      setAvatar(avatar);
      socket.emit("join_game", { username, avatar})
    }
  };
  const decrementStyle = (type) => {
    if (type === types[0]) {
      setTopType((topType - 1 + hairStyles.length) % hairStyles.length);
    }
    if (type === types[1]) {
      setEyeType((eyeType - 1 + eyesStyles.length) % eyesStyles.length);
    }
    if (type === types[2]) {
      setMouthType((mouthType - 1 + mouthStyles.length) % mouthStyles.length);
    }
    if (type === types[3]) {
      setClotheType(
        (clotheType - 1 + clothingStyles.length) % clothingStyles.length
      );
    }
  };
  const incrementStyle = (type) => {
    if (type === types[0]) {
      setTopType((topType % hairStyles.length) + 1);
    }
    if (type === types[1]) {
      setEyeType((eyeType % eyesStyles.length) + 1);
    }
    if (type === types[2]) {
      setMouthType((mouthType % mouthStyles.length) + 1);
    }
    if (type === types[3]) {
      setClotheType((clotheType % clothingStyles.length) + 1);
    }
  };

  return (
    <div className="home">
      <form onSubmit={login} className="info">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="input">
          <input
            autoComplete="false"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            placeholder="Enter your Name"
          />
        </div>
        <div className="pic">
          <div className="less-than">
            {types.map((type, index) => (
              <button type="button" key={index} onClick={() => decrementStyle(type)}>
                <img key={index} src={lessThan} alt="less than" />
              </button>
            ))}
          </div>
          <img
            style={{ height: "100%" }}
            alt="avatar"
            src={`https://avataaars.io/?topType=${hairStyles[topType]}&clotheType=${clothingStyles[clotheType]}&clotheColor=Black&eyeType=${eyesStyles[eyeType]}&mouthType=${mouthStyles[mouthType]}`}
          />
          <div className="greater-than">
            {types.map((type, index) => (
              <button
                type="button"
                key={index}
                onClick={() => {
                  incrementStyle(type);
                }}
              >
                <img key={index} src={greaterThan} alt="greater than" />
              </button>
            ))}
          </div>
        </div>
        <div className="play">
          <button>Play</button>
        </div>
      </form>
    </div>
  );
};
export default HomePage;
