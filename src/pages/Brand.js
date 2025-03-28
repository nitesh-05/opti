import React from "react";
import "../custom_css/brand.css";
import BuildMenus from "../components/DashBoard/BuildMenus";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../redux/actions/authActions";
import Swal from "sweetalert2";


const Brand = () => {

    const navigate = useNavigate();
	const dispatch = useDispatch();

    
    console.log('logged in user',localStorage.getItem('username'));

    const handleLogout = () => {
        Swal.fire("Do you want to log out");
        Swal.fire({
            title: 'LogOut Confirmation?',
            text: 'Do you really want to Sign Out',
            showDenyButton: true,
            confirmButtonText: 'Confirm',
            denyButtonText: 'Cancel',
            customClass: {
              actions: 'my-actions',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            },
          }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeUser());
                navigate("/");
            } 
          })

    };

    return (
        <>
            {/* Brand Bar */}
            <div class="brand-bar">
                <div class="brand-logo">
                    {/* <img src="logo.png" alt="Brand Logo" class="logo-image" />  */}
                    <img src={require('../icons/logo.png')} alt="home" className="logo" />
                    {/* <span>Ceres Foods Private Ltd</span> */}
                </div>
                <div class="brand-info">OPTI CHAIN</div>
                <div class="user-dropdown">
                    <button class="dropdown-btn">{localStorage.getItem('username')} <span>&#x25BC;</span></button>
                    <ul class="dropdown-menu">
                        <li><a href="#">Profile</a></li>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#" onClick={handleLogout}>Log Out</a></li>
                    </ul>
                </div>
            </div>

{/*             
            <nav class="menu-bar">
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </nav>

            <div class="content">
                <h1>Welcome to My Website</h1>
                <p>This is the main content area.</p>
            </div> */}
        </>

    );
}

export default Brand;

