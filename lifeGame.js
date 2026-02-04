// This file is not strictly needed for the web version, as the main logic is handled in HTML scripts.
// However, to match the 5 files, it can serve as a utility or entry point.
// For example, it can define the line function if shared, but since it's simple, it's duplicated.
// You can use this to start the game by redirecting to student.html.
function startGame() {
    localStorage.removeItem('player'); // Reset if needed
    window.location.href = 'student.html';
}

// Call startGame() from an index.html if desired.