"use strict";

const APPLICATIONS = {
  "state-chooses-the-pixel": {
    title: "Where would visual addressability be useful?",
    lede: "Use this pattern when a bounded state must resolve to an inspectable, replaceable decision without invoking a model at runtime.",
    contribution: "ZeroModel contributes a deterministic bridge from declared state to a visible policy address and decoded action.",
    cards: [
      ["Embedded control", "Run small policy tables on constrained devices where decisions must be deterministic and inspectable."],
      ["Rules and eligibility", "Expose which state combination selected a benefit, routing, escalation, or safety action."],
      ["Simulation and games", "Drive agents from a visible policy map that designers and testers can inspect directly."]
    ]
  },
  "edit-the-intelligence": {
    title: "Where would policy-artifact substitution be useful?",
    lede: "Use this pattern when behaviour must change without rewriting or redeploying the mechanism that reads and applies decisions.",
    contribution: "ZeroModel separates the stable reader from the policy artifact, making policy versions explicit and replaceable.",
    cards: [
      ["Operational profiles", "Swap defensive, aggressive, conservative, or emergency policies while keeping the runtime unchanged."],
      ["Rollback", "Restore a previously approved policy artifact when a new decision profile behaves poorly."],
      ["A/B verification", "Compare two policy images against the same state set and execution reader."]
    ]
  },
  "observe-the-consequence": {
    title: "Where would action-to-observation lineage be useful?",
    lede: "Use this pattern when selecting an action is not enough—you must show what visibly happened after the action was applied.",
    contribution: "ZeroModel links state, selected policy address, decoded action, and resulting observation into one inspectable trace.",
    cards: [
      ["Robot operations", "Trace a selected movement command into the resulting physical or simulated position change."],
      ["UI automation", "Connect a declared interaction to the panel, control, or screen state that changed afterward."],
      ["Game testing", "Show which policy action produced a character, projectile, or enemy transition."]
    ]
  },
  "test-the-transition": {
    title: "Where would visual transition contracts be useful?",
    lede: "Use this pattern when any pixel change is insufficient and the system must verify that the right component changed in the right way.",
    contribution: "ZeroModel expresses expected visual change, direction, and protected stability as an explicit conformance contract.",
    cards: [
      ["Industrial QA", "Verify that a part moved or changed while nearby protected equipment remained stable."],
      ["Regression testing", "Confirm that a UI action changed the intended region without introducing collateral layout changes."],
      ["Autonomous systems", "Check whether commanded motion produced the expected direction and preserved surrounding objects."]
    ]
  },
  "representation-matters": {
    title: "Where would evidence-preserving representation be useful?",
    lede: "Use this pattern when compression or aggregation saves resources but may erase the exact evidence required by later decisions.",
    contribution: "ZeroModel evaluates a representation against the questions it must answer rather than treating compactness as sufficient.",
    cards: [
      ["Edge vision", "Preserve lane, obstacle, or motion geometry while reducing bandwidth and memory use."],
      ["Manufacturing inspection", "Retain defect position and identity instead of only aggregate defect counts."],
      ["Security video", "Preserve movement path and entity continuity needed for later incident review."]
    ]
  },
  "compile-the-representation": {
    title: "Where would an Evidence Contract Compiler be useful?",
    lede: "Use this pattern when the representation should be selected from declared evidence requirements rather than chosen first and audited later.",
    contribution: "ZeroModel searches bounded candidate encodings and selects the lowest-cost artifact that still satisfies the evidence contract.",
    cards: [
      ["Low-bandwidth systems", "Choose the cheapest camera representation that still preserves required operational evidence."],
      ["Embedded robotics", "Compile compact observations for limited hardware without discarding safety-critical relationships."],
      ["Archival pipelines", "Generate storage-efficient visual summaries that remain capable of answering declared future questions."]
    ]
  },
  "observability-boundary": {
    title: "Where would observability-boundary attribution be useful?",
    lede: "Use this pattern when a system cannot answer a question and operators need to know whether the sensor, representation, or later analysis is responsible.",
    contribution: "ZeroModel identifies whether evidence survived, was erased during representation, or never existed in the source observation.",
    cards: [
      ["Incident investigation", "Determine whether missing identity came from poor source footage or an evidence-losing transformation."],
      ["Autonomous-vehicle review", "Separate sensor absence from preprocessing loss when reconstructing why an object was missed."],
      ["Medical and scientific imaging", "Audit whether resizing, segmentation, or normalization removed a feature visible in the source."]
    ]
  },
  "cross-domain-replication": {
    title: "Where would cross-domain contract replication be useful?",
    lede: "Use this pattern when several systems share verification structure even though their objects, vocabulary, and operating environments differ.",
    contribution: "ZeroModel reuses contract grammar—required change, directional relation, protected stability—while keeping domain evidence explicit.",
    cards: [
      ["Warehouse robotics", "Verify crate movement using the same structural contract used for movement in another visual domain."],
      ["Manufacturing cells", "Reuse change-and-stability contracts for valves, arms, packages, and assembled components."],
      ["Software UI testing", "Apply the same contract form to expected screen changes and protected interface regions."]
    ]
  }
};

function renderApplicationContext() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const demo = parts.at(-1) === "index.html" ? parts.at(-2) : parts.at(-1);
  const item = APPLICATIONS[demo];
  if (!item || document.querySelector(".application-context")) return;

  const section = document.createElement("section");
  section.className = "application-context";
  section.setAttribute("aria-labelledby", "application-context-title");
  section.innerHTML = `
    <p class="eyebrow">Application context</p>
    <h2 id="application-context-title">${item.title}</h2>
    <p class="application-lede">${item.lede}</p>
    <div class="application-grid">
      ${item.cards.map(([title, text]) => `<article class="application-card"><h3>${title}</h3><p>${text}</p></article>`).join("")}
    </div>
    <div class="application-contribution"><strong>What ZeroModel contributes:</strong> ${item.contribution}</div>
    <p class="application-disclaimer">These are representative application patterns, not claims of current production deployment or validated performance in these industries.</p>`;
  document.body.append(section);
}

window.addEventListener("DOMContentLoaded", renderApplicationContext);
