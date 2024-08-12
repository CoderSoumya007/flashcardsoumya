import React, { useState } from 'react';
import './Flashcard.css';
import { FaEdit } from 'react-icons/fa';

const Flashcard = ({ id, question, answer, updateFlashcard, deleteFlashcard }) => {
  const [flipped, setFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState(question);
  const [editAnswer, setEditAnswer] = useState(answer);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); 
    setIsEditing(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateFlashcard({ id, question: editQuestion, answer: editAnswer });
    setIsEditing(false);
    setFlipped(false); 
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcard(id);
    }
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        {isEditing ? (
          <div className="edit-form-container">
            <form className="edit-form" onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                placeholder="Edit question"
                required
              />
              <input
                type="text"
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                placeholder="Edit answer"
                required
              />
              <div className="edit-form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="edit-icon" onClick={handleEditClick}>
              <FaEdit />
            </div>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                {question}
              </div>
              <div className="flashcard-back">
                {answer}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
