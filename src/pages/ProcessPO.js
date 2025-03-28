import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userType } from "../constants/constants";
import Swal from "sweetalert2";
import BuildMenus from "../components/DashBoard/BuildMenus";
import { FileUploader } from "react-drag-drop-files";
import ProcessPOService from "../axios/services/api/processPO";
import Loader from "../components/Loader";

const ProcessPO = () => {
    const [loading, setLoading] = useState(true);

    const userProfile = useSelector((state) => state.userProfile);

    const navigate = useNavigate();


    useEffect( () => {

        const processPOService =async () => {

            await ProcessPOService.processPOFile(userProfile).then((response) => {
                setLoading(false);
     
                Swal.fire({
                    title: 'PO Process Confirmation',
                    text: response.data.data.total_processed_files + '  PO has been processed, for a detailed status,please go to Process PO Log View',
                    icon: 'info',
                    confirmButtonText: 'Okey'
                  })
            });
        };

        processPOService();

},[]);

return(
    <>
        {loading ?   <Loader props={loading} /> : 
  
         navigate("/home")
        }
    </>
);

}

export default ProcessPO;