import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import { ColorRing } from "react-loader-spinner";
import DashService from "../axios/services/api/dashboard";
import {setDashboard} from "../redux/actions/dashboardAction";
import { userType } from "../constants/constants";
import { setUserType } from "../redux/actions/authActions";
//import BrandBar from "../pages/BrandBar";
import Brand from "../pages/Brand";
import BuildMenus from "../components/DashBoard/BuildMenus";
import HomeTiles from "./HomeTiles";
import Footer from "../components/Footer";


const Dashboard = () => {

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

    const [menus,setMenus] =useState(false);
    
    const userProfile = useSelector((state) => state.userProfile);



    const dispatch = useDispatch();
    

    const getDashboard = async () => {
        setLoading(true);


        await DashService.getDashboardDetails(userProfile).then((response) => {

				dispatch(setDashboard(response.data.data));
                setMenus(true);
				setLoading(false);
			//}
        });
    };

    useEffect(() => {

		if (userProfile.usertype !== "null") {
            console.log(userProfile.usertype);
			window.scrollTo({ top: 0, behavior: "smooth" });
			getDashboard();

		} else {
			navigate("/home");
		}
	},[]);

    return (
        <>
        <div id="wrapper">
	    </div>        

    {!menus? "Creating Menus" : <><Brand/> <BuildMenus/></> }
    
    <Footer/>

    </>
    );

};

export default Dashboard;