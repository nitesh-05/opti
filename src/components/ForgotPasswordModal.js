import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, IconButton,CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import AuthService from '../axios/services/api/auth';
import '../custom_css/forgotPasswordModal.css';


const ForgotPasswordModal = ({ open, handleClose }) => {
    const [userId, setUserId] = useState("");
    const [userIdError, setUserIdError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (userId === "") {
            setUserIdError(true);
        } else {
            setUserIdError(false);
            setLoading(true);
            try {
                const response = await AuthService.forgotPassword(userId);
                console.log('forgot Password ------>>',response.data.data.response.message);
                Swal.fire("Opti Chain", response.data.data.response.message);
                handleClose();
            } catch (error) {
                Swal.fire("Error", "Failed to send password reset email. Please try again.", "error");
            }finally{
                setLoading(false);  
            }
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            BackdropProps={{
                onClick: (e) => e.stopPropagation(), // Disable closing on backdrop click
            }}
            aria-labelledby="forgot-password-modal-title"
            aria-describedby="forgot-password-modal-description"
        >
            <Box className="modal-box">
                <IconButton className="close-icon" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Typography id="forgot-password-modal-title" variant="h6" component="h2">
                    Forgot Password
                </Typography>
                <TextField
                    required
                    error={userIdError}
                    helperText={userIdError ? "User ID is required" : ""}
                    label="User ID"
                    fullWidth
                    margin="normal"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSend} sx={{ ml: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ForgotPasswordModal;