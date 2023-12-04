import React, { useState } from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  localStorage.clear();
  const [ig, setIG] = useState("");
  const [guess, setGuess] = useState("");
  const [errormsg, setErrorMessage] = useState("");

  // React Router navigation hook
  const navigate = useNavigate();

  // Function to handle form submission
  const submitGuess = (e) => {
    e.preventDefault();

    // Reset error message
    setErrorMessage("");
    
    const int_guess = parseInt(guess, 10)
    if (guess.length !== 4 || isNaN(int_guess) || !Number.isInteger(int_guess)) {
      setErrorMessage("Code must be 4 digits");
      // Reset input fields
      setGuess("");
      return;
    }

    
    if (!isNaN(int_guess) && Number.isInteger(int_guess)){
      setErrorMessage("");
      // Reset input fields
      setGuess("");
      return;
    }

    if (!ig.includes("@")) {
      setErrorMessage("Enter a valid ig username (with an @)");
      // Reset input fields
      setIG("");
      return;
    }


    // console.log("Form submitted with IG:", ig, "and Guess:", guess);

    fetch(`/api/winner/code/${guess}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.winid === 0) {
          console.log("Wrong guess");
          navigate("/loser/");
        } else {
          console.log("Correct guess");
          // store user in table called winners
          localStorage.setItem("user", JSON.stringify(ig));
          localStorage.setItem("guessid", JSON.stringify(data.winid));
          navigate("/winner/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Log the actual response for debugging purposes
        error.response.text().then((text) => {
          console.error("Response:", text);
        });
      });
  };

  return (
    <div className="guess-container">
      <div className="guess-card">
        <h2>Motion Code Guesser</h2>
        <form onSubmit={submitGuess}>
          <div className="input-group">
            <input
              type="text"
              placeholder="@Instagram_Username"
              value={ig}
              onChange={(e) => setIG(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Your Guess"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              required
            />
          </div>
          {errormsg && <p className="error-message">{errormsg}</p>}
          <button type="submit" className="btn">
            Guess
          </button>
          {/* <div className="buy-tickets-section"> */}
          {/* <button className="buy-tickets-btn">
            <a href="https://ticketlinkz.com/events/motion-the-cruise/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              Buy Tickets
            </a>
          </button> */}
        {/* </div> */}
        </form>
      </div>
    </div>
  );
}

export default Home;
