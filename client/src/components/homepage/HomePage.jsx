import "./homepage.css";
import logo from "../../assets/logo.png";
import Image1 from "../../assets/image 1.png";
import greaterThan from "../../assets/greater_than.png";
import lessThan from "../../assets/less_than.png";

const HomePage = () => {
	return (
		<div className="home">
			<div className="info">
				<div className="logo">
					<img src={logo} alt="logo" />
				</div>
				<div className="input">
					<input type="text" placeholder="Enter your Name" />
					<div className="pic">
						<img src={lessThan} alt="less than" height={120} />
						<img src={Image1} alt="Image 1" height={130} />
						<img src={greaterThan} alt="greater than" height={120} />
					</div>
				</div>
				<div className="play">
					<button>Play</button>
				</div>
			</div>
		</div>
	);
};
export default HomePage;
