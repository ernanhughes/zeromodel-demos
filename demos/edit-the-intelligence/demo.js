"use strict";

const state = {
  manifest: null,
  image: null,
  canvas: null,
  context: null,
  controls: {},
  selectedAction: null,
  selectedCell: { row: 0, column: 0 },
  originalDecision: null
};

window.addEventListener("DOMContentLoaded", initialise);

async function initialise() {
  state.canvas = document.querySelector("#policy-canvas");
  state.context = state.canvas.getContext("2d", { willReadFrequently: true });
  state.controls.threat = document.querySelector("#threat");
  state.controls.energy = document.querySelector("#energy");

  const response = await fetch("policy.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not load policy manifest: ${response.status}`);

  state.manifest = await response.json();
  populateSelect(state.controls.threat, dimensionValues("threat"));
  populateSelect(state.controls.energy, dimensionValues("energy"));
  state.controls.threat.value = String(state.manifest.default_state.threat);
  state.controls.energy.value = String(state.manifest.default_state.energy);
  buildPalette();

  state.image = await loadImage(state.manifest.image);
  drawOriginalImage();

  state.controls.threat.addEventListener("change", handleStateChange);
  state.controls.energy.addEventListener("change", handleStateChange);
  state.canvas.addEventListener("click", handleCanvasClick);
  document.querySelector("#apply").addEventListener("click", applySelectedAction);
  document.querySelector("#reset").addEventListener("click", resetPolicy);
  document.querySelector("#replay").addEventListener("click", replayDecision);
  window.addEventListener("resize", renderHighlight);

  handleStateChange();
}

function populateSelect(select, values) {
  values.forEach((value, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = value;
    select.appendChild(option);
  });
}

function buildPalette() {
  const palette = document.querySelector("#palette");
  const buttons = state.manifest.actions.map((action, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action.id;
    button.dataset.colour = action.colour;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.innerHTML = `<span class="swatch" style="background:${action.colour}"></span>${formatAction(action.id)}`;
    button.addEventListener("click", () => selectPaletteAction(button, action));
    if (index === 0) state.selectedAction = action;
    return button;
  });
  palette.replaceChildren(...buttons);
}

function selectPaletteAction(button, action) {
  document.querySelectorAll("#palette button").forEach(item => item.setAttribute("aria-pressed", "false"));
  button.setAttribute("aria-pressed", "true");
  state.selectedAction = action;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load policy image: ${source}`));
    image.src = source;
  });
}

function drawOriginalImage() {
  state.context.clearRect(0, 0, state.canvas.width, state.canvas.height);
  state.context.drawImage(state.image, 0, 0, state.canvas.width, state.canvas.height);
}

function handleStateChange() {
  state.selectedCell = addressForState(readCurrentState());
  state.originalDecision = sampleCellFromImage(state.selectedCell);
  renderDecision();
}

function replayDecision() {
  state.selectedCell = addressForState(readCurrentState());
  renderDecision();
}

function handleCanvasClick(event) {
  const rect = state.canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (state.canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (state.canvas.height / rect.height);
  const grid = state.manifest.grid;
  state.selectedCell = {
    row: clamp(Math.floor(y / grid.cell_height), 0, grid.rows - 1),
    column: clamp(Math.floor(x / grid.cell_width), 0, grid.columns - 1)
  };
  renderDecision();
}

function applySelectedAction() {
  const grid = state.manifest.grid;
  const cell = addressForState(readCurrentState());
  state.selectedCell = cell;
  state.context.fillStyle = state.selectedAction.colour;
  state.context.fillRect(
    cell.column * grid.cell_width + 2,
    cell.row * grid.cell_height + 2,
    grid.cell_width - 4,
    grid.cell_height - 4
  );
  renderDecision();
}

function resetPolicy() {
  drawOriginalImage();
  state.selectedCell = addressForState(readCurrentState());
  state.originalDecision = sampleCellFromImage(state.selectedCell);
  renderDecision();
}

function readCurrentState() {
  return {
    threat: Number(state.controls.threat.value),
    energy: Number(state.controls.energy.value)
  };
}

function addressForState(currentState) {
  return { row: currentState.threat, column: currentState.energy };
}

function sampleCell(cell) {
  const grid = state.manifest.grid;
  const x = cell.column * grid.cell_width + Math.floor(grid.cell_width / 2);
  const y = cell.row * grid.cell_height + Math.floor(grid.cell_height / 2);
  const rgba = state.context.getImageData(x, y, 1, 1).data;
  const colour = rgbToHex(rgba[0], rgba[1], rgba[2]);
  return { colour, action: state.manifest.decoder[colour] ?? "invalid" };
}

function sampleCellFromImage(cell) {
  const temporary = document.createElement("canvas");
  temporary.width = state.canvas.width;
  temporary.height = state.canvas.height;
  const context = temporary.getContext("2d", { willReadFrequently: true });
  context.drawImage(state.image, 0, 0, temporary.width, temporary.height);
  const grid = state.manifest.grid;
  const x = cell.column * grid.cell_width + Math.floor(grid.cell_width / 2);
  const y = cell.row * grid.cell_height + Math.floor(grid.cell_height / 2);
  const rgba = context.getImageData(x, y, 1, 1).data;
  const colour = rgbToHex(rgba[0], rgba[1], rgba[2]);
  return { colour, action: state.manifest.decoder[colour] ?? "invalid" };
}

function renderDecision() {
  const currentState = readCurrentState();
  const executionCell = addressForState(currentState);
  const before = sampleCellFromImage(executionCell);
  const after = sampleCell(executionCell);
  const stateText = `threat=${dimensionValues("threat")[currentState.threat]}, energy=${dimensionValues("energy")[currentState.energy]}`;
  const cellText = `row ${executionCell.row}, column ${executionCell.column}`;

  setResult("before", stateText, cellText, before);
  setResult("after", stateText, cellText, after);
  document.querySelector("#change-summary").textContent = before.action === after.action
    ? `The selected state still resolves to ${formatAction(after.action)}. Paint its cell with another action to change the decision.`
    : `The same state previously returned ${formatAction(before.action)}. After editing one image cell it now returns ${formatAction(after.action)}.`;
  renderHighlight();
}

function setResult(prefix, stateText, cellText, decision) {
  document.querySelector(`#${prefix}-state`).textContent = stateText;
  document.querySelector(`#${prefix}-cell`).textContent = cellText;
  document.querySelector(`#${prefix}-colour`).textContent = decision.colour;
  document.querySelector(`#${prefix}-chip`).style.background = decision.colour;
  document.querySelector(`#${prefix}-action`).textContent = formatAction(decision.action);
}

function renderHighlight() {
  const grid = state.manifest.grid;
  const highlight = document.querySelector("#highlight");
  const scaleX = state.canvas.clientWidth / state.canvas.width;
  const scaleY = state.canvas.clientHeight / state.canvas.height;
  highlight.style.left = `${state.selectedCell.column * grid.cell_width * scaleX}px`;
  highlight.style.top = `${state.selectedCell.row * grid.cell_height * scaleY}px`;
  highlight.style.width = `${grid.cell_width * scaleX}px`;
  highlight.style.height = `${grid.cell_height * scaleY}px`;
}

function dimensionValues(name) {
  return state.manifest.dimensions.find(item => item.name === name).values;
}

function formatAction(action) {
  return action.replaceAll("_", " ").toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue].map(value => value.toString(16).padStart(2, "0")).join("")}`;
}
