import React, { useEffect, useState } from "react";
import "../custom_css/homeTiles.css";
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import axios from 'axios';
import DashboardService from '../axios/services/api/dashboard';
import { useSelector } from "react-redux";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HomeTiles = () => {
    const today = new Intl.DateTimeFormat('en-CA').format(new Date());
    const [errorPOs, setErrorPOs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(today);
    const [filesProcessedData, setFilesProcessedData] = useState([]);
    const [poPushedData, setPoPushedData] = useState([]);
    const userProfile = useSelector((state) => state.userProfile);

    useEffect(() => {
        console.log("Date-------->>>>", selectedDate);
        fetchErrorPOs(selectedDate);
        fetchChartData();
    }, [selectedDate]);

    const fetchErrorPOs = (date) => {
        DashboardService.getDashboardErrorTiles({ userProfile, selectedDate: date })
            .then(response => {
                console.log(response.data.data.error_tile);
                const errorData = response.data.data.error_tile;
                if (Array.isArray(errorData)) {
                    setErrorPOs(errorData);
                } else {
                    setErrorPOs([]); // Set an empty array if data is invalid
                }
            })
            .catch(error => {
                console.error('Error fetching data', error);
                setErrorPOs([]); // Set an empty array if data is invalid
            });
    };

    const fetchChartData = () => {
        DashboardService.getDashboardChartData( userProfile)
            .then(response => {

                console.log('files_processed',response.data.data.files_processed);
                setFilesProcessedData(response.data.data.files_processed);
                setPoPushedData(response.data.data.po_pushed);
            })
            .catch(error => {
                console.error('Error fetching chart data', error);
            });
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(new Intl.DateTimeFormat('en-CA').format(newDate));
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-IN').format(value);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Daily Statistics',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Process Date',
                },
                ticks: {
                    maxTicksLimit: 10,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'File Count',
                },
            },
        },
    };

    const combinedChartData = {
        labels: filesProcessedData.map(item => item.file_process_date),
        datasets: [
            {
                label: 'Files Processed',
                data: filesProcessedData.map(item => item.file_count),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'PO Pushed to ERP',
                data: poPushedData.map(item => item.po_count),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };


    const filesProcessedChartData = {
        labels: filesProcessedData.map(item => item.po_process_date),
        datasets: [
            {
                label: 'Files Processed',
                data: filesProcessedData.map(item => item.po_count),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const poPushedChartData = {
        labels: poPushedData.map(item => item.po_process_date),
        datasets: [
            {
                label: 'PO Pushed to ERP',
                data: poPushedData.map(item => item.po_count),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    return (
        <div className="container-home">
            <div className="box-container">
                <Card className="box shadow-lg rounded-xl">
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Error POs</Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Select Date"
                                    value={new Date(selectedDate)}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <Button {...params} />}
                                />
                            </LocalizationProvider>
                        </Box>
                        <table className="box-table">
                            <thead>
                                <tr>
                                    <th className="row" style={{ backgroundColor: "red", fontWeight: "normal", color: "white", borderColor: "black" }}>Customer</th>
                                    <th className="row" style={{ backgroundColor: "red", fontWeight: "normal", color: "white", borderColor: "black" }}>PO Count</th>
                                    <th className="row" style={{ backgroundColor: "red", fontWeight: "normal", color: "white", borderColor: "black" }}>PO Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {errorPOs.map((po, index) => (
                                    <tr key={index}>
                                        <td>{po.chain_name}</td>
                                        <td>{formatNumber(po.error_po_count)}</td>
                                        <td className="currency-format">{formatNumber(po.po_value)}</td>
                                    </tr>
                                ))}
                                <tr className="row-total">
                                    <td style={{ backgroundColor: "red", fontWeight: "bold", color: "white", borderColor: "black" }}>Total</td>
                                    <td style={{ backgroundColor: "red", fontWeight: "bold", color: "white", borderColor: "black" }}>
                                        {formatNumber(errorPOs.reduce((sum, po) => sum + (po.error_po_count || 0), 0))}
                                    </td>
                                    <td style={{ backgroundColor: "red", fontWeight: "bold", color: "white", borderColor: "black" }} className="currency-format">
                                        {formatNumber(errorPOs.reduce((sum, po) => sum + (po.po_value || 0), 0))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <div className="box1">
                    <h3>Processed PO Today</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>PO Count</th>
                                <th>PO Value</th>
                            </tr>
                        </thead>
                    </table>
                </div>

                <div className="box2">
                    <h3>Processed PO This Month</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>PO Count</th>
                                <th>PO Value</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <div className="chart-container">
                <Card className="chart-box shadow-lg rounded-xl">
                    <CardContent>
                        <Typography variant="h6">Day-wise Statistics</Typography>
                        <div className="chart-wrapper">
                            <Line options={chartOptions} data={combinedChartData} />
                        </div>
                    </CardContent>
                </Card>
            </div>
   
        </div>
    );
};

export default HomeTiles;