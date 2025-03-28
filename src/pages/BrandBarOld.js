import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import "../custom_css/brandBar.css";


const BrandBar = () => {

      

    return (
        <>
            <div>

                   <div className="brand-bar">
      
                            <div className='logo-div'><img src={require('../icons/logo.png')} alt="home" className="logo"/></div>
                            <div className='co-name'>Ceres Foods Private Ltd</div>
                            <div className={'opti-chain poppins-bold-italic'}>OPTI CHAIN</div>
                            <div className='log-in-user'>LoggedInUser</div>
                            <div className='log-in-user-icon'><img src={require('../icons/img_avatar.png')} className='avatar-icon' />
                            <div className="dropdown">
                            <i className="fa fa-caret-down"/>
                            <div className="dropdown-content">
                                <a href="#">Link 1</a>
                                <a href="#">Link 2</a>
                                <a href="#">Link 3</a>
                            </div>
                            </div>



                            </div>
                            
                            

                         
                    </div>
                    
 


            </div>



        </>

    );
}

export default BrandBar;

