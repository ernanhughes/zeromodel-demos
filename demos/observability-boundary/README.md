# Demo 07 — Observability Boundary

This static browser demo distinguishes three outcomes:

1. evidence present in the source and preserved by the representation;
2. evidence present in the source but erased by the representation;
3. evidence absent from the source observation itself.

The ZeroModel idea is **observability-boundary attribution**: do not blame compression for information the source never contained, and do not blame the source when the representation discarded recoverable evidence.

This is a bounded explanatory reconstruction, not a reproduction of the complete production benchmark or compiler.

Run from the repository root:

```bash
python -m http.server 8000
```

Open `/demos/observability-boundary/`.