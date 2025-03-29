import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  Box,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material"; // Update path if using Material UI instead
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast as foxToast, ToastContainer } from "react-fox-toast";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import * as XLSX from "xlsx";
import CRUDService from "../axios/services/api/crud";
import { useSelector } from "react-redux";
import "../custom_css/crudUi.css";
import { ChevronLeft, ChevronRight, Refresh } from "@mui/icons-material";
import CustomModal from "../components/CustomModal";
import RefreshIcon from "@mui/icons-material/Refresh";

const CrudUI = () => {
  // State management hooks for tables, data, columns, file uploads, and edit dialogs
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTableName, setSelectedTableName] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [editableFields, setEditableFields] = useState([]);
  const [file, setFile] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [editRowData, setEditRowData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editChanges, setEditChanges] = useState({});
  const [selectedPOCode, setSelectedPOCode] = useState();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRecordData, setNewRecordData] = useState({});
  const [filePath, setFilePath] = useState("");
  const [operationType, setOperationType] = useState("s");
  const [highlightOperationType, setHighlightOperationType] = useState(false);
  const [isLeftCardCollapsed, setIsLeftCardCollapsed] = useState(false);
  const [selectedPrimaryKey, setSelectedPrimaryKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({});

  const userProfile = useSelector((state) => state.userProfile);

  // Fetch available tables from the server on component mount
  useEffect(() => {
    CRUDService.getTables(userProfile)
      .then((response) => {
        setTables(response.data.data.show_tables);
      })
      .catch((error) => {
        foxToast.error("Failed to fetch tables.");
        console.error(error);
      });
  }, []);
  // Handle table selection and fetch corresponding data
  const handleTableSelect = (event) => {
    const selectedKey = event.target.value;
    const selectedValue =
      tables.find((option) => option.sys_table_name === selectedKey)
        ?.usr_table_name || "";

    setSelectedTableName(selectedValue);
    setSelectedTable(selectedKey);
    fetchTableData(selectedKey);
  };

  // Fetch table data, column definitions, and editable fields from the API
  const fetchTableData = (table) => {
    setLoading(true);
    CRUDService.getTableData({ userProfile, table })
      .then((response) => {
        const { data, columns } = response.data.data.data;
        const editableFields = response.data.data.editableFields;
        setRowData(data);
        const initialVisibleColumns = columns.map((col) => col.field);
        setColumnDefs(
          columns.map((col) => ({
            headerName: col.headerName,
            field: col.field,
            field_dependency_flag: col.field_dependency_flag,
            editable: true, // Allow all fields to be editable for demonstration purposes
          }))
        );

        console.log();
        setEditableFields(editableFields);

        setVisibleColumns(initialVisibleColumns);
        foxToast.success("Data loaded successfully!");
      })
      .catch((error) => {
        foxToast.error("Failed to load table data.");
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle double-click event to open edit dialog with row data
  const onCellDoubleClicked = async (event) => {
    const primaryKey = await fetchPrimaryKey(event.data);
    console.log(
      "Printing from saved selectedPrimaryKey ------------->>>>",
      primaryKey
    );
    setEditRowData(event.data);
    setSelectedPOCode(event.data[primaryKey]);
    setOpenEditDialog(true);
  };

  // Fetch primary key from the API
  const fetchPrimaryKey = async () => {
    try {
      const response = await CRUDService.getPrimaryKey({
        userProfile,
        table: selectedTable,
      });
      setSelectedPrimaryKey(response.data.data.primaryKey);
      return response.data.data.primaryKey;
    } catch (error) {
      foxToast.error("Failed to fetch primary key.");
      console.error(error);
    }

    // await CRUDService.getPrimaryKey({ userProfile, table: selectedTable })
    //   .then(response => {
    //     console.log('Found Primary Key field name:',response.data.data.primaryKey);
    //     setSelectedPrimaryKey(response.data.data.primaryKey);
    //     return response.data.primaryKey;
    //   })
    //   .catch(error => {
    //     foxToast.error('Failed to fetch primary key.');
    //     console.error(error);
    //   });
  };

  // Handle edit dialog field changes
  const handleEditChange = (field, value) => {
    setEditRowData((prev) => ({ ...prev, [field]: value }));

    setEditChanges((prev) => ({
      ...prev,
      [field]: value, // Store only modified fields
    }));

    //console.log("Changes added---->>>",editChanges)
  };

  // Log state updates using useEffect
  useEffect(() => {}, [editChanges]); // Runs whenever editChanges is updated

  // Save edited row data and send updates to the server
  const handleEditSave = async () => {
    setOpenEditDialog(false);
    if (!editRowData) return;

    const updates = Object.keys(editRowData).reduce((acc, key) => {
      if (editableFields.includes(key)) acc[key] = editRowData[key];

      return acc;
    }, {});

    if (Object.keys(updates).length === 0) {
      foxToast.info("No changes made to save.");

      return;
    }

    CRUDService.updateTableData({
      userProfile,
      tableName: selectedTable,
      poCode: selectedPOCode,
      editData: editChanges,
    })
      .then((response) => {
        Swal.fire({
          title: response.data.data.error_message,
          html: response.data.data.add_message,
          type: "warning",
          confirmButtonColor: "#DD6B55",
          cancelButtonText: "No, cancel plx!",
        });
      })
      .catch((error) => {
        alert("Error in Updating");
        console.error(error);
      });
  };

  // Handle file upload and validate its format
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];

    console.log("File choosed", selectedFile);

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".xls")) {
      Swal.fire("Only .xls files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetNames = workbook.SheetNames;

      if (sheetNames.length > 1) {
        foxToast.error("Upload failed: Multiple sheets detected.");
        return;
      }

      const sheet = workbook.Sheets[sheetNames[0]];
      const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      if (!headers || headers.length === 0) {
        foxToast.error("Upload failed: Missing or tampered header line.");
        return;
      }
      setFile(selectedFile);
      setFilePath(event.target.value); // Set the file path
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  // Submit uploaded file to the server for processing
  const handleUploadSubmit = () => {
    if (!file) return Swal.fire("Please select a file.");

    if (operationType === "s") {
      setHighlightOperationType(true);
      Swal.fire({
        title: "Opti Chain",
        html: "You missed selecting Operation type",
        confirmButtonText: "OK",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          // Clear the blur effect
          document.querySelector(".main-container").classList.remove("blur");
        }
      });
      return;
    }

    CRUDService.templateUpload({
      userProfile: userProfile,
      tableName: selectedTable,
      file: file,
      opsType: operationType,
    })
      .then((response) => {
        if (response.data.duplicatePrimaryKey) {
          Swal.fire("Upload failed: Duplicate primary keys detected.");
        } else {
          Swal.fire(response.data);
        }
      })
      .catch(() => Swal.fire("Failed to upload data."));
  };

  // Download table template for data upload
  const downloadTemplate = async () => {
    const response = await CRUDService.downloadTemplate({
      userProfile,
      table: selectedTable,
    });
  };

  // Toggle visibility of columns in the grid
  const handleColumnVisibilityChange = (field) => {
    setVisibleColumns((prev) => {
      if (prev.includes(field)) {
        return prev.filter((col) => col !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  // Handle add new record dialog field changes
  const handleAddChange = (field, value) => {
    setNewRecordData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate and save new record data
  const handleAddSave = async () => {
    const userName = localStorage.getItem("username");
    newRecordData.created_by = userName;
    // Validate new record data
    for (let key of editableFields) {
      if (!newRecordData[key] || newRecordData[key].trim() === "") {
        console.log(`Field ${key} cannot be empty.`);
        foxToast.error(`Field ${key} cannot be empty.`);
        return;
      }
      // Add more validation checks as needed (e.g., numeric, email, etc.)
    }
    // Save new record data
    CRUDService.saveTableData({
      userProfile,
      table: selectedTable,
      newData: newRecordData,
    })
      .then((response) => {
        foxToast.success("Record added successfully!");
        setOpenAddDialog(false);
        fetchTableData(selectedTable); // Refresh table data
      })
      .catch((error) => {
        foxToast.error("Error in adding record");
        console.error(error);
      });
  };

  // Toggle left card collapse state
  const toggleLeftCard = () => {
    setIsLeftCardCollapsed((prevState) => !prevState);
  };

  // Refresh table data
  const refreshTableData = () => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  };

  //fetch fetchDependentData dropdown
  const fetchDropDownData = () => {
    CRUDService.getDependentKeyValue({
      userProfile,
      table: selectedTable,
    })
      .then((response) => {
        // Parse the stringified JSON in dict_key_value
        const dictKeyValue = JSON.parse(response.data.data.dict_key_value);
        // Filter only fields that exist in editableFields
        const dropdownData = {};
        editableFields.forEach((field) => {
          if (dictKeyValue[field]) {
            dropdownData[field] = dictKeyValue[field].map((item) => {
              const key = Object.keys(item)[0];
              return { value: key, label: item[key] };
            });
          }
        });
        foxToast.success("Data loaded successfully!");
        // Update your dropdown options state here
        setDropdownOptions(dropdownData);
        setOpenAddDialog(true);
      })
      .catch((error) => {
        foxToast.error("Error in loading data!");
        console.error(error);
      });
  };

  const openAddTableData = () => {
    fetchDropDownData();
  };

  return (
    <Box p={4}>
      <Grid
        container
        spacing={4}
        className={`main-container ${highlightOperationType ? "blur" : ""}`}
      >
        <Grid
          item
          xs={isLeftCardCollapsed ? 1 : 12}
          sm={isLeftCardCollapsed ? 1 : 4}
        >
          <Card className="shadow-lg rounded-xl">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" gutterBottom>
                  Tables
                </Typography>
                <IconButton onClick={toggleLeftCard}>
                  {isLeftCardCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
              </Box>
              {!isLeftCardCollapsed && (
                <>
                  <Select
                    value={selectedTable || ""}
                    onChange={handleTableSelect}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>
                      Select a Table
                    </MenuItem>
                    {tables.map((table) => (
                      <MenuItem
                        key={table.sys_table_name}
                        value={table.sys_table_name}
                      >
                        {table.usr_table_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {selectedTable && (
                    <Box mt={4} className="scrollable-box">
                      <Typography variant="subtitle1" gutterBottom>
                        Select Columns to Display:
                      </Typography>
                      {columnDefs.map((col) => (
                        <Box
                          key={col.field}
                          display="flex"
                          alignItems="center"
                          mb={2}
                        >
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(col.field)}
                            onChange={() =>
                              handleColumnVisibilityChange(col.field)
                            }
                          />
                          <label className="ml-2 text-sm">
                            {col.headerName}
                          </label>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {selectedTable && (
                    <Box mt={4}>
                      <FormControl fullWidth>
                        <InputLabel
                          style={{
                            color: highlightOperationType ? "red" : "inherit",
                          }}
                        >
                          Operation Type
                        </InputLabel>
                        <Select
                          value={operationType}
                          onChange={(e) => {
                            setOperationType(e.target.value);
                            setHighlightOperationType(false);
                            document
                              .getElementById("operation-type-select")
                              .focus();
                          }}
                          displayEmpty
                          variant="outlined"
                          style={{
                            border: highlightOperationType
                              ? "2px solid red"
                              : "inherit",
                          }}
                          label="Operation Type"
                          id="operation-type-select"
                        >
                          <MenuItem value="s" disabled default>
                            Select Operation
                          </MenuItem>
                          <MenuItem value="i">Insert New Record</MenuItem>
                          <MenuItem value="u">Upload Existing Record</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={isLeftCardCollapsed ? 11 : 12}
          sm={isLeftCardCollapsed ? 11 : 8}
        >
          <Card className="shadow-lg rounded-xl">
            <CardContent>
              {selectedTable ? (
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" gutterBottom>
                      Table Name: {selectedTableName} | System Name :{" "}
                      {selectedTable}{" "}
                    </Typography>
                    <Button
                      onClick={refreshTableData}
                      startIcon={<RefreshIcon />}
                      className="refresh-button"
                    >
                      Refresh
                    </Button>
                  </Box>
                  {loading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      height="400px"
                    >
                      <CircularProgress />
                      <Typography variant="h6" ml={2}>
                        Please Wait Refreshing Table.....
                      </Typography>
                    </Box>
                  ) : (
                    <div
                      className="ag-theme-alpine"
                      style={{ height: "400px", width: "100%" }}
                    >
                      <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs.filter((col) =>
                          visibleColumns.includes(col.field)
                        )}
                        defaultColDef={{
                          sortable: true,
                          filter: true,
                          resizable: true,
                          editable: false,
                        }}
                        onCellClicked={onCellDoubleClicked}
                      />
                    </div>
                  )}
                </>
              ) : (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                >
                  Select a table to display data
                </Typography>
              )}
            </CardContent>
          </Card>
          {selectedTable && (
            <Box
              mt={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              >
                <Button variant="outlined" onClick={downloadTemplate}>
                  Download Template
                </Button>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="upload-file"
                />
                <label htmlFor="upload-file">
                  <Button variant="outlined" component="span">
                    Choose File
                  </Button>
                </label>
                {filePath && (
                  <Typography variant="body2" color="textSecondary" ml={2}>
                    {filePath}
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUploadSubmit}
                >
                  Upload
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={openAddTableData}
                >
                  Add New Record
                </Button>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Row Data</DialogTitle>
        <DialogContent>
          {editRowData &&
            Object.keys(editRowData).map((key) => (
              <TextField
                key={key}
                label={key}
                value={editRowData[key] || ""}
                onChange={(e) => handleEditChange(key, e.target.value)}
                disabled={!editableFields.includes(key)} // Disable non-editable fields
                fullWidth
                margin="dense"
                className="textField"
                InputProps={{
                  style: {
                    backgroundColor: editableFields.includes(key)
                      ? "#ffffff"
                      : "#f0f0f0",
                  },
                }}
              />
            ))}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button
            onClick={handleEditSave}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </Button> */}
          <Button
            onClick={() => setOpenEditDialog(false)}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              backgroundColor: "#e63946",
              color: "#ffffff",
              borderRadius: "8px",

              "&:hover": { backgroundColor: "#d62828" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              backgroundColor: "#38a169",
              color: "white",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#2f855a" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Show Add New Button */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle
          sx={{
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Add New Record
        </DialogTitle>
        <DialogContent>
          {editableFields.map((field) => {
            const column = columnDefs.find((col) => col.field === field);
            if (!column) return null;
            return column.field_dependency_flag === "YES" ? (
              <FormControl
                fullWidth
                variant="outlined"
                className="textField"
                style={{ margin: "8px 0" }}
              >
                <InputLabel>{column.headerName}</InputLabel>
                <Select
                  value={newRecordData[field] || ""}
                  onChange={(e) => handleAddChange(field, e.target.value)}
                  displayEmpty
                  variant="outlined"
                  label={column.headerName}
                >
                  {/* <MenuItem value="" disabled default>
                    {column.headerName}
                  </MenuItem> */}
                  {dropdownOptions[field]?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                key={field}
                label={column.headerName}
                value={newRecordData[field] || ""}
                onChange={(e) => handleAddChange(field, e.target.value)}
                fullWidth
                margin="dense"
                className="textField"
                variant="outlined"
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenAddDialog(false)}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              backgroundColor: "#e63946",
              color: "#ffffff",
              borderRadius: "8px",

              "&:hover": { backgroundColor: "#d62828" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSave}
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              backgroundColor: "#38a169",
              color: "white",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#2f855a" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrudUI;
