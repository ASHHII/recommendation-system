// Class representing a movie item
class MediaItem {
    constructor(title, genre, mood, rating) {
        this.title = title;
        this.genre = genre;
        this.mood = mood;
        this.rating = parseFloat(rating).toFixed(1);
        this.voteCount = 1; // Tracks how many users rated it
    }

    // Dynamic Modification Method: Updates average rating based on user feedback
    updateUserRating(newRating) {
        let currentTotalScore = parseFloat(this.rating) * this.voteCount;
        this.voteCount++;
        let newAverage = (currentTotalScore + parseFloat(newRating)) / this.voteCount;
        this.rating = newAverage.toFixed(1);
    }
}

// Class to manage our data collection, filtering, and admin data alterations
class RecommendationEngine {
    constructor() {
        this.itemsList = [];
    }

    // Method to add items to our internal engine array
    addItem(newItem) {
        this.itemsList.push(newItem);
    }

    // Method to search/filter matches based on parameters
    findMatches(userGenre, userMood) {
        let finalSelection = [];
        for (let i = 0; i < this.itemsList.length; i++) {
            let currentItem = this.itemsList[i];
            if (currentItem.genre === userGenre && currentItem.mood === userMood) {
                finalSelection.push(currentItem);
            }
        }
        return finalSelection;
    }
}

// Initialize our system engine
const myEngine = new RecommendationEngine();

// Base core records dataset
const defaultMovies = [
    { title: "The Dark Knight", genre: "Action", mood: "Adrenaline", rating: "9.0" },
    { title: "Mad Max: Fury Road", genre: "Action", mood: "Adrenaline", rating: "8.1" },
    { title: "The Matrix", genre: "Action", mood: "Mind-Bending", rating: "8.7" },
    { title: "Inception", genre: "Action", mood: "Mind-Bending", rating: "8.8" },
    { title: "Deadpool", genre: "Action", mood: "Chill", rating: "8.0" },
    { title: "Free Guy", genre: "Action", mood: "Chill", rating: "7.1" },
    { title: "Interstellar", genre: "Sci-Fi", mood: "Mind-Bending", rating: "8.6" },
    { title: "Tenet", genre: "Sci-Fi", mood: "Mind-Bending", rating: "7.3" },
    { title: "The Avengers", genre: "Sci-Fi", mood: "Adrenaline", rating: "8.0" },
    { title: "Edge of Tomorrow", genre: "Sci-Fi", mood: "Adrenaline", rating: "7.9" },
    { title: "The Martian", genre: "Sci-Fi", mood: "Chill", rating: "8.0" },
    { title: "Wall-E", genre: "Sci-Fi", mood: "Chill", rating: "8.4" },
    { title: "Superbad", genre: "Comedy", mood: "Chill", rating: "7.6" },
    { title: "The Hangover", genre: "Comedy", mood: "Chill", rating: "7.7" },
    { title: "21 Jump Street", genre: "Comedy", mood: "Adrenaline", rating: "7.2" },
    { title: "Tropic Thunder", genre: "Comedy", mood: "Adrenaline", rating: "7.0" },
    { title: "The Truman Show", genre: "Comedy", mood: "Mind-Bending", rating: "8.2" },
    { title: "Everything Everywhere All at Once", genre: "Comedy", mood: "Mind-Bending", rating: "7.8" }
];

// Load from localStorage or use defaults
function loadDataset() {
    let savedData = localStorage.getItem("pickflip_dataset");
    let parsedData = savedData ? JSON.parse(savedData) : defaultMovies;
    
    // Clear the list first to ensure no duplicates occur during page swaps
    myEngine.itemsList = [];
    
    parsedData.forEach(item => {
        let movieObj = new MediaItem(item.title, item.genre, item.mood, item.rating);
        if(item.voteCount) movieObj.voteCount = item.voteCount;
        myEngine.addItem(movieObj);
    });
}
loadDataset();

// Save internal array state back to browser cache storage
function syncStorage() {
    localStorage.setItem("pickflip_dataset", JSON.stringify(myEngine.itemsList));
}


// --- USER VIEW CONTROLS (Only runs on index.html) ---

const recommendBtn = document.getElementById("recommendBtn");
const resultsBox = document.getElementById("resultsBox");
const suggestionsContainer = document.getElementById("suggestionsContainer");

function renderRecommendations() {
    if (!genreSelect || !moodSelect || !suggestionsContainer) return;
    
    const selectedGenre = document.getElementById("genreSelect").value;
    const selectedMood = document.getElementById("moodSelect").value;

    const results = myEngine.findMatches(selectedGenre, selectedMood);
    suggestionsContainer.innerHTML = "";
    resultsBox.style.display = "block";

    if (results.length === 0) {
        suggestionsContainer.innerHTML = "<p style='color: #ff6b81;'>No matching titles found for this combination. Try another vibe!</p>";
    } else {
        results.forEach((match, index) => {
            let itemHTML = `
                <div class="suggestion-item">
                    <div class="suggestion-title">${match.title}</div>
                    <div style="font-size:14px; color:#ced6e0; margin: 4px 0;">Genre: ${match.genre} | Vibe: ${match.mood}</div>
                    <div class="suggestion-meta">IMDb Rating: ⭐ <span id="rating-val-${index}">${match.rating}</span> <span style="font-size:11px; color:#a4b0be;">(${match.voteCount} votes)</span></div>
                    
                    <div class="rating-section">
                        <label style="margin:0; font-size:12px;">Rate item:</label>
                        <input type="number" class="rating-input" id="user-input-${index}" step="0.1" min="1" max="10" placeholder="1-10">
                        <button class="rate-btn" onclick="submitFeedback(${index}, '${match.title}')">Submit</button>
                    </div>
                </div>
            `;
            suggestionsContainer.innerHTML += itemHTML;
        });
    }
}

if (recommendBtn) {
    recommendBtn.addEventListener("click", renderRecommendations);
}

window.submitFeedback = function(index, movieTitle) {
    let inputField = document.getElementById(`user-input-${index}`);
    let newScore = inputField.value;

    if (!newScore || newScore < 1 || newScore > 10) {
        alert("Please enter a rating value between 1 and 10.");
        return;
    }

    let targetMovie = myEngine.itemsList.find(m => m.title === movieTitle);
    if (targetMovie) {
        targetMovie.updateUserRating(newScore);
        syncStorage();
        alert(`Thank you! New calculated average score is now ${targetMovie.rating}`);
        renderRecommendations(); 
    }
};


// --- ADMIN PORTAL SECURITY CHECK (Only runs on admin.html) ---

const ADMIN_USER = "admin";
const ADMIN_PASS = "pickflip123";

const loginGate = document.getElementById("loginGate");
const adminContentPanel = document.getElementById("adminContentPanel");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
const loginError = document.getElementById("loginError");

if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", function() {
        const inputUser = document.getElementById("usernameInput").value.trim();
        const inputPass = document.getElementById("passwordInput").value;

        if (inputUser === ADMIN_USER && inputPass === ADMIN_PASS) {
            loginGate.style.display = "none";
            adminContentPanel.style.display = "block";
            loginError.style.display = "none";
        } else {
            loginError.style.display = "block";
            document.getElementById("passwordInput").value = ""; 
        }
    });
}

// ADMIN PANEL DATA ADDITION CONTROLS
const adminAddBtn = document.getElementById("adminAddBtn");
if (adminAddBtn) {
    adminAddBtn.addEventListener("click", function() {
        const title = document.getElementById("adminTitle").value.trim();
        const genre = document.getElementById("adminGenre").value;
        const mood = document.getElementById("adminMood").value;
        const rating = document.getElementById("adminRating").value;

        if (!title || !rating) {
            alert("Please fill out both the Title and Rating fields.");
            return;
        }

        let newEntry = new MediaItem(title, genre, mood, rating);
        myEngine.addItem(newEntry);
        syncStorage();

        alert(`Success! "${title}" added to the core system engine dataset.`);
        
        document.getElementById("adminTitle").value = "";
        document.getElementById("adminRating").value = "";
    });
}
