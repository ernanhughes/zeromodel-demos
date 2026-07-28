"use strict";

const APP_VERSION = "transition-inspector-static-v1";
const SCENARIOS = [
  ["valid", "Valid transition", "arcade-valid"],
  ["wrong-direction", "Wrong direction", "arcade-wrong-direction"],
  ["wrong-magnitude", "Wrong magnitude", "arcade-wrong-magnitude"],
  ["required-change-missing", "Required change missing", "arcade-required-change-missing"],
  ["unexpected-change", "Unexpected protected-component change", "arcade-unexpected-change"],
  ["irrelevant-noise", "Irrelevant visual noise", "arcade-irrelevant-noise"],
  ["evidence-absent", "Evidence absent at source", "arcade-observability-gap"]
];
const WAREHOUSE_SCENARIOS = [["valid", "Valid transition", "warehouse-valid"]];
const FIELD_CAPABILITY = {
  x: "position",
  y: "position",
  direction: "direction",
  cooldown: "numeric",
  identity: "identity"
};
const COLORS = {
  actor: "#38bdf8",
  asset: "#a78bfa",
  protected: "#fbbf24",
  noise: "#f97316"
};

const appState = {
  fixtures: {},
  result: null
};

window.addEventListener("DOMContentLoaded", initialise);

async function initialise() {
  await loadFixtures();
  document.querySelector("#domain-select").addEventListener("change", handleDomainChange);
  document.querySelector("#scenario-select").addEventListener("change", rerun);
  document.querySelector("#representation-select").addEventListener("change", rerun);
  document.querySelector("#contract-select").addEventListener("change", rerun);
  document.querySelector("#raw-toggle").addEventListener("change", toggleRawPanel);
  document.querySelector("#export-button").addEventListener("click", exportBundle);
  handleDomainChange();
}

async function loadFixtures() {
  const ids = [...new Set([...SCENARIOS, ...WAREHOUSE_SCENARIOS].map(item => item[2]))];
  const loaded = await Promise.all(ids.map(async id => {
    const response = await fetch(`fixtures/${id}.json`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load fixture ${id}: ${response.status}`);
    return [id, await response.json()];
  }));
  appState.fixtures = Object.fromEntries(loaded);
}

function handleDomainChange() {
  const domain = document.querySelector("#domain-select").value;
  const scenarioSelect = document.querySelector("#scenario-select");
  const scenarios = domain === "warehouse" ? WAREHOUSE_SCENARIOS : SCENARIOS;
  scenarioSelect.replaceChildren(...scenarios.map(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }));
  rerun();
}

function rerun() {
  const fixture = selectedFixture();
  const representationId = document.querySelector("#representation-select").value;
  const contractId = document.querySelector("#contract-select").value;
  const representation = fixture.representations[representationId];
  const contract = fixture.contracts[contractId];
  appState.result = evaluateFixture(fixture, representation, contract, { representationId, contractId });
  render(appState.result);
}

function selectedFixture() {
  const domain = document.querySelector("#domain-select").value;
  const scenario = document.querySelector("#scenario-select").value;
  const source = domain === "warehouse" ? WAREHOUSE_SCENARIOS : SCENARIOS;
  const id = source.find(item => item[0] === scenario)[2];
  return appState.fixtures[id];
}

function evaluateFixture(fixture, representation, contract, selection) {
  const groups = {
    expectedObserved: [],
    expectedAbsent: [],
    unexpectedObserved: [],
    unobservable: []
  };
  const rows = [];
  const before = indexComponents(fixture.before.components);
  const expected = indexComponents(fixture.expected_after.components);
  const actual = indexComponents(fixture.actual_after.components);
  const sourceAvailable = fixture.source_observation.components.length > 0;

  if (!sourceAvailable) {
    groups.unobservable.push("component evidence was absent from the permitted source observation");
  }

  for (const change of contract.required_changes || []) {
    const capability = FIELD_CAPABILITY[change.field] || "position";
    if (!sourceAvailable || !preserves(representation, capability)) {
      groups.unobservable.push(`${change.label} cannot be verified from the selected representation`);
      continue;
    }
    const beforeValue = valueOf(before, change.component, change.field);
    const actualValue = valueOf(actual, change.component, change.field);
    const expectedValue = beforeValue + change.delta;
    if (actualValue === expectedValue) {
      groups.expectedObserved.push(change.label);
    } else if (actualValue === beforeValue) {
      groups.expectedAbsent.push(`${change.label} was required but absent`);
    } else {
      groups.expectedAbsent.push(`${change.label} was required`);
      groups.unexpectedObserved.push(`${change.component}.${change.field} changed to ${actualValue} instead of ${expectedValue}`);
    }
  }

  for (const id of contract.protected_components || []) {
    for (const field of ["x", "y", "direction", "cooldown", "identity"]) {
      const capability = FIELD_CAPABILITY[field];
      if (!sourceAvailable || !preserves(representation, capability)) continue;
      if (valueOf(expected, id, field) !== valueOf(actual, id, field)) {
        groups.unexpectedObserved.push(`${id}.${field} changed unexpectedly`);
      }
    }
  }

  for (const id of contract.identity_components || []) {
    if (!sourceAvailable || !preserves(representation, "identity")) {
      groups.unobservable.push(`${id} identity was removed by the selected representation`);
    } else if (valueOf(expected, id, "identity") === valueOf(actual, id, "identity")) {
      groups.expectedObserved.push(`${id} identity persisted`);
    } else {
      groups.unexpectedObserved.push(`${id} identity changed`);
    }
  }

  for (const item of contract.numeric_constraints || []) {
    if (!sourceAvailable || !preserves(representation, "numeric")) {
      groups.unobservable.push(`${item.label} cannot be verified from the selected representation`);
    } else if (valueOf(actual, item.component, item.field) === item.expected) {
      groups.expectedObserved.push(item.label);
    } else {
      groups.unexpectedObserved.push(`${item.component}.${item.field} changed to ${valueOf(actual, item.component, item.field)}`);
    }
  }

  for (const relation of contract.relations || []) {
    if (!sourceAvailable || !preserves(representation, "relation")) {
      groups.unobservable.push(`${relation.label} cannot be verified from the selected representation`);
    } else if (relationSatisfied(actual, relation)) {
      groups.expectedObserved.push(relation.label);
    } else {
      groups.expectedAbsent.push(`${relation.label} was not preserved`);
    }
  }

  for (const id of allComponentIds(fixture)) {
    rows.push(classifyComponentRow(id, before[id], expected[id], actual[id], representation, sourceAvailable));
  }

  const rawChanged = rows.some(row => row.before !== row.actual) || Boolean(fixture.actual_after.pixel_noise?.length);
  const verdict = classifyVerdict(groups);
  return { fixture, representation, contract, selection, groups, rows, rawChanged, verdict };
}

function classifyComponentRow(id, before, expected, actual, representation, sourceAvailable) {
  const component = actual || expected || before || { label: id };
  if (!sourceAvailable) return rowFor(component, before, expected, actual, "source evidence absent");
  if (!preserves(representation, "identity") && id.includes("-")) return rowFor(component, before, expected, actual, "identity unobservable");
  if (!actual || !expected || !before) return rowFor(component, before, expected, actual, "candidate unexplained region");
  if (actual.x !== expected.x || actual.y !== expected.y) {
    const actualDelta = actual.x - before.x;
    const expectedDelta = expected.x - before.x;
    if (Math.sign(actualDelta) !== Math.sign(expectedDelta)) return rowFor(component, before, expected, actual, "wrong direction");
    return rowFor(component, before, expected, actual, "wrong magnitude");
  }
  if (actual.cooldown !== expected.cooldown) return rowFor(component, before, expected, actual, "unexpected change");
  if (actual.identity !== expected.identity) return rowFor(component, before, expected, actual, "identity changed");
  return rowFor(component, before, expected, actual, "stable");
}

function rowFor(component, before, expected, actual, classification) {
  return {
    component: component.label || component.id,
    before: summarizeComponent(before),
    expected: summarizeComponent(expected),
    actual: summarizeComponent(actual),
    classification
  };
}

function classifyVerdict(groups) {
  if (groups.unobservable.some(item => item.includes("source"))) return "INSUFFICIENT OBSERVABILITY";
  if (groups.unobservable.length) return "INSUFFICIENT REPRESENTATION";
  if (groups.expectedAbsent.length || groups.unexpectedObserved.length) return "CONTRACT VIOLATION";
  return "CONFORMANT";
}

function render(result) {
  renderCanvases(result.fixture);
  renderEvidence(result.groups);
  renderTrace(result.rows);
  renderSummary(result);
  document.querySelector("#verdict").textContent = result.verdict;
  document.querySelector("#raw-summary").textContent = result.rawChanged
    ? "something changed in rendered pixels"
    : "no rendered pixel change was detected";
  toggleRawPanel();
}

function renderCanvases(fixture) {
  drawState("before-canvas", fixture.before, fixture.domain);
  drawState("expected-canvas", fixture.expected_after, fixture.domain);
  drawState("actual-canvas", fixture.actual_after, fixture.domain);
}

function drawState(canvasId, frame, domain) {
  const canvas = document.querySelector(`#${canvasId}`);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = domain === "warehouse" ? "#0b1620" : "#08111f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#1e3a56";
  for (let x = 0; x <= 12; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * 40, 0);
    ctx.lineTo(x * 40, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= 8; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * 40);
    ctx.lineTo(canvas.width, y * 40);
    ctx.stroke();
  }
  for (const item of frame.components || []) {
    ctx.fillStyle = COLORS[item.kind] || "#38bdf8";
    ctx.fillRect(item.x * 40 + 7, item.y * 40 + 7, 26, 26);
    ctx.fillStyle = "#eef4ff";
    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText(item.label, item.x * 40 + 4, item.y * 40 + 38);
  }
  for (const noise of frame.pixel_noise || []) {
    ctx.fillStyle = noise.color || COLORS.noise;
    ctx.fillRect(noise.x * 40 + 12, noise.y * 40 + 12, 16, 16);
  }
}

function renderEvidence(groups) {
  renderList("#expected-observed", groups.expectedObserved);
  renderList("#expected-absent", groups.expectedAbsent);
  renderList("#unexpected-observed", groups.unexpectedObserved);
  renderList("#unobservable", groups.unobservable);
}

function renderList(selector, items) {
  const list = document.querySelector(selector);
  const safeItems = items.length ? items : ["No items"];
  list.replaceChildren(...safeItems.map(text => {
    const item = document.createElement("li");
    item.textContent = text;
    if (!items.length) item.className = "empty";
    return item;
  }));
}

function renderTrace(rows) {
  document.querySelector("#component-rows").replaceChildren(...rows.map(row => {
    const tr = document.createElement("tr");
    for (const value of [row.component, row.before, row.expected, row.actual, row.classification]) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    }
    return tr;
  }));
}

function renderSummary(result) {
  const fixture = result.fixture;
  document.querySelector("#summary-expected").textContent =
    `${fixture.policy.action} from ${fixture.policy.artifact_id} at row ${fixture.policy.address.row}, column ${fixture.policy.address.column}.`;
  document.querySelector("#summary-actual").textContent = summarizeActual(result);
  document.querySelector("#summary-why").textContent = summarizeWhy(result);
  document.querySelector("#summary-lost").textContent = result.groups.unobservable.length
    ? result.groups.unobservable.join("; ")
    : "No declared evidence boundary loss for this selection.";
  document.querySelector("#summary-next").textContent = result.verdict === "CONFORMANT"
    ? "Archive the exported bundle with the policy and fixture identifiers."
    : "Candidate component or candidate unexplained region requires repeated evidence before assigning semantic identity.";
}

function summarizeActual(result) {
  if (result.groups.unexpectedObserved.length) return result.groups.unexpectedObserved.join("; ");
  if (result.groups.expectedAbsent.length) return result.groups.expectedAbsent.join("; ");
  if (result.groups.unobservable.length) return "The selected evidence boundary cannot verify the declared contract.";
  return "The actual structured transition matched the declared expectation.";
}

function summarizeWhy(result) {
  if (result.verdict === "CONFORMANT") return "Required evidence was present and no protected component contradicted the contract.";
  if (result.verdict === "INSUFFICIENT OBSERVABILITY") return "Required evidence was absent at source, so the browser reconstruction cannot recover it.";
  if (result.verdict === "INSUFFICIENT REPRESENTATION") return "The selected representation removed evidence required by the contract.";
  return "Observed component evidence contradicted at least one declared requirement or protected stability rule.";
}

function toggleRawPanel() {
  document.querySelector("#raw-panel").hidden = !document.querySelector("#raw-toggle").checked;
}

function exportBundle() {
  const result = appState.result;
  const bundle = {
    application_version: APP_VERSION,
    selected_fixture: result.fixture.id,
    policy_identity: result.fixture.policy,
    representation_identity: result.representation.id,
    contract: result.contract,
    before_state: result.fixture.before,
    expected_state: result.fixture.expected_after,
    actual_state: result.fixture.actual_after,
    evidence_classifications: result.groups,
    verdict: result.verdict,
    provenance_metadata: result.fixture.provenance,
    note: "Browser reconstruction bundle, not the complete ZeroModel replay bundle."
  };
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${result.fixture.id}-investigation-bundle.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function indexComponents(components) {
  return Object.fromEntries((components || []).map(item => [item.id, item]));
}

function allComponentIds(fixture) {
  return [...new Set([
    ...fixture.before.components.map(item => item.id),
    ...fixture.expected_after.components.map(item => item.id),
    ...fixture.actual_after.components.map(item => item.id)
  ])];
}

function valueOf(index, id, field) {
  return index[id]?.[field];
}

function preserves(representation, capability) {
  return representation?.preserves?.includes(capability);
}

function relationSatisfied(actual, relation) {
  const from = actual[relation.from];
  const to = actual[relation.to];
  if (!from || !to) return false;
  if (relation.relation === "equal") return from[relation.field] === to[relation.field];
  return false;
}

function summarizeComponent(component) {
  if (!component) return "absent";
  return `x=${component.x}, y=${component.y}, dir=${component.direction}, id=${component.identity}, n=${component.cooldown}`;
}
