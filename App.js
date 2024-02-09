import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import './App.css'; // Make sure this import is present for styling

function App() {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const drawInterval = useRef(null);

  useEffect(() => {
    fetchNewDeck();
    return () => clearInterval(drawInterval.current); // Cleanup on unmount
  }, []);

  const fetchNewDeck = async () => {
    setIsDrawing(false); // Ensure drawing is stopped when fetching a new deck
    clearInterval(drawInterval.current); // Stop any ongoing drawing
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    setDeck(data);
    setCards([]);
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
    if (!isDrawing) {
      drawInterval.current = setInterval(drawCard, 1000);
    } else {
      clearInterval(drawInterval.current);
    }
  };

  const drawCard = async () => {
    if (!deck || deck.remaining === 0) {
      alert("Error: no cards remaining!");
      clearInterval(drawInterval.current);
      setIsDrawing(false);
      return;
    }

    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
    const data = await response.json();

    if (data.success && data.cards.length > 0) {
      setCards(prevCards => [...prevCards, data.cards[0]]);
    } else {
      alert("Error: no cards remaining!");
      clearInterval(drawInterval.current);
      setIsDrawing(false);
    }
  };

  return (
    <div className="App">
      <h2>Deck of Cards</h2>
      <div className="card-area">
        {cards.map((card, index) => (
          <Card
            key={card.code}
            image={card.image}
            alt={`${card.value} of ${card.suit}`}
            style={{
              transform: `rotate(${(index - cards.length / 2) * 5}deg)`,
              zIndex: index,
            }}
          />
        ))}
      </div>
      <button onClick={toggleDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</button>
      <button onClick={fetchNewDeck} disabled={isDrawing}>Shuffle Deck</button>
    </div>
  );
}

export default App;