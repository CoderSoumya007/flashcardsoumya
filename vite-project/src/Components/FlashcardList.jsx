import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';
import './FlashcardList.css';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    fetch('https://flashcardsoumya.onrender.com/api/flashcards')
      .then((response) => response.json())
      .then((data) => setFlashcards(data));
  }, []);

  const addFlashcard = (newFlashcard) => {
    fetch('https://flashcardsoumya.onrender.com/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFlashcard),
    })
      .then((response) => response.json())
      .then((addedFlashcard) => {
        setFlashcards([...flashcards, addedFlashcard]);
      });
  };

  const updateFlashcard = (updatedFlashcard) => {
    fetch(`https://flashcardsoumya.onrender.com/api/flashcards/${updatedFlashcard.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFlashcard),
    }).then(() => {
      setFlashcards(
        flashcards.map((card) =>
          card.id === updatedFlashcard.id ? updatedFlashcard : card
        )
      );
    });
  };

  const deleteFlashcard = (id) => {
    fetch(`https://flashcardsoumya.onrender.com/api/flashcards/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setFlashcards(flashcards.filter((card) => card.id !== id));
    });
  };

  return (
    <div className="flashcard-list">
      <FlashcardForm addFlashcard={addFlashcard} />
      {flashcards.map((card) => (
        <Flashcard
          key={card.id}
          {...card}
          updateFlashcard={updateFlashcard}
          deleteFlashcard={deleteFlashcard}
        />
      ))}
    </div>
  );
};

export default FlashcardList;
