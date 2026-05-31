// Class representing a movie or book item
class MediaItem {
    constructor(title, genre, mood, rating) {
        this.title = title;
        this.genre = genre;
        this.mood = mood;
        this.rating = rating;
    }
}

// Class to manage our data collection and filter logic
class RecommendationEngine {
    constructor() {
        this.itemsList = [];
    }

    // Method to add items to our internal array
    addItem(newItem) {
        this.itemsList.push(newItem);
    }

    // Method to filter data based on dropdown selections
    findMatches(userGenre, userMood) {
        let finalSelection = [];

        // Simple loop to check every item in our array
        for (let i = 0; i < this.itemsList.length; i++) {
            let currentItem = this.itemsList[i];
            
            // Check if both the genre and mood match what the user selected
            if (currentItem.genre === userGenre && currentItem.mood === userMood) {
                finalSelection.push(currentItem);
            }
        }
        return finalSelection;
    }
}

// Initialize our system
const myEngine = new RecommendationEngine();

// --- UPDATED DATASET: Movies for EVERY single combination ---

// 1. ACTION Matches
myEngine.addItem(new MediaItem("The Dark Knight", "Action", "Adrenaline", "9.0"));
myEngine.addItem(new MediaItem("Mad Max: Fury Road", "Action", "Adrenaline", "8.1"));
myEngine.addItem(new MediaItem("The Matrix", "Action", "Mind-Bending", "8.7"));
myEngine.addItem(new MediaItem("Inception", "Action", "Mind-Bending", "8.8"));
myEngine.addItem(new MediaItem("Deadpool", "Action", "Chill", "8.0"));
myEngine.addItem(new MediaItem("Free Guy", "Action", "Chill", "7.1"));

// 2. SCI-FI Matches
myEngine.addItem(new MediaItem("Interstellar", "Sci-Fi", "Mind-Bending", "8.6"));
myEngine.addItem(new MediaItem("Tenet", "Sci-Fi", "Mind-Bending", "7.3"));
myEngine.addItem(new MediaItem("The Avengers", "Sci-Fi", "Adrenaline", "8.0"));
myEngine.addItem(new MediaItem("Edge of Tomorrow", "Sci-Fi", "Adrenaline", "7.9"));
myEngine.addItem(new MediaItem("The Martian", "Sci-Fi", "Chill", "8.0"));
myEngine.addItem(new MediaItem("Wall-E", "Sci-Fi", "Chill", "8.4"));

// 3. COMEDY Matches
myEngine.addItem(new MediaItem("Superbad", "Comedy", "Chill", "7.6"));
myEngine.addItem(new MediaItem("The Hangover", "Comedy", "Chill", "7.7"));
myEngine.addItem(new MediaItem("21 Jump Street", "Comedy", "Adrenaline", "7.2"));
myEngine.addItem(new MediaItem("Tropic Thunder", "Comedy", "Adrenaline", "7.0"));
myEngine.addItem(new MediaItem("The Truman Show", "Comedy", "Mind-Bending", "8.2"));
myEngine.addItem(new MediaItem("Everything Everywhere All at Once", "Comedy", "Mind-Bending", "7.8"));


// --- DOM MANIPULATION (Connecting the UI elements to our logic) ---

const recommendBtn = document.getElementById("recommendBtn");
const resultsBox = document.getElementById("resultsBox");
const suggestionsContainer = document.getElementById("suggestionsContainer");

recommendBtn.addEventListener("click", function() {
    // Get the values current selected in the dropdowns
    const selectedGenre = document.getElementById("genreSelect").value;
    const selectedMood = document.getElementById("moodSelect").value;

    // Call our class method to filter matches
    const results = myEngine.findMatches(selectedGenre, selectedMood);

    // Clear previous results before showing new ones
    suggestionsContainer.innerHTML = "";
    resultsBox.style.display = "block";

    if (results.length === 0) {
        suggestionsContainer.innerHTML = "<p style='color: #ff6b81;'>No matching titles found for this combination. Try another vibe!</p>";
    } else {
        // Loop through matches and inject them into the HTML page
        for (let j = 0; j < results.length; j++) {
            let match = results[j];
            
            let itemHTML = `
                <div class="suggestion-item">
                    <div class="suggestion-title">${match.title}</div>
                    <div class="suggestion-meta">IMDb Rating: ⭐ ${match.rating}</div>
                </div>
            `;
            suggestionsContainer.innerHTML += itemHTML;
        }
    }
});
