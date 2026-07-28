# ZeroModel Demos

**Runnable demonstrations, polished showcases, exploratory labs, and research experiments for [ZeroModel](https://github.com/ernanhughes/zeromodel).**

ZeroModel is a deterministic visual intelligence system: it compiles structured state, evidence, and decision logic into inspectable visual artifacts that can be addressed and evaluated without calling a model at decision time.

This repository is the public demonstration surface for that work. It is intentionally separate from the core ZeroModel repository:

- **ZeroModel core** proves the implementation, tests, evidence, and bounded claims.
- **ZeroModel Demos** explains, demonstrates, explores, and presents why the system matters.

## Repository map

| Area | Purpose | Stability | Typical audience |
|---|---|---:|---|
| [`demos/`](demos/) | Small, reproducible examples that teach one capability | Stable | Developers and evaluators |
| [`apps/`](apps/) | Browser-native workflows that combine multiple demo mechanisms | Prototype | Operators, evaluators, and technical users |
| [`showcase/`](showcase/) | Polished experiences designed for the website and product presentations | Curated | Customers, partners, and visitors |
| [`lab/`](lab/) | Interactive tools and workbenches for inspecting ZeroModel artifacts | Evolving | Researchers and technical users |
| [`experiments/`](experiments/) | Bounded investigations, prototypes, and negative findings | Unstable | Researchers and contributors |

## The distinction matters

A core example answers:

> Does this API and contract work?

A demo answers:

> Can someone understand and reproduce the capability?

A showcase answers:

> Why should anyone care?

A lab answers:

> How can I inspect, manipulate, or compare the artifacts?

An application answers:

> How do several ZeroModel mechanisms work together in an operational workflow?

An experiment answers:

> What happens when we test a new hypothesis or boundary?

## Initial demonstration programme

The first public demonstrations should make the current ZeroModel research sequence visible:

1. **Visual Policy Map lookup** — structured state becomes an addressable visual artifact.
2. **Transition evidence** — visible components are compared before and after an action.
3. **Value-aware contracts** — direction, magnitude, numeric state, and selected relations are checked.
4. **Representation failure** — coarse aggregation or geometry can erase evidence.
5. **Evidence Contract Compiler** — a bounded compiler selects an evidence-preserving representation.
6. **Observability boundary** — the system distinguishes a poor representation from an observation that never contained the required evidence.

The expanded [current test-case demo inventory](docs/current-test-case-demo-inventory.md) maps the present ZeroModel benchmark and P18 test surface into launch demos, technical demos, labs, showcases, and bounded experiments. The machine-readable candidates are listed in [`catalog.yaml`](catalog.yaml).

## Compatibility Matrix

| Application/Demo | ZeroModel mapping | Runtime | Status | Last verified |
| --- | --- | --- | --- | --- |
| Transition Inspector | Browser reconstruction of policy expectation, transition evidence, representation boundary, contract evaluation, and provenance metadata | static-browser | prototype | 2026-07-28 |
| State Chooses the Pixel | Browser reconstruction of visual policy address lookup | static-browser | prototype | 2026-07-27 |
| Edit the Intelligence | Browser reconstruction of policy-artifact substitution | static-browser | prototype | 2026-07-27 |
| Observe the Consequence | Browser reconstruction of action-to-observation lineage | static-browser | prototype | 2026-07-27 |
| Test the Transition | Browser reconstruction of visual transition contracts | static-browser | prototype | 2026-07-27 |
| Representation Matters | Browser reconstruction of evidence-preserving representation choices | static-browser | prototype | 2026-07-27 |
| Compile the Representation | Browser reconstruction of bounded representation selection | static-browser | prototype | 2026-07-27 |
| Observability Boundary | Browser reconstruction of source-vs-representation evidence loss | static-browser | prototype | 2026-07-27 |
| Cross-Domain Replication | Browser reconstruction of shared contract grammar across domains | static-browser | prototype | 2026-07-27 |
| Policy Profiles | Browser reconstruction of immutable policy profile swapping | static-browser | prototype | 2026-07-27 |
| Provenance and Replay | Browser reconstruction of lineage and replay concepts | static-browser | prototype | 2026-07-27 |

The current items in this repository are browser reconstructions. They do not directly import the ZeroModel Python packages unless a future item explicitly says so.

## Principles

Every published item should be:

- **Deterministic** where the underlying ZeroModel capability is deterministic.
- **Reproducible** from a pinned ZeroModel release or commit.
- **Inspectable** with intermediate artifacts available to the user.
- **Bounded** by explicit supported claims and non-claims.
- **Portable** enough to run locally before it is presented on the website.
- **Separated** from the core library so product presentation does not distort package design.

## Demo contract

Each item must include:

```text
README.md           explanation, setup, expected result, limitations
zeromodel-demo.yaml machine-readable metadata
src/ or app/        implementation
assets/             screenshots, VPMs, diagrams, or fixtures
tests/              focused deterministic checks where applicable
```

See [`templates/demo/`](templates/demo/) for the starter contract.

## Release alignment

Published demos should identify the exact ZeroModel release they target. The repository-level [`catalog.yaml`](catalog.yaml) is intended to become the machine-readable bridge between:

- GitHub releases;
- `zeromodel.org`;
- the ZeroModel demo deployment;
- AI Busan product pages;
- release blog posts.

The core repository remains the source of truth for validated claims. This repository may simplify their presentation, but it must not silently strengthen them.

## Status vocabulary

Use one of these states in `zeromodel-demo.yaml`:

- `planned`
- `prototype`
- `review`
- `published`
- `archived`

Use one of these classes:

- `demo`
- `showcase`
- `lab`
- `experiment`

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before adding a new item. New experiments may move quickly, but anything promoted to `demos/` or `showcase/` must have reproducible instructions and claims linked to evidence in the main ZeroModel repository.

## License

MIT. See [`LICENSE`](LICENSE).
