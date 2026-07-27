"use strict";

const state = {
  manifest: null,
  image: null,
  canvas: null,
  context: null,
  highlight: null,
  controls: {}
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
  state.controls.threat.addEventListener("change", evaluate);
  state.controls.energy.addEventListener("change", evaluate);
  document.querySelector("#limitation").textContent = state.manifest.claims.limitations;

  evaluate();
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load policy image: ${source}`));
    image.src = source;
  });
}

function evaluate() {
  const threatIndex = Number(state.controls.threat.value);
  const energyIndex = Number(state.controls.energy.value);
  const grid = state.manifest.grid;

  const x = energyIndex * grid.cell_width + Math.floor(grid.cell_width / 2);
  const y = threatIndex * grid.cell_height + Math.floor(grid.cell_height / 2);
  const rgba = state.context.getImageData(x, y, 1, 1).data;
  const colour = rgbToHex(rgba[0], rgba[1], rgba[2]);
  const action = state.manifest.decoder[colour] ?? "invalid";

  const threatName = state.manifest.dimensions.find(item => item.name === "threat").values[threatIndex];
  const energyName = state.manifest.dimensions.find(item => item.name === "energy").values[energyIndex];

  document.querySelector("#state-value").textContent = `threat=${threatName}, energy=${energyName}`;
  document.querySelector("#grid-address").textContent = `row ${threatIndex}, column ${energyIndex}`;
  document.querySelector("#pixel-address").textContent = `(${x}, ${y})`;
  document.querySelector("#pixel-colour").textContent = colour;
  document.querySelector("#colour-chip").style.background = colour;
  document.querySelector("#action").textContent = action.replaceAll("_", " ").toUpperCase();

  const scaleX = state.canvas.clientWidth / state.canvas.width;
  const scaleY = state.canvas.clientHeight / state.canvas.height;
  state.highlight.style.left = `${energyIndex * grid.cell_width * scaleX}px`;
  state.highlight.style.top = `${threatIndex * grid.cell_height * scaleY}px`;
  state.highlight.style.width = `${grid.cell_width * scaleX}px`;
  state.highlight.style.height = `${grid.cell_height * scaleY}px`;
}

function rgbToHex(red, green, blue) {
  return `#${[red, green, blue]
    .map(value => value.toString(16).padStart(2, "0"))
    .join("")}`;
}
