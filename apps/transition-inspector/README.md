# Transition Inspector

Transition Inspector is a browser-native ZeroModel application prototype. It combines concepts from Demos 03, 04, 05, 07, 08, and 10 into one investigation workflow:

```text
policy expectation
  + before state
  + expected after state
  + actual after state
  + representation boundary
  + contract
  -> evidence classification and reproducible browser bundle
```

This is an implemented browser demonstration, not the production ZeroModel compiler, SQL observation ledger, model inference pipeline, or general computer-vision system.

## Why This Matters

Pixel differences can show that something changed, but they do not explain whether the right declared component changed, whether a protected component mutated, whether evidence was lost by representation, or whether the source observation never contained the evidence required by the contract.

Transition Inspector reconstructs that operational question in the browser:

- What did the active visual policy expect?
- What actually happened?
- Which declared components explain the result?
- What changed unexpectedly?
- Was required evidence absent, destroyed by representation, or contradicted by the result?
- Can the investigation be reproduced?

## Representative Applications

- autonomous-system incident review;
- industrial or robotic transition verification;
- game and simulation testing;
- UI regression testing.

These are representative application patterns, not claims of current production deployment or validated performance in these industries.

## What ZeroModel Contributes

- explicit policy expectation;
- visual transition evidence;
- component-level attribution;
- evidence-boundary classification;
- immutable identifiers and reproducibility metadata.

## Fixture Schema

Fixtures are small deterministic JSON documents. The evaluator operates on structured components; canvas rendering is presentation only.

```json
{
  "id": "arcade-wrong-direction",
  "domain": "arcade",
  "title": "Tank moved in the wrong direction",
  "source_observation": { "components": [] },
  "before": { "components": [] },
  "expected_after": { "components": [] },
  "actual_after": { "components": [] },
  "policy": {
    "artifact_id": "policy-balanced@sha256:...",
    "state": {},
    "address": { "row": 0, "column": 0 },
    "action": "MOVE_RIGHT"
  },
  "representations": {
    "labelled-spatial-v1": {
      "id": "labelled-spatial-v1",
      "preserves": ["position", "identity"],
      "removes": []
    }
  },
  "contracts": {
    "movement": {
      "required_changes": [],
      "protected_components": [],
      "relations": [],
      "numeric_constraints": []
    }
  },
  "provenance": {
    "fixture_id": "...",
    "parent_ids": [],
    "operations": []
  }
}
```

## Mapping To Current ZeroModel

The current ZeroModel repository confirms the observation DTO and operation-chain names used below. Concepts marked partial or emerging are mapped conservatively.

| Application concept | Current ZeroModel mapping | Integration status |
| --- | --- | --- |
| Policy artifact identity | content-addressed visual artifacts | aligned |
| Source observation | `ObservationDTO` / materialized observation concepts | aligned |
| Operation chain | `ObservationOperationChainDTO` / provenance operations | aligned |
| Expected transition | video action-set policy and transition concepts | partial |
| Component contract | verification/audit contract concepts | partial |
| Evidence-boundary attribution | derived from source and representation lineage | emerging |
| Browser replay | explanatory reconstruction | not production replay |

## Claims Boundary

This application is a bounded explanatory browser reconstruction aligned with current ZeroModel concepts.

It does not claim to:

- run the complete production ZeroModel compiler;
- run the production SQL observation ledger;
- perform general computer vision;
- automatically understand arbitrary components;
- prove cross-domain performance;
- recover evidence absent from the source;
- perform causal discovery from observational evidence alone.

Current implementation mapping: static fixtures and JavaScript evaluation demonstrate the same conceptual boundary as the current ZeroModel observation, transition, contract, and provenance work.

Future integrated production capability: a later tool could consume real ZeroModel artifacts, observation DTOs, operation chains, and persisted replay bundles.

## Run Locally

Serve the repository root over HTTP:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/apps/transition-inspector/
```

Python is only a static file server here. The application runtime is HTML, CSS, JavaScript, Canvas, and JSON fixtures.

## Reproducibility

Use **Export investigation bundle** to download the selected fixture, policy identity, representation identity, contract, states, evidence classifications, verdict, provenance metadata, and application version.

This is not a complete ZeroModel replay bundle.
