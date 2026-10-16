# BelvaDeva — initial technical audit (2026-10-16)

Baseline: EkasFinale/anakpintar, main. Development branch: feature/cloud-save-foundation.

## Verified by source inspection
- index.html declares BelvaDeva V10.3.1 and loads separate JS modules, including profiles.js, storage.js, game.js and app.js.
- js/profiles.js uses localStorage key `belvadeva-v9` and schemaVersion 10, retaining migration support for version 9 and a legacy key.
- js/game.js saves in-progress runs to profile.resume, including on pause and answers.
- js/storage.js requests persistent browser storage where supported, but this is not cross-device sync.
- js/profiles.js stores events with day/mission/first/attempts/hints but no globally unique event ID.
- js/profiles.js merge() can replace an existing profile, so it is not a safe multi-device reconciliation strategy.
- No Firebase client integration was observed in the inspected app entrypoint/modules.

## Priority findings
- P0: Cloud persistence absent; local progress can be lost on device change or browser data deletion.
- P0: Cross-device merge needs stable event IDs, idempotent writes, and a conflict policy before activation.
- P0: Firebase rules must restrict family paths to authenticated owners, and be emulator-tested.
- P1: Local persistence errors are exposed via warning but need an unmistakable save-status UI.
- P1: Import merge may overwrite a profile with same name; migration must be non-destructive.
- P1: Parent account/authentication flow is not integrated.
- P2: Automated regression, mobile interaction and educational quality need independent testing.

## Implementation decision
1. Preserve the V10.3.1 application and existing localStorage schema.
2. Introduce append-only, uniquely identified learning events under /families/{uid}/children/{childId}/events/{eventId}.
3. Derive durable achievements from deduplicated events, never by summing snapshots from different devices.
4. Keep local save as primary fallback until end-to-end cloud sync passes tests.
5. No Firebase keys, user accounts, or live data are provisioned by this branch.
6. Never deploy Firestore rules to production without emulator tests and explicit project configuration.

## QA status
Source inspection only. No browser tests, Firestore emulator tests, or device tests have been run. The Firestore rules file is a preliminary implementation requiring validation. Main branch is unchanged.
