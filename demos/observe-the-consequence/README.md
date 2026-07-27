# Demo 03 — Observe the Consequence

This demo connects a visual policy decision to an observable state transition.

```text
state → visual address → decoded action → visible consequence
```

It isolates three responsibilities:

- the policy grid chooses the action;
- ordinary JavaScript applies that action;
- before/after frames expose the consequence for inspection.

The scenarios are deliberately small and hand-authored. This is an explanatory browser reconstruction, not a claim that the current ZeroModel compiler generated the policy.

Run from the repository root:

```bash
python -m http.server 8000
```

Open `/demos/observe-the-consequence/`.