// game.js

const startButton = document.getElementById("start-button");
const startOverButton = document.getElementById("start-over-button");
const sequenceBox = document.getElementById("sequence-box");
const colorBox = document.getElementById("color-box");
const scoreElement = document.getElementById("score");
const overlay = document.getElementById("overlay"); // The black overlay
const highScoreElement = document.getElementById("high-score"); // High score element

const colorOptions = ["red", "blue", "green", "yellow", "purple", "orange"];
let sequence = [];
let playerSequence = [];
let score = 0;

// Retrieve the saved high score from localStorage (if it exists)
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = highScore;

// Start the game
startButton.addEventListener("click", startGame);

// Start Over game
startOverButton.addEventListener("click", startOver);

// Function to update the high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;

        // Save the new high score to localStorage
        localStorage.setItem("highScore", highScore);
    }
}

// Function to start the game
function startGame() {
    score = 0;
    scoreElement.textContent = score;
    sequence = [];
    playerSequence = [];
    nextRound();
}

// Function to start over the game
function startOver() {
    score = 0;
    scoreElement.textContent = score;
    sequence = [];
    playerSequence = [];
    sequenceBox.style.opacity = 1; // Make sure the sequence box is visible again
    sequenceBox.style.display = "block"; // Ensure the sequence box is visible
    overlay.style.display = "none"; // Hide the overlay
    colorBox.innerHTML = ""; // Clear color blocks from the bottom
    colorBox.removeEventListener("click", handlePlayerClick); // Remove any click handlers
    alert("Game Restarted!"); // Optional: Show a message indicating the game is restarted
    nextRound(); // Start a new round
}

// Function to show the next round's color sequence
function nextRound() {
    playerSequence = [];
    const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    sequence.push(randomColor);

    // Display the sequence in the top box
    showSequence();
}

// Function to display the sequence of colors, one at a time
function showSequence() {
    sequenceBox.innerHTML = ""; // Clear the previous sequence
    let index = 0;

    // Display one color at a time, then remove it before showing the next one
    const interval = setInterval(() => {
        const color = sequence[index];
        createColorBlock(color, sequenceBox); // Show the current color in the sequence

        // After 500ms, remove the color from the sequence box
        setTimeout(() => {
            sequenceBox.innerHTML = ""; // Clear the sequence box
        }, 500);

        index++;

        if (index === sequence.length) {
            clearInterval(interval);

            // Hide the sequence box and overlay after the sequence is complete
            setTimeout(() => {
                sequenceBox.style.display = "none"; // Hide the sequence box
                overlay.style.display = "block"; // Show the black overlay
                enablePlayerInput(); // Allow user to start clicking the color blocks
            }, 500); // Wait 0.5 second after the last sequence color before hiding
        }
    }, 1000); // Show each color for 1 second
}

// Function to create color blocks for the sequence or options
function createColorBlock(color, container) {
    const block = document.createElement("div");
    block.classList.add("color-block");
    block.style.backgroundColor = color;
    block.setAttribute("data-color", color); // Store the color name as a data attribute
    container.appendChild(block);
}

// Function to enable player interaction with the color options
function enablePlayerInput() {
    // Show the color blocks at the bottom
    overlay.style.display = "none"; // Hide the overlay
    colorBox.innerHTML = ""; // Clear previous blocks in the bottom box
    colorOptions.forEach(color => {
        createColorBlock(color, colorBox);
    });

    // Enable click interaction
    colorBox.addEventListener("click", handlePlayerClick);
}

// Handle the player's color click
function handlePlayerClick(event) {
    if (event.target.classList.contains("color-block")) {
        const colorClicked = event.target.getAttribute("data-color"); // Get the color from data attribute
        playerSequence.push(colorClicked);

        // Check if the sequence matches
        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            alert("Game Over! Your score: " + score);

            // Update the high score
            updateHighScore();

            startOver(); // Restart the game after game over
            return;
        }

        // If the player completed the sequence, move to the next round
        if (playerSequence.length === sequence.length) {
            score++;
            scoreElement.textContent = score;
            colorBox.removeEventListener("click", handlePlayerClick);
            setTimeout(() => {
                sequenceBox.style.display = "block"; // Show the sequence box again
                overlay.style.display = "none"; // Hide the overlay again
                nextRound();
            }, 1000); // Wait 1 second before starting the next round
        }
    }
}
