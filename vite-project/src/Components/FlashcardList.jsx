import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import FlashcardForm from './FlashcardForm';
import './FlashcardList.css';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://ec2-13-48-248-187.eu-north-1.compute.amazonaws.com:5000/api/flashcards')
      .then((response) => response.json())
      .then((data) => {
        setFlashcards(data);
        setLoading(false);
      }).catch((error) => {
        console.error("There was an error fetching the flashcards!", error);
        setLoading(false);
      });
  }, []);

  const addFlashcard = (newFlashcard) => {
    fetch('http://ec2-13-48-248-187.eu-north-1.compute.amazonaws.com:5000/api/flashcards', {
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
    fetch(`http://ec2-13-48-248-187.eu-north-1.compute.amazonaws.com:5000/api/flashcards/${updatedFlashcard.id}`, {
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
    fetch(`http://ec2-13-48-248-187.eu-north-1.compute.amazonaws.com:5000/api/flashcards/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setFlashcards(flashcards.filter((card) => card.id !== id));
    });
  };

  const showNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const showPreviousCard = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashcards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flashcard-list">
      <FlashcardForm addFlashcard={addFlashcard} />
      <div className='card-container'>
        {loading ? (
          <>
            <span className="loader"></span>
            <p style={{ "color": "black" }}>Loading...</p>
          </>
        ) : (
          <>
            <div className="main-flashcard">
              {flashcards.length > 0 && (
                <Flashcard
                  key={flashcards[currentIndex].id}
                  {...flashcards[currentIndex]}
                  updateFlashcard={updateFlashcard}
                  deleteFlashcard={deleteFlashcard}
                />
              )}
              <div className="navigation-buttons">
              <button onClick={showPreviousCard}>Prev</button>
              <button onClick={showNextCard}>Next</button>
            </div>
            </div>
            <div className="flashcard-grid">
              {flashcards.map((card) => (
                <Flashcard
                  key={card.id}
                  {...card}
                  updateFlashcard={updateFlashcard}
                  deleteFlashcard={deleteFlashcard}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
  
};

export default FlashcardList;
