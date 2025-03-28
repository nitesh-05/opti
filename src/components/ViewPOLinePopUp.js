import React, { useEffect, useLayoutEffect, useState, useCallback, CSSProperties } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ViewPOService from "../axios/services/api/viewPO";
import {
    setToken,
    setUserType,
    setUser,
} from "../redux/actions/authActions";
import { userType } from "../constants/constants";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "../custom_css/ViewPOLinePopUp.css";
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import swal from 'sweetalert2';
import { AiOutlineClose } from "react-icons/ai";
import Loader from "../components/Loader";
import { AiOutlineStop } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Modal, Button } from "antd"; // Using Ant Design for the modal

const ViewPOLinePopUp = ({ poCode, parentStateSetter }) => {

    const userProfile = useSelector((state) => state.userProfile);
    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(true);
    const [childState, setChildState] = useState(true);
    const [gridHeaderDefs, setGridHeaderDefs] = useState();
    const [gridRowData, setGridRowData] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);

    const gridHeaderData = [
        {
            headerName: "Sl#",
            field: "line_no",
            width: 20,
            headerClass: "ag-header-cell-wrap",
            cellStyle: { textAlign: "center", verticalAlign: "middle" },
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        {
            headerName: "Article Code", field: "article_code", filter: 'agTextColumnFilter', width: 100,
            headerClass: "ag-header-cell-wrap",
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        // { headerName: "EAN Code", field: "ean_code", width: 120 },
        {
            headerName: "Article Desc",
            field: "article_desc",
            filter: 'agTextColumnFilter',
            width: 400,
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        // { headerName: "Basic Price", field: "po_basic_price", width: 100,headerClass: "ag-header-cell-wrap", },
        // { headerName: "Tax %", field: "tax_per", width: 70,headerClass: "ag-header-cell-wrap" },
        // { headerName: "Tax Amt", field: "tax_amt",  width: 70,headerClass: "ag-header-cell-wrap" },
        // { headerName: "Price with Tax", field: "price_w_tax",  width: 90,headerClass: "ag-header-cell-wrap" },
        {
            headerName: "PO Qty", field: "po_qty", width: 80,
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        // { headerName: "MRP", field: "po_mrp",  width: 80 },
        {
            headerName: "Line Amt", field: "po_line_amt_tot", width: 100, cellStyle: { textAlign: "right" },
            valueFormatter: (params) => {
                // Ensure the value is displayed with two decimal places
                return params.value ? Number(params.value).toFixed(2) : "0.00";
            },
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        {
            headerName: "Skip",
            field: "ignore_sku",
            width: 90,
            headerClass: "ag-header-cell-wrap",
            cellRenderer: (params) => {

                // Render an icon if Errors column is not NA, otherwise render blank
                if (params.data.error_desc && params.data.error_desc !== "na") {
                    return (
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                color: "red", // Color of the Ignore icon
                            }}
                            title="Ignore SKU"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent row selection on icon click
                                console.log("Ignore SKU clicked for row:", params.data);
                                // Perform your desired action here, like opening a modal
                                openSkipModal(params.data);
                            }}
                        >
                            <AiOutlineStop size={16} />
                        </span>
                    );
                }

                return ""; // Return blank if no error
            },
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        {
            headerName: "Status",
            field: "status",
            width: 100,
            autoHeight: true, // Automatically adjust row height
            wrapText: true, // Enable text wrapping
            valueGetter: (params) => {
                // Show "Failed" if Errors column is not NA, otherwise "Passed"
                return params.data.error_desc !== "na" ? "Failed" : "Passed";
            },
            cellStyle: (params) => {
                // Apply red color for "Failed" and green for "Passed"
                return params.value === "Failed"
                    ? { color: "red", fontWeight: "bold" }
                    : { color: "green", fontWeight: "bold" };
            },
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        },
        {
            headerName: "Errors", field: "error_desc", width: 250,
            wrapText: true,
            autoHeight: true,
            width: 350,
            cellStyle: { whiteSpace: "normal", overflowWrap: "break-word" },
            valueGetter: (params) => {
                // Show value only if it's not "NA"
                return params.data.error_desc !== "na" ? params.data.error_desc : null;
            },
            // rowSpan: (params) => {
            //     if (params.data.error_desc && params.data.error_desc.includes("|")) {
            //         // Return the number of rows to span based on pipe count
            //         return params.data.error_desc.split("|").length;
            //     }
            //     return 1; // Default to 1 if no pipe
            // }
            valueFormatter: (params) => {
                if (params.data.error_desc && params.data.error_desc.includes("|")) {
                    return params.value.split("|").join("\n") // Format pipe-separated values
                }
            }
        },
        {
            headerName: "Allow",
            field: "skip_sku",
            width: 90,
            headerClass: "ag-header-cell-wrap",
            cellRenderer: (params) => {
                // Render a Skip icon if Errors column is not NA, otherwise render blank
                if (params.data.skip_sku && params.data.skip_sku == "YES") {
                    return (
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                color: "green", // Color of the Skip icon
                            }}
                            title="Skip SKU"
                        >
                            <AiOutlineCheck size={16} />
                        </span>
                    );
                }
                return ""; // Return blank if no error
            },
            rowSpan: (params) => getRowSpan(params), // Dynamically span rows
            cellClassRules: {
                "cell-span": (params) => params.rowSpan > 1, // Add custom class for spanned cells
            }
        }

    ];





    const getRowSpan = (params) => {
        const errorContent = params.data.error_desc || "";
        const lineCount = errorContent ? errorContent.split("|").length : 1;

        if (errorContent.includes("|")) {
            return errorContent.split("|").length; // Number of errors determines row span
        }
        return 1; // Default to 1 row span
    };

    const getRowHeight = (params) => {

        const errorContent = params.data.error_desc || "";
        const lineCount = errorContent ? errorContent.split("|").length : 1;

        return 25; // Adjust row height for multiple error lines

    };


    const [headerData, setHeaderData] = useState(
        {
            custName: "",
            processingDate: "",
            poNo: "",
            poDate: "",
            poStatus: "",
            billTo: "",
            shipFromWh: "",
            billToAddress: "",
            erpRefNo: "",
            erpPushRemarks: "",
            pushToERP: "",
            errorDetails: ""

        });

    useEffect(() => {
        parentStateSetter(childState);
    }, [parentStateSetter, childState]);

    const handleClose = () => {
        setChildState(false);

    };

    useEffect(() => {

        const getPOSerivce = async () => {



            await ViewPOService.getPOLineDetails(userProfile, poCode).then((response) => {


                setGridHeaderDefs(gridHeaderData);
                setGridRowData(response.data.data.line_payload);

                const formattedAmount = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2,
                }).format(response.data.data.header_payload.po_tot_amt);
                //Load the header data
                headerData.custName = response.data.data.header_payload.master_customer_name;
                headerData.processingDate = response.data.data.header_payload.processed_date;
                headerData.poNo = response.data.data.header_payload.po_no;

                headerData.poDate = response.data.data.header_payload.po_date;
                headerData.poStatus = response.data.data.header_payload.status_desc;
                headerData.billTo = response.data.data.header_payload.po_delivery_by_name;
                headerData.shipFromWh = response.data.data.header_payload.po_delivery_by_name;
                headerData.billToAddress = response.data.data.header_payload.po_delivery_by_address;
                headerData.erpRefNo = "";
                headerData.erpPushRemarks = "";
                headerData.pushToERP = "";
                headerData.poValue = formattedAmount;
                headerData.errorDetails = response.data.data.header_payload.error_desc;

                setLoading(false);

            });
        }
        getPOSerivce();

    }, []);

    // // Handle Cell Click
    // const handleCellClick = (event) => {
    //     console.log(event);
    //     if(event.colDef.field==="status" && event.value==="Failed"){
    //         setSelectedRowData(event.data); // Set the clicked row's data
    //         setIsModalVisible(true); // Open the modal
    //     }
    // };

    // Close Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const openSkipModal = (rowData) => {
        console.log("Open modal for:", rowData);
        // Your logic to open a modal and pass rowData
        setSelectedRowData(rowData); // Store the row data for the modal
        setIsModalVisible(true); // Show the modal
    };

    const openAllowModal = (rowData) => {
        console.log("Open modal for:", rowData);
        // Your logic to open a modal and pass rowData
        setSelectedRowData(rowData); // Store the row data for the modal
        setIsModalVisible(true); // Show the modal
    };


    return (
        <>
            {loading ?
                <Loader props={loading} /> :

                <div
                    style={{
                        position: "fixed",
                        background: "rgba(0,0,0,0.6)",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: '100vh'

                    }}

                >
                    {/* Content */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "fixed",
                            background: "white",
                            borderRadius: "5px",
                            width: "90%",
                            padding: "10px 5px",
                            animation: "dropTop .1000s linear",
                            height: '95vh'
                        }}
                    >
                        <div >
                            {/* Table for general information */}
                            <div>
                                Purchase Order
                            </div>
                            <table border="1" style={{
                                width: "100%", // Ensures table spans full width
                                borderCollapse: "collapse", // Merges table borders
                                borderRadius: "8px",
                                overflow: "hidden"
                            }}>
                                <tbody>
                                    {/* Header Row */}
                                    <tr>
                                        <th
                                            align="left"
                                            colSpan="4"
                                            style={{
                                                padding: "2px",
                                                paddingLeft: "5px",
                                                backgroundColor: "lightskyblue", // Light blue color for header
                                                color: "white",
                                            }}
                                        >
                                            PO Header
                                        </th>
                                    </tr>

                                    {/* Data Row */}
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            Processing Date</td>
                                        <td style={{ padding: "1px", width: "20%", backgroundColor: "lightgrey", color: "black" }}>{headerData.processingDate}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            Customer Name </td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.custName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            PO Number</td>
                                        <td style={{ padding: "1px", width: "20%" }}>{headerData.poNo}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            PO Date</td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.poDate}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            PO Status</td>
                                        <td style={{
                                            padding: "1px", width: "20%",
                                            color: headerData.poStatus === "Order"
                                                ? "green"
                                                : headerData.poStatus === "Error"
                                                    ? "red"
                                                    : "black",
                                        }}>{headerData.poStatus}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            Bill To </td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.billTo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            Ship From W/h</td>
                                        <td style={{ padding: "1px", width: "20%" }}>{headerData.shipFromWh}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            Bill To Address</td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.billToAddress}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            ERP Ref No.</td>
                                        <td style={{ padding: "1px", width: "20%" }}>{headerData.erpRefNo}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            ERP Upload Status</td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.erpPushRemarks}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            Pushed to ERP Status</td>
                                        <td style={{ padding: "1px", width: "20%" }}>{headerData.erpPushToERP}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            Details Error</td>
                                        <td style={{ padding: "1px", width: "55%" }}>{headerData.errorDetails}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightseagreen", color: "white" }}>
                                            ERP Sales Order No.</td>
                                        <td style={{ padding: "1px", width: "20%" }}>{""}</td>
                                        <td style={{ padding: "1px", width: "15%", backgroundColor: "lightgray", color: "black" }}>
                                            PO Value     </td>
                                        <td style={{ padding: "1px", width: "55%" }}>
                                            {headerData.poValue}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            {/* here */}
                            <div style={{ textAlign: "right", position: "absolute", top: "10px", right: "10px" }}>
                                <div
                                    onClick={handleClose}
                                    style={{
                                        cursor: "pointer",
                                        padding: "5px",
                                        borderRadius: "50%",
                                        // backgroundColor: "#f0f0f0",
                                        transition: "background-color 0.2s ease, transform 0.2s ease",
                                        display: "inline-block"
                                    }}
                                    title="Close"
                                    aria-label="Close the popup"
                                // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ddd"} // Hover effect
                                // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"} // Reset hover effect
                                >
                                    <AiOutlineClose />
                                </div>
                            </div>


                        </div>



                        {/* Body */}
                        <div className="ag-theme-quartz" style={{ height: '350px' }}>
                            <table border="0" style={{
                                width: "100%", // Ensures table spans full width
                                borderCollapse: "collapse", // Merges table borders
                                // borderRadius: "8px",
                                //  overflow: "hidden"
                            }}>
                                <tr>
                                    <th
                                        align="left"
                                        style={{
                                            padding: "2px",
                                            paddingLeft: "5px",
                                            backgroundColor: "lightgreen", // Light blue color for header
                                            color: "black",
                                        }}
                                    >
                                        Item Details
                                    </th>
                                </tr>

                            </table>
                            <AgGridReact
                                columnDefs={gridHeaderDefs}
                                rowData={gridRowData}
                                showGrid={true}
                                defaultColDef={{
                                    flex: 0,
                                    resizable: true,
                                }}
                                getRowHeight={getRowHeight} // Dynamically calculate row height
                            //domLayout="autoHeight"
                            //onCellClicked={handleCellClick} // Event listener for cell clicks

                            />
                        </div>
                        {/* Modal Popup */}
                        <Modal
                            title="Row Details"
                            open={isModalVisible}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="close" onClick={handleCancel}>
                                    Close
                                </Button>,
                            ]}
                        >
                            <p>
                                <strong>Sl No:</strong> {selectedRowData?.sl_no}
                            </p>
                            <p>
                                <strong>Article Code:</strong> {selectedRowData?.article_code}
                            </p>
                            <p>
                                <strong>Error Description:</strong> {selectedRowData?.error_desc}
                            </p>
                        </Modal>
                        {/* Footer */}

                       
                    </div>
                </div>
            }

        </>

    );


}

export default ViewPOLinePopUp;