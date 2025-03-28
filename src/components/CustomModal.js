import React from 'react';
import '../custom_css/CustomModal.css';

const CustomModal = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="modal-icon">
            <img src="warning-icon.png" alt="Warning" />
          </div>
          <div className="modal-message">
            {message}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-confirm" onClick={onConfirm}>OK</button>
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;