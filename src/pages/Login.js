import React, { useEffect, useLayoutEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../axios/services/api/auth"
import {
	setToken,
	setUserType,
	setUser,
} from "../redux/actions/authActions";
import { userType } from "../constants/constants";
import Loader from "../components/Loader";
import "../custom_css/login.css";
import Swal from "sweetalert2";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { CircularProgress } from '@mui/material';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [homeLoading, setHomeLoading] = useState(false);

	const userProfile = useSelector((state) => state.userProfile);
	const { usertype } = userProfile;

	const [bgImage, setBGImg] = useState();
	const [logo, setLogo] = useState();

	const [showPassword, setShowPassword] = useState(false);

	const [selectedServer, setSelectedServer] = useState("");
	const [serverOptions, setServerOptions] = useState([
		{ value: "lp", label: "Modern Trade" },
		{ value: "ECOM", label: "E-Com" },
		{ value: "QCOM", label: "Q-Com" },
		{ value: "CSD", label: "CSD" }
	]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const loginDetails = async () => {
		try {
			await AuthService.getLoginDetails().then((response) => {
				setLoading(false);
				setLogo(response.data.data.login_page_details.logo_path);
				setBGImg(response.data.data.login_page_details.bg_image_path);

			});
		}catch (error) {
			if (!error.response) {
				Swal.fire({
					title: "OOPS! Network Error",
					text: "Failed to contact API server. Please check your internet connection or API Service is ON or not.",
					icon: "error",
					confirmButtonText: "Reload Page...",
				}).then(() => {
					window.location.reload(); // Reload the page after user clicks OK
				});
				
			} else {
				const errorMessage = error.response?.data?.message || "Failed to authenticate user.";
				Swal.fire("Login Failed", errorMessage, "error");
			}


		}
	};

	const authUser = async (data) => {
		setHomeLoading(true);
		try {
			const response = await AuthService.addUser(data);
			dispatch(setToken(response.data.token));
			try {
				const resp = await AuthService.getUserType(response.data.token);
				localStorage.setItem("username", data.username);
				localStorage.setItem("password", data.password);
				localStorage.setItem("serverSchema", data.selectedServer);

				dispatch(setUserType(resp.data.data.userType));
			} catch (error) {
				console.error("Failed to fetch user type", error);
			}
		} catch (error) {
			//Swal.fire("Failed to authenticate user",error.data.message);


		} finally {
			setLoading(false);
			setHomeLoading(false);
		}
	};

	const submitForm = (event) => {
		event.preventDefault();

		
		let username = event.target[1].value;
		let password = event.target[2].value;
		


		if (!selectedServer) {
			Swal.fire("Error", "Please select a server instance.", "error");
			return;
		}

		let userType = "ADMIN";
		authUser({ username, password, selectedServer });

		// dispatch(setUser({ id, password, userType }));
	};

	useEffect(() => {
		loginDetails();
	}, []);

	const KeyDownHandler = (event) => {
		if (event.keyCode === 13) {

			submitForm(event);
		}
	};

	useLayoutEffect(() => {
		const loginStyle = {
			backgroundImage: "url('https://brdpictures.com/wp-content/uploads/2023/04/130713702_412013009985561_8656439076953784836_n-01.jpeg')"
			// backgroundRepeat:"no-repeat",
			// backgroundSize:"cover",
			// backgroundColor:"#eeeeee !important",
		};

		//document.body.classList.add(loginStyle);
		document.body.classList.remove(
			"fixed-nav",
			"sticky-footer",
			"sidenav-toggled"
		);


	}, []);

	// useEffect(() => {
	// 	usertype && usertype.toUpperCase() === userType.ADMIN
	// 		? navigate("/home")
	// 		: usertype && usertype.toUpperCase() === userType.SALESOFFICER
	// 			? navigate("/home")
	// 			: usertype && usertype.toUpperCase() === userType.DISTRIBUTOR
	// 				? navigate("/home")
	// 				: usertype && usertype.toUpperCase() === userType.BM
	// 					? navigate("/home")
	// 					: usertype && usertype.toUpperCase() === userType.HO
	// 						? navigate("/home")
	// 						: console.log("");


	// }, [userProfile]);

	useEffect(() => {
		const navigateTo = {
			ADMIN: "/home",
			SALESOFFICER: "/home",
			DISTRIBUTOR: "/home",
			BM: "/home",
			HO: "/home",
		};
		const type = usertype?.toUpperCase();
		if (navigateTo[type]) navigate(navigateTo[type]);
	}, [userProfile]);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	  };

	  const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div>
			<section id="login-wrapper">
				<div className="login-box">
					<div className="white-box">
						<div className="form-horizontal form-material" id="loginform">
							<a className="text-center db">
								<img src={require('../icons/logo.png')} alt="home" />
							</a>
							<a
								style={{
									color: "rgb(4, 2, 26)",
									fontFamily: "Arial",
									fontSize: "12px",
									fontWeight: "normal"
								}}
								className="text-center db"
							>
								OPTI CHAIN
							</a>
							<form onSubmit={submitForm}>
								<div className="form-group server-instance-container">
									<div className="col-xs-12">
										<select
											className="form-control"
											value={selectedServer}
											onChange={(e) => setSelectedServer(e.target.value)}
											required
										>
											<option value="" disabled>
												Select Server Instance
											</option>
											{serverOptions.map((server) => (
												<option key={server.value} value={server.value}>
													{server.label}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="form-group m-t-40">
									<div className="col-xs-12">
										<input
											className="form-control"
											type="text"
											required
											id="user_name"
											placeholder="Username"
										/>
									</div>
								</div>
								<div className="form-group">
									<div className="col-xs-12" style={{ position: "relative" }}>
										<input
											type={showPassword ? "text" : "password"}
											id="password"
											placeholder="Password"
											required
											className="form-control"
											style={{ paddingRight: "2.5rem" }}
										/>
										<button
											type="button"
											onClick={togglePasswordVisibility}
											style={{
												position: "absolute",
												right: "0.5rem",
												top: "50%",
												transform: "translateY(-50%)",
												border: "none",
												background: "none",
												cursor: "pointer",
												fontSize: "1.2rem",
												color: "#888",
											}}
											aria-label={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? "👁️" : "🙈"}
										</button>
									</div>
								</div>
								<div className="form-group text-center m-t-20">
									<div className="col-xs-12">
										<button
											className="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light"
											onKeyDown={KeyDownHandler}
											disabled={homeLoading}
										>
											
											{homeLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
										</button>
									</div>
								</div>
							</form>
							<div className="forgot-password">
								<a href="#" onClick={handleOpenModal} className="text-info">
									Forgot Password?
								</a>
							</div>
						</div>
						<footer className="footer text-center">
							<p>
								Powered by
								<img
									src={require('../icons/opti-chain-logo.png')}
									alt="home"
									style={{ height: "40px" }}
								/>
							</p>
							<p>(c) Square Box Technologies</p>
						</footer>
					</div>
				</div>
			</section>
			<ForgotPasswordModal open={isModalOpen} handleClose={handleCloseModal} />
		</div>
	);

};

export default Login;

