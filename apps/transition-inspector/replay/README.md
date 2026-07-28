# Future Replay Integration

The browser export is an explanatory investigation bundle. A future production replay command would consume it alongside real ZeroModel artifacts and persisted observation records.

A future command could:

1. load the exported JSON bundle;
2. resolve the policy artifact identity against a trusted artifact store;
3. resolve source observations and operation chains from the ZeroModel ledger;
4. rebuild the expected transition from the policy and transition contract;
5. compare the persisted actual observation against the declared contract;
6. verify that provenance operations and content identifiers match the exported record.

This directory intentionally does not include a fake `replay.py`. Printing a predetermined verdict would misrepresent replay. The current app exports a deterministic browser reconstruction only.
