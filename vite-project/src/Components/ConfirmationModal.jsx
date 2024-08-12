import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure you want to delete this flashcard?</h3>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>Yes, Delete</button>
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
