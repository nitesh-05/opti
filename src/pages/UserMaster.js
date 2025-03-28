import React, { useEffect, useLayoutEffect, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserMasterService from "../axios/services/api/userMaster";
import { Loader } from 'react-loader-spinner';
import {setToken,setUserType,setUser} from "../redux/actions/authActions";
import { userType } from "../constants/constants";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import swal from 'sweetalert2';
import Footer from "../components/Footer";
import "../custom_css/entryGrid.css";
import BreadCrumb from "../components/Breadcrumb";

const UserMaster = () => {

  const { handleSubmit } = useForm();

  const [modFlag, setModFlag] = useState(0);
  const [gridHeaderDefs, setGridHeaderDefs] = useState();
  const [gridRowData, setGridRowData] = useState();
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [showEntry, setShowEntry] = useState(true);
  const [inputValue,setInputValue] = useState();


  const [isLoading, setIsLoading] = useState(false);


  const [modFormData, setModFormData] = useState({});

  const userProfile = useSelector((state) => state.userProfile);

  const CredentialButtonHandler = (event) => {
    
    return (
      <button onClick={() => swal.fire("ok")}>Launch!</button>
    )
  };

  const gridHeaderData = [
    { headerName: "Employee Code", field: "emp_code", filter: 'agTextColumnFilter', width: 120 },
    { headerName: "Employee Name", field: "emp_name", width: 150 },
    { headerName: "Email ID", field: "email_id", width: 150 },
    { headerName: "Phone No", field: "phone_no", width: 120 },
    { headerName: "User Type", field: "user_type", width: 100 },
    { headerName: "Report Mgr ID", field: "rpt_mgr_id", width: 100 },
    { headerName: "Report Mgr Name", field: "rpt_mgr_name", width: 120 },
    { headerName: "Employee Status", field: "status", width: 100 },
    { headerName: "Credential", field: "cred", width: 100,cellRenderer: CredentialButtonHandler }];

  const defColDef = { wrapHeaderText: true, headerHeight: "20px" };

  const formData = {
    empCode: "",
    empName: "",
    empMailId: "",
    phoneNo: "",
    empStatus: "0",
    reportingManagerID: "",
    reportingManagerName: "",
    empUserType: "0",
    appModFlag: modFlag
  };

  const [values, setValues] = useState(formData);
  const [data,setData]=useState(formData);

  const formComponentHandler = (event) => {
    event.preventDefault();
    if(event.target.value!=inputValue){
      setInputValue(event.target.value);
      const { name, value } = event.target;
      setModFormData((prevState) => ({ ...prevState, [name]: value }));
    }
    
  };

  const handleOnFocus = (event) => {
    setInputValue(event.target.value);
  }

  const getUserDetails = async () => {
    await UserMasterService.viewUserDetails(userProfile).then((response) => {
      setGridHeaderDefs(gridHeaderData);

      setGridRowData(response.data.data.user_details);
    });
  };

  const refreshButtonHandler = (event) => {

    getUserDetails();
  };

  const resetButtonHandler = (event) => {
    setValues({
      empCode: ""
    });
    document.getElementById('emp_code').value = null;
    document.getElementById('emp_name').value = null;
    document.getElementById('emp_mail_id').value = null;
    document.getElementById('emp_status').value = null;
    document.getElementById('user_type').value = null;
    document.getElementById('phone_no').value = null;

    document.getElementById('rpt_mgr_id').value = null;
    document.getElementById('rpt_mgr_name').value = null;
    setModFlag(0);

  };

  const saveButtonHandler = (event) => {
    
    if(modFlag===0) {
      swal.fire("You are going to save this record");
      formData.empCode = document.getElementById('emp_code').value;
      formData.empName = document.getElementById('emp_name').value;
      formData.empMailId = document.getElementById('emp_mail_id').value;
      formData.empStatus = document.getElementById('emp_status').value;
      formData.userType = document.getElementById('user_type').value;
      formData.phoneNo = document.getElementById('phone_no').value;

      formData.reportingManagerID = document.getElementById('rpt_mgr_id').value;
      formData.reportingManagerName = document.getElementById('rpt_mgr_name').value;
      formData.appModFlag = modFlag;

      setData(formData);
      UserMasterService.saveUserDetails(data, userProfile).then((response) => {


        if (response.data.data.user_save_response.sql_resp_code === 0) {
          swal.fire(response.data.data.user_save_response.message);
  
          //getUserDetails();
          resetButtonHandler();
        } else {
          swal.fire(response.data.data.user_save_response.message);
        }
  
  
      });
  
    }else if(modFlag===1 && Object.keys(modFormData).length===0){
      swal.fire("No values changed");
      return;
    }else {

      formData.empCode = document.getElementById('emp_code').value;
      setData(modFormData);
      
      UserMasterService.modUserDetails(modFormData, userProfile,formData.empCode).then((response) => {
        swal.fire(response.data.data.user_details_update_resp.message);
      }); 
      
    }


  };


  const showDataHandler = (event) => {
    setShowEntry(false);
    setShowDataGrid(true);

  };

  const showEntryHandler = (event) => {

    setShowDataGrid(false);
    setShowEntry(true);
  }

  const onGridCellClicked = async (CellClickedEvent) => {
    
    // CellClickedEvent.preventDefault();
    
    formData.empCode = CellClickedEvent.data.emp_code;

    setValues({
      empCode: CellClickedEvent.data.emp_code,
      empName: CellClickedEvent.data.emp_name,
      empMailId: CellClickedEvent.data.email_id,
      empStatus: CellClickedEvent.data.status,
      userType: CellClickedEvent.data.user_type,
      phoneNo: CellClickedEvent.data.phone_no,
      reportingManagerID: CellClickedEvent.data.rpt_mgr_id,
      reportingManagerName: CellClickedEvent.data.rpt_mgr_name
    });

    setModFormData({});
    showEntryHandler();



    setModFlag(1);
  };

  useEffect(() => {
    resetButtonHandler();
    getUserDetails();
  }, []);


  return (


    <div>
      <BreadCrumb mainMenu="Master" subMainMenu="User Master"/>
      {/* <form onSubmit={submitForm}> */}
      {showEntry ?
        <body>
          <div className='container'>
            <form action="#">
              <header>Add | Edit User</header>
              <div className='fields'>
                <div className='input-fields'>
                  <label>Employee Code</label>
                  <input id="emp_code"
                    name="empCode"
                    placeholder="Employee Code"
                    defaultValue={values.empCode}
                    disabled={values.empCode === "" ? false : true}
                    type="text"
                    required />
                </div>
                <div className='input-fields'>
                  <label>Employee Name</label>
                  <input 
                    id="emp_name" 
                    name="empName"
                    placeholder="Employee Name" 
                    defaultValue={values.empName} 
                    type="text" 
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}
                    required />
                </div>
                <div className='input-fields'>
                  <label>Phone No</label>
                  <input 
                    id="phone_no" 
                    name="phoneNo"
                    placeholder="Phone No" 
                    type="number" 
                    defaultValue={values.phoneNo} 
                    min="10" 
                    max="10" 
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}
                    required />
                </div>
                <div className='input-fields'>
                  <label>Email ID</label>
                  <input 
                    id="emp_mail_id" 
                    name="empMailId"
                    placeholder="Mail ID" 
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}
                    defaultValue={values.empMailId} 
                    />
                </div>
                <div className='input-fields'>
                  <label>Reporting Mgr ID</label>
                  <input 
                    id="rpt_mgr_id" 
                    name="reportingManagerID"
                    placeholder="Reporting Manager ID" 
                    type="text" 
                    defaultValue={values.reportingManagerID} 
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}                    
                  />
                </div>
                <div className='input-fields'>
                  <label>Reporting Mgr Name</label>
                  <input 
                    id="rpt_mgr_name" 
                    name="reportingManagerName"
                    placeholder="Reporting Manager Name" 
                    type="text" 
                    defaultValue={values.reportingManagerName} 
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}                    
                  />
                </div>


                <div className='input-fields'>
                  <label>User Type</label>
                  <select 
                    id="user_type" 
                    name="empUserType"
                    required 
                    defaultValue={values.userType}
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}                    
                    >
                    <option value="0" selected>Select User Type</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </div>
                <div className='input-fields'>
                  <label>Status</label>
                  <select 
                    id="emp_status" 
                    name="empStatus"
                    onBlur={formComponentHandler} 
                    onFocus={handleOnFocus}
                    required 
                    defaultValue={values.empStatus}>
                    <option value="0" selected>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>
              <div className="buttons">
                <div class="backBtn">
                  <i class="uil uil-navigator"></i>
                  <span onClick={handleSubmit(saveButtonHandler)}>Save</span>
                </div>
                <div class="backBtn">
                  <i class="uil uil-navigator"></i>
                  <span onClick={resetButtonHandler}>Reset</span>
                </div>
                <div className="backBtn">
                  <i className="uil uil-navigator"></i>
                  <span onClick={refreshButtonHandler}>Refresh</span>
                </div>
                <div className="showGridBtn">
                  <i className="uil uil-navigator"></i>
                  <span onClick={showDataHandler}>Show Data</span>
                </div>
              </div>
            </form>
          </div>
        </body>
        : null}

      {showDataGrid ?
        <div className="ag-theme-quartz" style={{ height: "350px" }}>
          <AgGridReact
            rowData={gridRowData}
            columnDefs={gridHeaderDefs}
            defaultColDef={defColDef}
            onCellClicked={onGridCellClicked}
          />
          <div className="showGridBtn">
            <i className="uil uil-navigator"></i>
            <span onClick={showEntryHandler}>Show Entry</span>
          </div>

        </div>
        : null}

      <Footer />

    </div>

  );


};

export default UserMaster;