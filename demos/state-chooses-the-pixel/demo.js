"use strict";

const state = {
  manifest: null,
  image: null,
  canvas: null,
  context: null,
  highlight: null,
  controls: {},
  reverseIndex: {},
  selectedCell: { row: 0, column: 0 }
};

window.addEventListener("DOMContentLoaded", initialise);

async function initialise() {
  state.canvas = document.querySelector("#policy-canvas");
  state.context = state.canvas.getContext("2d", { willReadFrequently: true });
  state.highlight = document.querySelector("#highlight");
  state.controls.threat = document.querySelector("#threat");
  state.controls.energy = document.querySelector("#energy");

  const response = await fetch("policy.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load policy manifest: ${response.status}`);
  }
  state.manifest = await response.json();
  state.image = await loadImage(state.manifest.image);

  state.context.drawImage(state.image, 0, 0, state.canvas.width, state.canvas.height);
  state.reverseIndex = buildReverseIndex();
  state.controls.threat.addEventListener("change", handleStateChange);
  state.controls.energy.addEventListener("change", handleStateChange);
  state.canvas.addEventListener("click", handlePolicyClick);
  document.querySelector("#limitation").textContent = state.manifest.claims.limitations;

  handleStateChange();
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load policy image: ${source}`));
    image.src = source;
  });
}

function handleStateChange() {
  const currentState = readCurrentState();
  state.selectedCell = addressForState(currentState);
  render(currentState);
}

function handlePolicyClick(event) {
  const rect = state.canvas.getBoundingClientRect();
  const scaleX = state.canvas.width / rect.width;
  const scaleY = state.canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const grid = state.manifest.grid;
  const column = clamp(Math.floor(x / grid.cell_width), 0, grid.columns - 1);
  const row = clamp(Math.floor(y / grid.cell_height), 0, grid.rows - 1);

  state.selectedCell = { row, column };
  render(readCurrentState());
}

function readCurrentState() {
  return {
    threat: Number(state.controls.threat.value),
    energy: Number(state.controls.energy.value)
  };
}

function addressForState(currentState) {
  const criticalThreat = dimensionValues("threat").indexOf("critical");
  const emptyEnergy = dimensionValues("energy").indexOf("empty");
  const lowEnergy = dimensionValues("energy").indexOf("low");
  const readyEnergy = dimensionValues("energy").indexOf("ready");

  if (currentState.threat === criticalThreat && currentState.energy === emptyEnergy) {
    return {
      row: currentState.threat,
      column: 1
    };
  }

  if (
    currentState.threat === criticalThreat &&
    (currentState.energy === lowEnergy || currentState.energy === readyEnergy)
  ) {
    return {
      row: currentState.threat,
      column: 0
    };
  }

  return {
    row: currentState.threat,
    column: currentState.energy
  };
}

function sampleCell(cell) {
  const grid = state.manifest.grid;
  const x = cell.column * grid.cell_width + Math.floor(grid.cell_width / 2);
  const y = cell.row * grid.cell_height + Math.floor(grid.cell_height / 2);
  const rgba = state.context.getImageData(x, y, 1, 1).data;
  const colour = rgbToHex(rgba[0], rgba[1], rgba[2]);
  const action = state.manifest.decoder[colour] ?? "invalid";

  return { x, y, colour, action };
}

function buildReverseIndex() {
  const reverseIndex = {};
  const threatValues = dimensionValues("threat");
  const energyValues = dimensionValues("energy");

  threatValues.forEach((threatName, threat) => {
    energyValues.forEach((energyName, energy) => {
      const cell = addressForState({ threat, energy });
      const key = cellKey(cell);
      reverseIndex[key] ??= [];
      reverseIndex[key].push({ threat, energy, threatName, energyName });
    });
  });

  return reverseIndex;
}

function render(currentState) {
  const cell = state.selectedCell;
  const sample = sampleCell(cell);
  const threatName = dimensionValues("threat")[currentState.threat];
  const energyName = dimensionValues("energy")[currentState.energy];

  document.querySelector("#state-value").textContent = `threat=${threatName}, energy=${energyName}`;
  document.querySelector("#grid-address").textContent = `row ${cell.row}, column ${cell.column}`;
  document.querySelector("#pixel-address").textContent = `(${sample.x}, ${sample.y})`;
  document.querySelector("#pixel-colour").textContent = sample.colour;
  document.querySelector("#colour-chip").style.background = sample.colour;
  document.querySelector("#action").textContent = formatAction(sample.action);

  renderHighlight(cell);
  renderReversePanel(cell, sample);
}

function renderHighlight(cell) {
  const grid = state.manifest.grid;
  const scaleX = state.canvas.clientWidth / state.canvas.width;
  const scaleY = state.canvas.clientHeight / state.canvas.height;
  state.highlight.style.left = `${cell.column * grid.cell_width * scaleX}px`;
  state.highlight.style.top = `${cell.row * grid.cell_height * scaleY}px`;
  state.highlight.style.width = `${grid.cell_width * scaleX}px`;
  state.highlight.style.height = `${grid.cell_height * scaleY}px`;
}

function renderReversePanel(cell, sample) {
  const compatibleStates = state.reverseIndex[cellKey(cell)] ?? [];
  const classification = classifyCompatibleStates(compatibleStates.length);
  const list = document.querySelector("#compatible-states");

  document.querySelector("#reverse-cell").textContent = `row ${cell.row}, column ${cell.column}`;
  document.querySelector("#reverse-colour").textContent = sample.colour;
  document.querySelector("#reverse-colour-chip").style.background = sample.colour;
  document.querySelector("#reverse-action").textContent = formatAction(sample.action);
  document.querySelector("#reverse-classification").textContent = `${classification} (${compatibleStates.length})`;
  document.querySelector("#reverse-count").textContent = String(compatibleStates.length);
  list.replaceChildren(...compatibleStates.map(formatCompatibleState));
  document.querySelector("#equivalence-note").textContent =
    compatibleStates.length > 1 ? "This cell represents an equivalence class of states." : "";
}

function formatCompatibleState(item) {
  const element = document.createElement("li");
  element.textContent = `threat = ${item.threatName}, energy = ${item.energyName}`;
  return element;
}

function classifyCompatibleStates(count) {
  if (count === 0) return "No compatible states";
  if (count === 1) return "Unique state";
  return "Multiple compatible states";
}

function dimensionValues(name) {
  return state.manifest.dimensions.find(item => item.name === name).values;
}

function cellKey(cell) {
  return `${cell.row},${cell.column}`;
}

function formatAction(action) {
  return action.replaceAll("_", " ").toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map(value => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
