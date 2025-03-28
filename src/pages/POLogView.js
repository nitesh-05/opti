import React, { useEffect, useLayoutEffect, useState, useRef, useMemo,useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import Swal from "sweetalert2";
import ViewPOLogService from "../axios/services/api/viewPOLog";
import useDownloader from 'react-use-downloader';
import BreadCrumb from "../components/Breadcrumb";

const POLogView = () => {
    const [clickedCellData, setClickedCellData] = useState({});
    const userProfile = useSelector((state) => state.userProfile);

    

    const [gridHeaderDefs, setGridHeaderDefs] = useState();
    const [gridRowData, setGridRowData] = useState();


    const navigate = useNavigate();

    const onGridCellClicked = async (CellClickedEvent) => {
        
        console.log("clicked",CellClickedEvent.data.id);
        const clickedID = CellClickedEvent.data.id;
        const iconClicked = CellClickedEvent.event.srcElement.id;
        
        setClickedCellData(CellClickedEvent.data);
        

        if(iconClicked==="downloadIcon"){
            
                await ViewPOLogService.downloadPO(userProfile,CellClickedEvent.data.dest_location,CellClickedEvent.data.file_name)
                .then((response) => {
                    const pdfBlob = new Blob([response.data],{type: 'application/pdf'});     
                    const url = window.URL.createObjectURL(pdfBlob);  

                    const tempLink = document.createElement("a");
                    tempLink.href = url;
                    tempLink.setAttribute(
                    "download",
                    `po_${CellClickedEvent.data.file_name}`
                    ); 
                    // Set the desired filename for the downloaded file
                    document.body.appendChild(tempLink);
                    tempLink.click();

                    // // Clean up the temporary elements and URL
                    document.body.removeChild(tempLink);
                  
                        window.URL.revokeObjectURL(url)
                 });
                
                
                           
        }else if(iconClicked==="deleteIcon"){
            console.log("inside deleteicon",CellClickedEvent.data.id);

            Swal.fire({
                title: 'Delete Confirmation?',
                text: 'You are going to Delete PO ID : '+CellClickedEvent.data.id,
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
                    DeleteLineHandler(CellClickedEvent.data);
                    
                } 
              })
            

            
        }

    }

    const DeleteLineHandler = async (data) => {
       
            console.log("fileCode:",data.id);
            await ViewPOLogService.deletePOLogLine(userProfile,data.id).then((response) => {
                console.log("file deleted");
                onGridReady();
             
            });
    
    };

    const IconComponents =  () => {

        const deleteImagePath = require("../icons/delete.png");

        return (

           <div>
              
                <i id="downloadIcon" className="fa fa-download" aria-hidden="true" style={{cursor:'pointer'}}  title="Click to Download PO!"></i>
               
                <i id="deleteIcon" className="fa fa-trash" aria-hidden="true" 
                    style={{paddingLeft:'5px',cursor:'pointer'}}  
                    title="Click to Delete!"
                    ></i>
                
           </div>
          )
        


    };

    

    const gridHeaderData = [
        { headerName: "ID", field: "id", width: 80 },
        { headerName: "Filename", field: "file_name", filter: 'agTextColumnFilter', width: 300 },
        { headerName: "Status Code", field: "status_code", width: 40 },
        { headerName: "Status Detail", field: "status_desc", width: 300 },
        {
            headerName: "Status",
            field: "ui_status",
            width: 100,
            volatile: true,
            cellStyle: params => {
                if (params.value === 'Failed') {
                    return { color: 'red' };
                } else if (params.value === 'Success') {
                    return { color: 'green' };
                }
                return null;
            }
        },
        { headerName: "Upload Date/time", field: "rec_timestamp", width: 220 },
        {
            field: "actions",
            headerName: "Action",
            cellRenderer: IconComponents,
            width: 100
          }
    ];


    const gridRef = useRef();


    const defaultColDef = useMemo(() => {
        return {
            initialWidth: 20,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            enableCellChangeFlash: true,
        };
    }, []);


    const onGridReady = async (params) => {

        await ViewPOLogService.getViewPOLogDetails(userProfile).then((response) => {
            setGridHeaderDefs(gridHeaderData);
            setGridRowData(response.data.data.view_log_payload);

         
        });
        
      };
    

    // useEffect(() => {
    //     //getLogGridDetails();
    //     setHeaderHeight(50);
    // }, []);



    return (
        <>
                <BreadCrumb mainMenu="Log" subMainMenu="View PO Log"/>
                <div className="ag-theme-quartz" style={{ height: '350px' }}>

                    <AgGridReact
                        ref={gridRef}
                        columnDefs={gridHeaderDefs}
                        rowData={gridRowData}
                        showGrid={true}
                        rowHeight="20"
                        paginationAutoPageSize={true}
                        pagination={true}
                        defaultColDef={defaultColDef}
                        onGridReady={onGridReady}
                        onCellClicked={onGridCellClicked}

                    />
                </div>
            

        </>


    );
}

export default POLogView;