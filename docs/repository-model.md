# Repository Model

## Purpose

`zeromodel-demos` is the public demonstration and product-experience repository for ZeroModel. It must remain separate from the core package repository so that presentation needs do not distort library architecture, benchmark evidence, or release discipline.

## Repository responsibilities

### Core ZeroModel repository

Owns:

- package implementation;
- public APIs;
- deterministic tests;
- benchmark protocols;
- frozen research evidence;
- claims audit;
- package and product releases.

### ZeroModel Demos repository

Owns:

- teaching examples;
- public demonstrations;
- polished product showcases;
- interactive artifact-inspection tools;
- exploratory demonstration experiments;
- website-consumable demo metadata.

### `zeromodel.org`

Owns:

- product explanation;
- release pages;
- documentation navigation;
- embedded or linked showcases;
- public installation and evaluation journey.

### AI Busan

Owns:

- company positioning;
- ZeroModel as the foundation product;
- customer and partner framing;
- contact and commercial pathways.

## Information flow

```text
zeromodel release and claims
    ↓
versioned release manifest
    ↓
zeromodel-demos catalog and pinned items
    ↓
zeromodel.org product presentation
    ↓
AI Busan company presentation
```

The core repository is authoritative for factual product and research claims. Downstream surfaces may adapt language to their audiences but must retain the same boundaries.

## Item lifecycle

```text
planned
    ↓
prototype
    ↓
review
    ↓
published
    ↓
archived
```

An item class and status are independent. For example, a lab can be published while still being described as evolving.

## Promotion model

```text
experiment
    ├──→ lab
    └──→ demo
             ↓
          showcase
```

Promotion means the purpose and obligations have changed. It should involve an explicit review of reproducibility, claims, presentation, and release compatibility.

## Deployment boundary

This repository may eventually host several deployable applications. Do not force every item into one framework prematurely. Shared website or deployment infrastructure should emerge only after at least two real items demonstrate the same need.

Each deployable item should be independently identifiable through `zeromodel-demo.yaml` and should avoid hidden coupling to another item.
