# Demos

Demos are small, reproducible explanations of established ZeroModel capabilities.

A demo should answer one clear question, require minimal setup, and expose the intermediate artifacts that make the result inspectable.

## Admission criteria

A demo belongs here when:

- the underlying capability exists in a released or pinned ZeroModel revision;
- the result is deterministic or its variability is explicitly bounded;
- setup and expected output are documented;
- claims link back to evidence in the main repository;
- the example teaches one principal idea rather than presenting an entire product.

## Planned demos

- `visual-policy-lookup`
- `transition-evidence`
- `value-aware-contracts`
- `compiled-representation-selection`

## Suggested structure

```text
<slug>/
├── README.md
├── zeromodel-demo.yaml
├── src/
├── assets/
└── tests/
```

Start from [`../templates/demo/`](../templates/demo/).
