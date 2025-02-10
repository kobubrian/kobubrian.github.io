<Style>
/* styles.css */

/* Custom CSS variables */
:root {
  --primary-color: #ff4081;
  --primary-hover: #ff79a9;
  /* Pronounced gradient between deep purple and vibrant blue */
  --bg-gradient: linear-gradient(135deg, #8e44ad, #3498db);
  --text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  --cell-size: 70px;
}

/* Global styles */
body {
  font-family: 'Poppins', sans-serif;
  background: var(--bg-gradient);
  color: #fff;
  text-align: center;
  padding: 20px;
  margin: 0;
  overflow-x: hidden;
  transition: background 0.5s ease;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: var(--text-shadow);
  animation: fadeInDown 1s ease-out;
}

/* Input sections */
.input-section {
  margin: 20px auto;
  padding: 15px;
  max-width: 400px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1.2s ease-out;
}

/* Buttons */
button {
  background: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s ease, background 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

button:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

/* Feedback panels */
#feedback, 
#guessFeedback {
  margin: 10px auto;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.25);
  max-width: 400px;
  border-radius: 8px;
  font-family: monospace;
  animation: fadeIn 1s ease-out;
}

/* Outer grid table styling */
table {
  border-collapse: collapse;
  margin: 20px auto;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  animation: scaleUp 1s ease-out;
}

th, td {
  border: 2px solid rgba(255, 255, 255, 0.7);
  width: var(--cell-size);
  height: var(--cell-size);
  text-align: center;
  vertical-align: middle;
  font-family: monospace;
  font-size: 50px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

th {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Beam animation classes for "rays" */
.beam-entry {
  animation: beamGlow 0.6s ease-in-out infinite alternate;
}

.beam-exit {
  animation: beamExitGlow 1s ease-in-out;
}

.beam-split {
  background: linear-gradient(to bottom right, rgba(255, 255, 0, 0.7) 50%, rgba(0, 255, 0, 0.7) 50%);
}

/* (When "Show Rays" is OFF, the instant mode will simply mark the exit cell.
   No CSS modifications are necessary here because the JS will compute instantly.) */

/* Hidden triangle cell styling (before revealed) */
.triangle {
  background: transparent;
}

/* Wedge element for revealed triangles */
.triangle .wedge {
  width: 100%;
  height: 100%;
  background: red;
}

/* Right triangle shapes using clip-path */
.wedge-tl {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.wedge-tr {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.wedge-bl {
  clip-path: polygon(0 0, 0 100%, 100% 100%);
}

.wedge-br {
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* Preview triangle styling */
.preview-triangle {
  position: absolute;
  width: var(--cell-size);
  height: var(--cell-size);
  background: rgba(255, 0, 0, 0.5);
  pointer-events: none;
  display: none;
  transition: top 0.1s, left 0.1s;
}

.preview-tl {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.preview-tr {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.preview-bl {
  clip-path: polygon(0 0, 0 100%, 100% 100%);
}

.preview-br {
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* Keyframe animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}

@keyframes beamGlow {
  0% { background-color: yellow; }
  100% { background-color: rgba(255, 255, 0, 0.5); }
}

@keyframes beamExitGlow {
  0% { background-color: green; }
  100% { background-color: rgba(0, 255, 0, 0.5); }
}  
  
<Style>
  



/* script.js */
/*MADE BY ACHINTI*/
// Global flag for whether to animate the beam ("rays") or not.
let raysEnabled = false;
let previewOrientation = "tl"; // Initial orientation for the preview triangle

document.addEventListener("DOMContentLoaded", () => {
  // Set up the toggle switch for showing/hiding rays.
  const toggle = document.getElementById("toggleRays");
  toggle.addEventListener("change", () => {
    raysEnabled = toggle.checked;
  });
  
  newGame();
  setupPreviewTriangle();
});

// CONFIGURATION & GLOBAL VARIABLES
const rows = 4;
const cols = 4;
const topLabels = ["A", "B", "C", "D"];
const leftLabels = ["1", "2", "3", "4"];
const rightLabels = ["5", "6", "7", "8"];
const bottomLabels = ["E", "F", "G", "H"];

let gridData;       // 2D array for triangles (each cell: null or a corner symbol)
let totalTriangles; // number of triangles left to be found
let guessCount, shotCount;

// Start a new game.
function newGame() {
  totalTriangles = 3;
  guessCount = 0;
  shotCount = 0;
  updateFeedback("feedback", "<strong>Shot Feedback:</strong><br/>");
  updateFeedback("guessFeedback", "<strong>Guess Feedback:</strong><br/>");
  gridData = Array.from({ length: rows }, () => Array(cols).fill(null));
  placeTriangles();
  buildOuterGrid();
  resetBeamCells();
}

// Randomly place 3 triangles with one of four corner types.
function placeTriangles() {
  const corners = ["┌", "┐", "└", "┘"];
  let count = 0;
  while (count < 3) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!gridData[r][c]) {
      gridData[r][c] = corners[Math.floor(Math.random() * corners.length)];
      count++;
    }
  }
}

// Build the game grid (a 6x6 table with axis labels).
// The header (th) cells fire beams; inner grid (td) cells are for guessing.
function buildOuterGrid() {
  const outer = document.getElementById("outerGrid");
  outer.innerHTML = "";
  
  // Top row with labels.
  let topRow = document.createElement("tr");
  topRow.appendChild(document.createElement("th")); // empty corner
  for (let c = 0; c < cols; c++) {
    let th = document.createElement("th");
    th.textContent = topLabels[c];
    th.addEventListener("click", () => {
      // Top edge: row = -1, col = c, direction = Down ("D")
      fireBeamFromEdge({ row: -1, col: c, dir: "D", label: topLabels[c] });
    });
    topRow.appendChild(th);
  }
  topRow.appendChild(document.createElement("th"));
  outer.appendChild(topRow);
  
  // Middle rows: left/right labels and inner grid cells.
  for (let r = 0; r < rows; r++) {
    let rowEl = document.createElement("tr");
    
    // Left label cell.
    let leftTh = document.createElement("th");
    leftTh.textContent = leftLabels[r];
    leftTh.addEventListener("click", () => {
      // Left edge: row = r, col = -1, direction = Right ("R")
      fireBeamFromEdge({ row: r, col: -1, dir: "R", label: leftLabels[r] });
    });
    rowEl.appendChild(leftTh);
    
    // 4 inner grid cells (for guesses).
    for (let c = 0; c < cols; c++) {
      let td = document.createElement("td");
      td.id = `${r}-${c}`;
      td.classList.add("triangle");
      // Clicking a cell makes a guess.
      td.addEventListener("click", () => {
        guessTriangleCell(r, c);
      });
      rowEl.appendChild(td);
    }
    
    // Right label cell.
    let rightTh = document.createElement("th");
    rightTh.textContent = rightLabels[r];
    rightTh.addEventListener("click", () => {
      // Right edge: row = r, col = cols, direction = Left ("L")
      fireBeamFromEdge({ row: r, col: cols, dir: "L", label: rightLabels[r] });
    });
    rowEl.appendChild(rightTh);
    outer.appendChild(rowEl);
  }
  
  // Bottom row with labels.
  let bottomRow = document.createElement("tr");
  bottomRow.appendChild(document.createElement("th"));
  for (let c = 0; c < cols; c++) {
    let th = document.createElement("th");
    th.textContent = bottomLabels[c];
    th.addEventListener("click", () => {
      // Bottom edge: row = rows, col = c, direction = Up ("U")
      fireBeamFromEdge({ row: rows, col: c, dir: "U", label: bottomLabels[c] });
    });
    bottomRow.appendChild(th);
  }
  bottomRow.appendChild(document.createElement("th"));
  outer.appendChild(bottomRow);
}

// Remove previous beam animations from all cells.
function resetBeamCells() {
  const cells = document.querySelectorAll("th, td");
  cells.forEach(cell => {
    cell.classList.remove("beam-entry", "beam-exit", "beam-split");
  });
}

// Given a triangle corner and the beam’s incoming direction, return the reflected direction.
function reflectCorner(corner, incoming) {
  if (corner === "┌") {
    if (incoming === "U") return "R";
    if (incoming === "D") return "U";
    if (incoming === "L") return "D";
    if (incoming === "R") return "L";
  }
  if (corner === "┐") {
    if (incoming === "U") return "L";
    if (incoming === "D") return "U";
    if (incoming === "L") return "R";
    if (incoming === "R") return "D";
  }
  if (corner === "└") {
    if (incoming === "U") return "D";
    if (incoming === "D") return "R";
    if (incoming === "L") return "U";
    if (incoming === "R") return "L";
  }
  if (corner === "┘") {
    if (incoming === "U") return "D";
    if (incoming === "D") return "L";
    if (incoming === "L") return "R";
    if (incoming === "R") return "U";
  }
  return incoming;
}

// Moves one step in the given direction.
function stepOne(r, c, dir) {
  if (dir === "U") r--;
  if (dir === "D") r++;
  if (dir === "L") c--;
  if (dir === "R") c++;
  return { r, c };
}

// Given row/col outside the grid, returns the corresponding exit label.
function findExitLabel(r, c) {
  if (r < 0) return topLabels[c];
  if (r >= rows) return bottomLabels[c];
  if (c < 0) return leftLabels[r];
  if (c >= cols) return rightLabels[r];
  return null;
}

// Mark a cell (or edge) with beam visuals (entry or exit).
function markBeamCell(r, c, type) {
  let cell;
  if (r < 0) {
    cell = document.querySelector(`tr:first-child th:nth-child(${c + 2})`);
  } else if (r >= rows) {
    cell = document.querySelector(`tr:last-child th:nth-child(${c + 2})`);
  } else if (c < 0) {
    cell = document.querySelector(`tr:nth-child(${r + 2}) th:first-child`);
  } else if (c >= cols) {
    cell = document.querySelector(`tr:nth-child(${r + 2}) th:last-child`);
  } else {
    cell = document.getElementById(`${r}-${c}`);
  }
  if (cell) {
    if (type === "entry") {
      if (cell.classList.contains("beam-exit")) {
        cell.classList.remove("beam-exit");
        cell.classList.add("beam-split");
      } else {
        cell.classList.add("beam-entry");
      }
    } else if (type === "exit") {
      if (cell.classList.contains("beam-entry")) {
        cell.classList.remove("beam-entry");
        cell.classList.add("beam-split");
      } else {
        cell.classList.add("beam-exit");
      }
    }
  }
}

// Animate the beam’s travel step-by-step (only used when rays are enabled).
function animateBeam(r, c, d, originalEntry) {
  setTimeout(() => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      markBeamCell(r, c, "exit");
      const exitLabel = findExitLabel(r, c);
      updateFeedback(
        "feedback",
        `<strong>Shot Fired #${shotCount}:</strong> Entered at ${originalEntry.label} (${originalEntry.dir}) Exited at ${exitLabel} (${d})<br/>`
      );
      return;
    }
    if (gridData[r][c]) {
      d = reflectCorner(gridData[r][c], d);
    }
    markBeamCell(r, c, "entry");
    let next = stepOne(r, c, d);
    animateBeam(next.r, next.c, d, originalEntry);
  }, 300);
}

// Fire a beam from an edge cell. If rays are enabled, the beam animates;
// otherwise, the result is computed instantly (with no intermediate "ray" animation).
function fireBeamFromEdge(start) {
  shotCount++;
  resetBeamCells();
  let { row: r, col: c, dir: d } = start;
  const originalEntry = { label: start.label, dir: d };
  markBeamCell(r, c, "entry");
  
  if (raysEnabled) {
    let next = stepOne(r, c, d);
    animateBeam(next.r, next.c, d, originalEntry);
  } else {
    // Compute the beam's path instantly without animation.
    let currentR = r, currentC = c, currentDir = d;
    while (true) {
      let nextPos = stepOne(currentR, currentC, currentDir);
      if (nextPos.r < 0 || nextPos.r >= rows || nextPos.c < 0 || nextPos.c >= cols) {
        markBeamCell(nextPos.r, nextPos.c, "exit");
        const exitLabel = findExitLabel(nextPos.r, nextPos.c);
        updateFeedback(
          "feedback",
          `<strong>Shot Fired #${shotCount}:</strong> Entered at ${originalEntry.label} (${originalEntry.dir}) Exited at ${exitLabel} (${currentDir})<br/>`
        );
        break;
      }
      if (gridData[nextPos.r][nextPos.c]) {
        currentDir = reflectCorner(gridData[nextPos.r][nextPos.c], currentDir);
      }
      currentR = nextPos.r;
      currentC = nextPos.c;
    }
  }
}

// When an inner grid cell is clicked, it counts as a guess.
function guessTriangleCell(r, c) {
  guessCount++;
  const cell = document.getElementById(`${r}-${c}`);
  if (!cell || cell.querySelector(".wedge")) return;  // already revealed
  
  if (gridData[r][c] && gridData[r][c] === getCornerSymbol(previewOrientation)) {
    const wedge = document.createElement("div");
    wedge.classList.add("wedge");
    switch (gridData[r][c]) {
      case "┌":
        wedge.classList.add("wedge-tl");
        break;
      case "┐":
        wedge.classList.add("wedge-tr");
        break;
      case "└":
        wedge.classList.add("wedge-bl");
        break;
      case "┘":
        wedge.classList.add("wedge-br");
        break;
      default:
        break;
    }
    cell.innerHTML = "";
    cell.appendChild(wedge);
    totalTriangles--;
    updateFeedback(
      "guessFeedback",
      `<strong>Hit!</strong> You found a triangle at [${r}-${c}].<br>
       Triangles left: ${totalTriangles}<br>
       Guesses so far: ${guessCount}`
    );
    if (totalTriangles === 0) {
      updateFeedback(
        "guessFeedback",
        `<strong>All Triangles Found!</strong><br>
         You took ${guessCount} guesses and fired ${shotCount} shots.<br>
         <button onclick="newGame()">Play Again</button>`
      );
    }
  } else if (gridData[r][c]) {
    updateFeedback(
      "guessFeedback",
      `<strong>Incorrect orientation!</strong> The triangle at [${r}-${c}] is not oriented correctly.<br>
       Guesses so far: ${guessCount}`
    );
  } else {
    updateFeedback(
      "guessFeedback",
      `<strong>Miss!</strong> No triangle at [${r}-${c}].<br>
       Guesses so far: ${guessCount}`
    );
  }
}

// Utility function to update feedback panels with a fade effect.
function updateFeedback(elementId, message) {
  const el = document.getElementById(elementId);
  el.style.opacity = 0;
  setTimeout(() => {
    el.innerHTML = message;
    el.style.opacity = 1;
  }, 300);
}

function setupPreviewTriangle() {
  const gridContainer = document.getElementById("gridContainer");
  const previewTriangle = document.createElement("div");
  previewTriangle.id = "previewTriangle";
  previewTriangle.classList.add("preview-triangle", "preview-tl");
  gridContainer.appendChild(previewTriangle);

  gridContainer.addEventListener("mousemove", (event) => {
    const cell = event.target.closest("td");
    if (cell) {
      const rect = cell.getBoundingClientRect();
      const containerRect = gridContainer.getBoundingClientRect();
      previewTriangle.style.top = `${rect.top - containerRect.top}px`;
      previewTriangle.style.left = `${rect.left - containerRect.left}px`;
      previewTriangle.style.display = "block";
    } else {
      previewTriangle.style.display = "none";
    }
  });

  gridContainer.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const orientations = ["tl", "tr", "bl", "br"];
    const currentIndex = orientations.indexOf(previewOrientation);
    previewOrientation = orientations[(currentIndex + 1) % orientations.length];
    previewTriangle.className = `preview-triangle preview-${previewOrientation}`;
  });

  gridContainer.addEventListener("click", (event) => {
    const cell = event.target.closest("td");
    if (cell) {
      const [r, c] = cell.id.split("-").map(Number);
      if (gridData[r][c]) {
        if (gridData[r][c] === getCornerSymbol(previewOrientation)) {
          guessTriangleCell(r, c);
        } else {
          updateFeedback(
            "guessFeedback",
            `<strong>Incorrect orientation!</strong> The triangle at [${r}-${c}] is not oriented as ${previewOrientation}.<br>
             Guesses so far: ${guessCount}`
          );
        }
      } else {
        updateFeedback(
          "guessFeedback",
          `<strong>Miss!</strong> No triangle at [${r}-${c}].<br>
           Guesses so far: ${guessCount}`
        );
      }
    }
  });
}

function getCornerSymbol(orientation) {
  switch (orientation) {
    case "tl": return "┌";
    case "tr": return "┐";
    case "bl": return "└";
    case "br": return "┘";
    default: return null;
  }
}
