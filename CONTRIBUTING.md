# Contributing to ZeroModel Demos

This repository contains public-facing demonstrations of ZeroModel. Contributions should make a capability easier to understand without overstating what the core project has validated.

## Choose the correct area

### `demos/`

Use for a focused, reproducible explanation of one established capability. A demo should be runnable locally and should teach a clear idea.

### `showcase/`

Use for a polished, curated product experience suitable for `zeromodel.org`, AI Busan, a presentation, or a public launch. A showcase normally promotes work that has already proved itself as a demo or lab.

### `lab/`

Use for interactive inspection tools, viewers, editors, comparison workbenches, and other evolving technical interfaces.

### `experiments/`

Use for hypotheses, prototypes, negative findings, and work whose interface or conclusion is not stable.

## Promotion path

The normal path is:

```text
experiment
    ↓ evidence and reproducibility
lab or demo
    ↓ product review and presentation
showcase
```

Promotion is not automatic. Copy or refactor an item into the more stable area when its purpose changes; do not simply rename an unstable experiment as a showcase.

## Required item structure

Each item should contain:

```text
<area>/<slug>/
├── README.md
├── zeromodel-demo.yaml
├── src/ or app/
├── assets/
└── tests/                 # where deterministic checks are applicable
```

The metadata file must identify:

- item ID and title;
- class and status;
- ZeroModel version or commit;
- runnable entry point;
- validated claims being demonstrated;
- limitations and non-claims;
- evidence links;
- website visibility.

Start from [`templates/demo/`](templates/demo/).

## Claims discipline

The main ZeroModel repository is authoritative for validated claims. A demo may simplify language for its audience, but must not:

- convert a bounded benchmark result into a universal claim;
- describe deterministic domains as open-world vision;
- imply that hidden evidence was recovered;
- describe compiler parity as superiority;
- claim model understanding where only declared contracts were evaluated;
- omit a limitation that materially changes the interpretation.

Link the relevant claims-audit or frozen-result source in `zeromodel-demo.yaml`.

## Reproducibility

A published demo must state:

- supported Python or runtime version;
- exact ZeroModel release or commit;
- installation command;
- run command;
- expected output;
- known platform limitations;
- whether network access or external services are required.

Avoid unpinned dependencies in published demos.

## Assets

Generated images, VPMs, benchmark frames, and reports should be reproducible where practical. Include provenance in the item README or metadata. Do not copy unrelated large research artifacts from the core repository.

## Review checklist

Before requesting review:

- [ ] The item is in the correct area.
- [ ] The metadata validates against the repository contract.
- [ ] Setup and run instructions work from a clean checkout.
- [ ] The ZeroModel dependency is pinned.
- [ ] The expected result is explained.
- [ ] Claims link to core evidence.
- [ ] Limitations and non-claims are visible.
- [ ] Website-facing screenshots contain no misleading labels.
- [ ] Generated files are either reproducible or explicitly identified.

## Naming

Use lowercase kebab-case directory names, for example:

```text
representation-failure-explorer
observability-boundary
visual-policy-lookup
```

Use durable conceptual names rather than version numbers in directory names. Version compatibility belongs in metadata.
