import React,{ useState,useEffect} from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {setDashboard} from "../../redux/actions/dashboardAction";
import "../../custom_css/menu.css";


const BuildMenus = () => {

  const navigate = useNavigate();

  const [showSubMenu, setShowSubMenu] = useState([]);

  const navLinksData = useSelector((state) => state.dashboard.dashboard.menu_details);

  const variants = {
    open: { opacity: 1, x: 5 },
    closed: { opacity: 0, x: "-100%" },
  };

  const subMenuOnMouseEnterHandler = (subMenuId) => {
    setShowSubMenu((prev) => {

      let arr = [...prev];
      arr[subMenuId] = true;
      
      return arr;
    });
  };

  const subMenuOnMouseLeaveHandler = (subMenuId) => {
  
    setShowSubMenu((prev) => {

      let arr = [...prev];
      arr[subMenuId] = false;
      return arr;
    });
  };

  const MenuHandler = async (menu_href,id) => {
    navigate(menu_href);
    subMenuOnMouseLeaveHandler(id);
    setShowSubMenu([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menus if clicking outside of the main menu
      if (!event.target.closest('.main-nav')) {
        setShowSubMenu([]);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  

  return (
      <ul className='main-nav' >
        {navLinksData.map((el, i) => {
          if (!el.sub_menu) {
            return (
              <li key={el.id} >
                <a href='#' className='header-nav-link' >
                  <span>{el.menu_display_name}</span>
                </a>
              </li>
            );
          }

          return (
            <li
              onMouseEnter={(event) => subMenuOnMouseEnterHandler(el.id)}
              onMouseLeave={(event) => subMenuOnMouseLeaveHandler(el.id)}
              key={el.id}
              className='header-nav-options options-hover' 
              
            >
              <div className='header-nav-div' style={{width:"120px",padding:"none"}}>
                <span >{el.menu_display_name}</span>
              </div>
              <motion.ul
                variants={variants}
                animate={showSubMenu[el.id] ? "open" : "closed"}
                className='header-nav-ul'
                style={{ listStyleType: "none",paddingLeft:"0px" }}
                
              >
                {showSubMenu[el.id] &&
                  el.sub_menu.map((ele) => {
                    if (!ele.sub_menu) {
                      return (
                        <li key={ele.id} className='sub-menu-li'>
                          <a
                            href='#'
                            className='sub-menu-link'
                            //style={{ textDecoration: "none"}}
                          >
                            <span 
                              onClick={() => MenuHandler(
                                ele.menu_href,ele.id
                                
                              )}
                            >{ele.menu_display_name }</span>
                          </a>
                        </li>
                      );
                    }

                    return (
                      <li
                        onMouseEnter={() => subMenuOnMouseEnterHandler(ele.id)}
                        onMouseLeave={() => subMenuOnMouseLeaveHandler(ele.id)}
                        key={ele.id}
                        className='sub-menu-options sub-menu-hover'
                      >
                        <div className='sub-menu-div'>
                          <span >{ele.menu_display_name}</span>
                          <span className='arrow'>{"-->"}</span>
                        </div>
                        <motion.ul
                          variants={variants}
                          animate={showSubMenu[ele.id] ? "open" : "closed"}
                          className='sub-menu-ul'
                        >
                          {showSubMenu[ele.id] &&
                            ele.sub_menu.map((elem) => {
                              return (
                                <li key={elem.id} className='grand-child-link'>
                                  <a href='#'>
                                    <span>{elem.menu_display_name}</span>
                                  </a>
                                </li>
                              );
                            })}
                        </motion.ul>
                      </li>
                    );
                  })}
              </motion.ul>
            </li>
          );
        })}
      </ul>

  );
};

export default BuildMenus;