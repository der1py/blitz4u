import { EASY_STRUCTURES } from "../src/Structures.js";

const canvas = document.getElementById("editorCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 30;

let structure = EASY_STRUCTURES[0];

// set canvas size
canvas.width = 40 * CELL_SIZE;
canvas.height = 12 * CELL_SIZE;

let selectedType = 1;
let selectedTile = null;
let isMouseDown = false;

// palette selection
document.querySelectorAll("#palette button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedType = Number(btn.dataset.type);
  });
});

// 🔑 unified paint function
function paintTile(e) {
  const rect = canvas.getBoundingClientRect();

  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  if (!structure[x] || structure[x][y] === undefined) return;

  structure[x][y] = selectedType;
  selectedTile = { x, y };
}

// 🖱 mouse events
canvas.addEventListener("mousedown", (e) => {
  e.preventDefault();
  isMouseDown = true;
  paintTile(e);
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

canvas.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;
  paintTile(e);
});

// 🎨 render loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < structure.length; x++) {
    for (let y = 0; y < structure[x].length; y++) {

      const type = structure[x][y];

      switch (type) {
        case 1: ctx.fillStyle = "black"; break;
        case 2: ctx.fillStyle = "red"; break;
        case 3: ctx.fillStyle = "green"; break;
        case 4: ctx.fillStyle = "gold"; break;
        default: ctx.fillStyle = "#c6f6ff";
      }

      ctx.fillRect(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      // thinner grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#333";
      ctx.strokeRect(
        x * CELL_SIZE,
        y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // highlight selected tile
  if (selectedTile) {
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      selectedTile.x * CELL_SIZE,
      selectedTile.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );
  }

  requestAnimationFrame(draw);
}

draw();

// 🧹 clear
document.getElementById("clearBtn").addEventListener("click", () => {
  for (let x = 0; x < structure.length; x++) {
    for (let y = 0; y < structure[x].length; y++) {
      structure[x][y] = 0;
    }
  }
});

// 📤 export
document.getElementById("exportBtn").addEventListener("click", () => {
    //   const data = JSON.stringify(structure);
    const formatted = "[\n" +
        structure.map(col => "  " + JSON.stringify(col)).join(",\n") +
        "\n]";
  navigator.clipboard.writeText(formatted)
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("Failed to copy"));
});

// 📥 import
document.getElementById("importBtn").addEventListener("click", () => {
  const input = prompt("Paste your structure JSON here:");

  if (!input) return;

  try {
    const parsed = JSON.parse(input);

    // basic validation (must be 2D array)
    if (!Array.isArray(parsed) || !Array.isArray(parsed[0])) {
      alert("Invalid structure format!");
      return;
    }

    structure = parsed;


    selectedTile = null;

  } catch (err) {
    alert("Invalid JSON!");
  }
});