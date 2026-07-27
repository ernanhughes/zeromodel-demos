# Demo 04 — Test the Transition

This demo compares raw pixel difference with a declared visual transition contract.

The contract checks:

- whether the required component changed;
- whether it changed in the expected direction;
- whether protected components remained stable.

The browser scenarios are explanatory reconstructions of the transition-evidence idea. They do not reproduce the complete ZeroModel benchmark or its measured results.

Run from the repository root:

```bash
python -m http.server 8000
```

Open `/demos/test-the-transition/`.