import React, { useState, useEffect } from "react";
import "../custom_css/reportPOVsSales.css";
import { Card, CardContent, Typography, Box, Button, MenuItem, Select, FormControl, InputLabel, TextField, ListItemIcon, ListItemText } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import ScreenIcon from '@mui/icons-material/ScreenShare';
import ExcelIcon from '@mui/icons-material/InsertDriveFile';

const ReportPOVsSales = () => {
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs().endOf('month'));
    const [masterCustomer, setMasterCustomer] = useState("");
    const [reportDimension, setReportDimension] = useState("");
    const [reportType, setReportType] = useState("Screen");
    const [reportData, setReportData] = useState([]);

    const handleGenerateReport = () => {
        // Logic to fetch report data based on the selected filters
        const data = [
            { date: '2025-03-01', customer: 'Customer A', sales: 1000 },
            { date: '2025-03-02', customer: 'Customer B', sales: 1500 },
            { date: '2025-03-03', customer: 'Customer C', sales: 2000 },
        ];
        setReportData(data);

        if (reportType === "Excel") {
            exportToExcel(data);
        }
    };

    const exportToExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "ReportPOVsSales.xlsx");
    };

    return (
        <div className="container-report">
            <Card className="filter-card">
                <CardContent>
                    <Typography variant="h6">Generate Report</Typography>
                    <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mt={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From Date"
                                value={fromDate}
                                onChange={setFromDate}
                                renderInput={(params) => <TextField {...params} />}
                                inputFormat="DD/MM/YYYY"
                            />
                            <DatePicker
                                label="To Date"
                                value={toDate}
                                onChange={setToDate}
                                renderInput={(params) => <TextField {...params} />}
                                inputFormat="DD/MM/YYYY"
                            />
                        </LocalizationProvider>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="master-customer-label">Master Customer</InputLabel>
                            <Select
                                labelId="master-customer-label"
                                value={masterCustomer}
                                label="Master Customer"
                                onChange={(e) => setMasterCustomer(e.target.value)}
                            >
                                <MenuItem value={"Customer A"}>Customer A</MenuItem>
                                <MenuItem value={"Customer B"}>Customer B</MenuItem>
                                <MenuItem value={"Customer C"}>Customer C</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="report-dimension-label">Report Dimension</InputLabel>
                            <Select
                                labelId="report-dimension-label"
                                value={reportDimension}
                                label="Report Dimension"
                                onChange={(e) => setReportDimension(e.target.value)}
                            >
                                <MenuItem value={"Chain"}>Chain</MenuItem>
                                <MenuItem value={"State"}>State</MenuItem>
                                <MenuItem value={"PO Wise"}>PO Wise</MenuItem>
                                <MenuItem value={"State Wise"}>State Wise</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="report-type-label">Report Type</InputLabel>
                            <Select
                                labelId="report-type-label"
                                value={reportType}
                                label="Report Type"
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <MenuItem value={"Screen"}>
                                    <ListItemIcon>
                                        <ScreenIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Screen" />
                                </MenuItem>
                                <MenuItem value={"Excel"}>
                                    <ListItemIcon>
                                        <ExcelIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Excel" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                            Generate Report
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {reportType === "Screen" && reportData.length > 0 && (
                <Card className="report-card">
                    <CardContent>
                        <Typography variant="h6">Report</Typography>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Customer</th>
                                    <th>Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{dayjs(row.date).format("DD/MM/YYYY")}</td>
                                        <td>{row.customer}</td>
                                        <td>{row.sales}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ReportPOVsSales;