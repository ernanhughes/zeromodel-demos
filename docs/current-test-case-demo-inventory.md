# Demo Inventory Derived from Current ZeroModel Tests

This document converts the current ZeroModel test and benchmark surface into candidate public demonstrations.

The source repository remains authoritative for implementation, tests, frozen evidence, and claims:

- <https://github.com/ernanhughes/zeromodel>

This inventory does not imply that every test should become a public application. It identifies the test cases that contain a visible idea worth teaching, inspecting, or presenting.

## Classification

- **Launch** — suitable for the first public ZeroModel product journey.
- **Technical** — useful for developers, researchers, and evaluators after the main idea is understood.
- **Lab** — best expressed as an interactive inspector or workbench.
- **Experiment** — valuable boundary or negative result that should remain explicitly bounded.

---

# A. Visual intelligence demos

These candidates derive primarily from the deterministic arcade and warehouse transition benchmark, value-aware contracts, cross-domain replication, and the Evidence Contract Compiler.

## 1. Visual Policy Map Lookup

**Class:** `demo`  
**Priority:** Launch

Show structured state being compiled into an addressable visual artifact, then retrieve the deterministic result without a runtime model call.

**Visible flow:**

```text
structured state
    → visual policy map
    → address
    → deterministic result
```

**Core idea:** compiled intelligence rather than generated intelligence.

## 2. Pixel Difference vs Declared Transition Evidence

**Class:** `demo`  
**Priority:** Launch

Place raw pixel differencing beside ZeroModel field evidence for the same before/after transition.

Show that pixel differencing can say pixels changed, while a declared contract can say which component changed and whether that change was expected.

**Source test families:** component attribution, relative localization, false implication, transition conformance.

## 3. Visible Component Change Attribution

**Class:** `demo`  
**Priority:** Launch

Highlight the tank, alien, cooldown indicator, robot, crate, door, battery, or goal region that changed between two frames.

**Source test families:** arcade component attribution and warehouse component attribution.

## 4. Stable Component Violation

**Class:** `demo`  
**Priority:** Launch

Declare a component stable, inject an unexpected visual change, and show the conformance report identifying the violation.

**Example:** the action should move the tank, but the cooldown or unrelated component also changes.

## 5. Required Change Missing

**Class:** `demo`  
**Priority:** Launch

Declare that a component must change, then show a transition where it remains unchanged.

**Examples:** blocked or suppressed movement, missing crate movement, door failing to change.

## 6. Correct Component, Wrong Direction

**Class:** `demo`  
**Priority:** Launch

Show two transitions where the same component changes:

```text
tank changed correctly
vs
tank changed in the wrong direction
```

The component-only representation accepts both as changed; the value-aware contract rejects the wrong-direction case.

## 7. Correct Direction, Wrong Magnitude

**Class:** `demo`  
**Priority:** Launch

Show that a component may move in the correct direction but by the wrong distance.

This demonstrates why component presence and direction alone are insufficient.

## 8. Numeric State Contract

**Class:** `demo`  
**Priority:** Launch

Decode and compare bounded numeric visual state such as arcade cooldown intensity, warehouse battery evidence, or door state.

Show a visually changed indicator whose decoded value is nevertheless incorrect.

## 9. Relation Contract

**Class:** `demo`  
**Priority:** Technical

Evaluate a relation that requires multiple decoded components.

**Examples:**

- robot and crate movement during a push;
- expected spatial displacement between before and after state;
- component changed, but the associated relation was violated.

## 10. Cross-Domain Contract Replication

**Class:** `showcase`  
**Priority:** Launch

Run the same general evidence and conformance process across:

- TinyArcadeShooter;
- the deterministic warehouse domain.

The two renderers, state models, action spaces, and component vocabularies differ.

**Message:** the contract machinery transfers, while exact representation and decoding choices remain evidence-specific.

## 11. Representation Failure Explorer

**Class:** `lab`  
**Priority:** Launch

Interactively compare representations that preserve or destroy the evidence needed by a question.

Include the known test-derived failures:

### Coarse-region dilution

A small numeric indicator occupies only part of a coarse region, so background pixels dilute the recovered value.

### Maximum-aggregation tie

A sprite spans neighboring cells and maximum aggregation produces multiple equal candidates, obscuring its true position.

### Whole-region spatial loss

Averaging an entire region can preserve total intensity while losing internal rearrangement.

Controls should allow changing:

- region geometry;
- resolution;
- aggregation;
- decoder;
- before/after frame.

## 12. Manual Representation Repair

**Class:** `lab`  
**Priority:** Technical

Reproduce the historical manual repairs used by the tests:

- mean rather than max aggregation for dominant position;
- narrowed local geometry for numeric indicators;
- marker-local evidence for visible identity.

This is the bridge between the failure explorer and the compiler.

## 13. Evidence Contract Compiler

**Class:** `showcase`  
**Priority:** Launch

Provide a declared evidence requirement and display the bounded candidate search over:

- region;
- resolution;
- aggregation;
- decoder;
- comparison semantics.

Show development-only selection and held-out evaluation.

**Bounded result to present:** eleven of twelve declared requirements compiled in the current two-domain evaluation.

## 14. Compiler vs Fixed Coarse vs Pixel vs Manual

**Class:** `lab`  
**Priority:** Launch

Compare four strategies on the same held-out cases:

```text
compiler-selected
fixed coarse
always pixel
historical manual
```

Present accuracy, false-change stability, collision rate, and representation complexity.

**Important claim boundary:** compiler parity with the tested historical manual choices, not universal superiority.

## 15. Visible Identity Preservation

**Class:** `experiment`  
**Priority:** Technical

Use warehouse crates with persistent visible markers to show that identity evidence exists in the image but can be lost by the representation or decoder.

This is a representation failure, not an observability failure.

## 16. Observability Boundary

**Class:** `showcase`  
**Priority:** Launch

Contrast two identity questions:

### Warehouse crate identity

A visible marker exists, so an adequate representation can recover identity.

### Arcade alien target identity

The required target identity depends on hidden queue state and is absent from the permitted frames.

Show the two explicit outcomes:

```text
insufficient_representation
insufficient_observability
```

**Main message:** ZeroModel can distinguish evidence lost by a representation from evidence never present in the observation.

---

# B. Operational trust demos

These candidates derive from the P18 discovery, validation, review, materialization, activation, persistence, and rollback tests. They are not the first explanation of ZeroModel, but together they show that compiled visual policy changes can be governed and reversed.

## 17. Recurrent Transition Discovery

**Class:** `lab`  
**Priority:** Technical

Aggregate repeated unexplained transition evidence and surface a candidate field-level hypothesis.

**Boundary:** recurrence proposes a candidate; it does not assign semantic meaning or prove causality.

## 18. Held-Out Candidate Validation

**Class:** `demo`  
**Priority:** Technical

Separate discovery and validation cohorts, derive an explicit expectation from the discovered statistic, and evaluate it against held-out immutable observations.

Show outcomes such as:

- validated;
- rejected;
- inconclusive;
- insufficient evidence.

## 19. Governed Promotion Review

**Class:** `lab`  
**Priority:** Technical

Display immutable candidate proposals and explicit reviewer decisions:

- approved;
- rejected;
- deferred;
- needs semantic annotation.

Show that approval records authorization but does not change runtime behavior.

## 20. Reversible Materialization Plan

**Class:** `demo`  
**Priority:** Technical

Turn an approved proposal into a staged inactive change set containing:

- exact new annotation or relation;
- transition expectation;
- ordered forward operations;
- reverse-ordered inverse operations;
- baseline identities.

The user should be able to inspect the complete reversible plan before activation.

## 21. Atomic Activation

**Class:** `demo`  
**Priority:** Technical

Show exact-baseline admission followed by atomic activation.

Run both paths:

```text
all operations succeed
    → active state and receipt commit

injected intermediate failure
    → no state or ledger mutation
```

## 22. Stale Admission Rejection

**Class:** `experiment`  
**Priority:** Technical

Audit a change against state A, mutate the active state to B, then attempt the old commit.

Show compare-and-swap rejecting the stale admission without damaging state B.

## 23. Durable Activation Across Restart

**Class:** `demo`  
**Priority:** Technical

Activate a change into the SQLite reference store, close the process, reopen it, and verify:

- active state identity;
- activation receipt;
- rollback plan;
- ordered operations.

## 24. Governed Exact-State Rollback

**Class:** `showcase`  
**Priority:** Technical

Admit and execute the exact stored inverse plan only when the active state still equals the state produced by the target activation.

Show preserved history:

```text
activation receipt
rollback admission
rollback receipt
restored state
```

## 25. Concurrent Idempotent Rollback

**Class:** `experiment`  
**Priority:** Technical

Open two SQLite store instances and submit the same rollback concurrently.

Demonstrate:

- one durable state mutation;
- equivalent caller results;
- inverse operations applied once.

## 26. Persistence Corruption Detection

**Class:** `lab`  
**Priority:** Technical

Provide controlled corruptions and display explicit rejection:

- malformed JSON;
- unsupported schema version;
- operation ordinal mismatch;
- malformed rollback admission;
- broken receipt or plan lineage.

**Boundary:** corruption is detected, not automatically repaired.

---

# C. Recommended build order

## First public launch sequence

1. Visual Policy Map Lookup
2. Pixel Difference vs Declared Transition Evidence
3. Correct Component, Wrong Direction
4. Representation Failure Explorer
5. Evidence Contract Compiler
6. Compiler vs Manual and Fixed Baselines
7. Observability Boundary
8. Cross-Domain Contract Replication

This sequence explains the product from immediate comprehension through the strongest current empirical result.

## Second technical sequence

1. Recurrent Transition Discovery
2. Held-Out Candidate Validation
3. Governed Promotion Review
4. Reversible Materialization Plan
5. Atomic Activation
6. Durable Activation Across Restart
7. Governed Exact-State Rollback
8. Persistence Corruption Detection

This sequence demonstrates how ZeroModel can evolve compiled policy artifacts without treating generated candidates as automatically trusted.

---

# D. What should not become separate demos

Avoid creating one demo for every pytest function.

Keep the following as tests or supporting scenes inside a larger demo:

- individual identity-tamper cases;
- ordering permutations with no visible conceptual difference;
- DTO constructor validation in isolation;
- repeated variants of the same missing-field error;
- package import-surface checks;
- wheel installation checks;
- internal schema constants;
- release-validator mechanics.

These are important engineering evidence, but they do not each communicate a distinct product idea.

---

# E. Source evidence

The principal current sources are:

- `examples/visual_transition_benchmark/`;
- `packages/perception/tests/`;
- `docs/research/visual-transition-debugging-benchmark.md`;
- `docs/research/value-aware-transition-contracts.md`;
- `docs/research/cross-domain-visual-contract-replication.md`;
- `docs/research/evidence-contract-representation-compiler.md`;
- `docs/claims-audit.md`.

Each implemented demo must pin an exact ZeroModel release or commit and link the relevant test, research document, frozen result, and claims-audit entry in its `zeromodel-demo.yaml` file.
