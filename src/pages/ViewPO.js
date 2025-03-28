import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from "react";
import { useForm, FormProvider, useFormContext, set } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ViewPOService from "../axios/services/api/viewPO";
//import { Loader } from 'react-loader-spinner';
import Loader from "../components/Loader";
import { setToken, setUserType, setUser } from "../redux/actions/authActions";
import { userType } from "../constants/constants";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import swal from "sweetalert2";
import Footer from "../components/Footer";
import ViewPOLinePopUp from "../components/ViewPOLinePopUp";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import BreadCrumb from "../components/Breadcrumb";
import POHeaderStatusModal from "../components/POHeaderStatusModal";
import "../custom_css/ViewPOLinePopUp.css";

const ViewPO = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [clickedPoNo, setClickedPONo] = useState();

  const userProfile = useSelector((state) => state.userProfile);

  const [gridHeaderDefs, setGridHeaderDefs] = useState();
  const [gridRowData, setGridRowData] = useState();
  const [showComponent, setShowComponent] = useState(false);
  const [updateStatusModalVisible, setUpdateStatusModalVisible] =
    useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const wrapperSetShowComponent = useCallback(
    (val) => {
      setShowComponent(val);
    },
    [setShowComponent]
  );

  const dispatch = useDispatch();

  const DeletePO = () => {};

  const onGridCellClicked = async (CellClickedEvent) => {
    setClickedPONo(CellClickedEvent.data.id);
    const clickedID = CellClickedEvent.data.id;
    const iconClicked = CellClickedEvent.event.srcElement.id;

    if (iconClicked === "deleteIcon") {
      swal.fire("Delete Icon" + clickedID);
    }

    if (iconClicked === "viewLineDetails") {
      setShowComponent(!showComponent);
    }

    if (iconClicked === "reValidateIcon") {
      swal
        .fire({
          title: "Are you sure?",
          text: "Do you want to validate,this will remove existing validation(if any).",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            validatePO(clickedID);
          }
        });
    }
  };

  const IconComponents = () => {
    const deleteImagePath = require("../icons/delete.png");

    return (
      //  <img src={require(\ "./yourimage.png")} alt="My Image" />
      //<span><img id="deleteIcon"  src={'../icons/delete.png'} /></span>
      //<img src={deleteImagePath} alt="delete" />
      <div>
        <i
          id="deleteIcon"
          className="fa fa-trash"
          aria-hidden="true"
          style={{ cursor: "pointer" }}
          title="Click to delete!"
        ></i>

        <i
          id="reValidateIcon"
          className="fa fa-refresh"
          style={{ cursor: "pointer", paddingLeft: "10px" }}
          title="Click to revalidate this PO"
        ></i>

        <i
          id="viewLineDetails"
          className="fa fa-eye"
          style={{ cursor: "pointer", paddingLeft: "10px" }}
          title="Click to view line details"
        ></i>
      </div>
    );
  };

  // const PONoHandler = (params) => {
  //     return (
  //         <a href={params.value} target="_blank">
  //           {params.value}
  //         </a>
  //       )
  // };

  const gridHeaderData = [
    {
      headerName: "Chain Name",
      field: "master_customer_name",
      filter: "agTextColumnFilter",
      width: 120,
    },
    {
      headerName: "PO #",
      field: "po_no",
      filter: "agTextColumnFilter",
      width: 150,
    },
    {
      headerName: "Store Code",
      field: "po_store_code",
      filter: "agTextColumnFilter",
      width: 250,
    },
    { headerName: "PO Date", field: "po_date", width: 120 },
    { headerName: "Expiry Date", field: "po_expiry_date", width: 120 },
    { headerName: "Delivery Date", field: "po_delivery_date", width: 120 },
    { headerName: "Total Qty", field: "po_tot_qty", width: 120 },
    {
      headerName: "PO Value",
      field: "po_tot_amt",
      width: 100,
      valueFormatter: (p) => "₹" + p.value.toLocaleString(),
    },
    { headerName: "PO Total Lines", field: "po_tot_line_count", width: 100 },
    {
      headerName: "Status",
      field: "status_desc",
      cellRenderer: (params) => {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Save selected PO and open the modal.
              setSelectedPO(params.data);
              setIsModalVisible(true);
            }}
          >
            {params.value}
          </a>
        );
      },
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: IconComponents,
      width: 100,
    },
  ];

  const defColDef = { wrapHeaderText: true, headerHeight: "20px" };

  const validatePO = async (poIntCode) => {
    setLoading(true);

    try {
      // Call validatePOService
      const response = await ViewPOService.validatePO(userProfile, poIntCode);

      const validationMessage =
        response.data.data.validation_resp.message.message;

      // Determine text color based on validation result
      const isSuccessful = validationMessage === "PO Validated No Error Found";
      const messageColor = isSuccessful ? "green" : "red";
      // Show confirmation dialog with the result
      swal.fire({
        title: "PO Validation Completed",
        html: `<span style="color: ${messageColor};">${validationMessage}</span>`,
        icon: "info",
        confirmButtonText: "Okay",
      });
    } catch (error) {
      // Handle any error from the service
      swal.fire({
        title: "Error",
        text: "Failed to validate the PO. Please try again later.",
        icon: "error",
        confirmButtonText: "Close",
      });
    } finally {
      setLoading(false); // Hide Loader after the service call completes
    }
  };

  const getPOGridDetails = async () => {
    await ViewPOService.getViewPODetails(userProfile).then((response) => {
      setGridHeaderDefs(gridHeaderData);
      setGridRowData(response.data.data.po_details);
    });
  };

  useEffect(() => {
    getPOGridDetails();
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
    //setSelectedRowData(null);
  };

  // Open the Update Status modal and load available statuses.
  const openStatusModal = async (poData) => {
    try {
      console.log("inside");
      const response = await ViewPOService.getStatus(userProfile).then(
        (response) => {
          console.log("response status------->>>>", response.data.po_status);
          const allStatuses = response.data.po_status;
          setAvailableStatuses(allStatuses);
          setUpdateStatusModalVisible(true);
        }
      );
    } catch (error) {
      swal.fire("Error", "Failed to load statuses.", "error");
    }
  };

  const handleSaveStatus = async (newStatus, reason) => {
    if (!selectedPO) return;
    try {
      await ViewPOService.saveStatus({
        poId: selectedPO.id,
        newStatus: newStatus,
        reason: reason,
      });
      swal.fire("Success", "PO status updated successfully.", "success");
      setUpdateStatusModalVisible(false);
      getPOGridDetails();
    } catch (error) {
      swal.fire("Error", "Failed to update status.", "error");
    }
  };

  return (
    <div>
      <BreadCrumb mainMenu="Transaction" subMainMenu="View PO" />
      <div className="ag-theme-quartz" style={{ height: "350px" }}>
        <AgGridReact
          rowData={gridRowData}
          columnDefs={gridHeaderDefs}
          defaultColDef={defColDef}
          rowHeight="20"
          onCellClicked={onGridCellClicked}
        />

        {showComponent && (
          <ViewPOLinePopUp
            poCode={clickedPoNo}
            parentStateSetter={wrapperSetShowComponent}
          />
        )}

        {/* <div className="showGridBtn">
            <i className="uil uil-navigator"></i>
            <span onClick={showEntryHandler}>Show Entry</span>
          </div> */}

        {/* Show Loader while waiting for the service response */}
        {loading && <Loader />}
      </div>
    </div>
  );
};

export default ViewPO;
