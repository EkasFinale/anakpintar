# Cloud Save integration checkpoint

Status: development prototype, not ready for production or merge.

## Setup
1. Create a Firebase project, add a Web App, copy public Web App config into firebase/config.js.
2. Enable Firebase Authentication Email/Password. Create a parent user in Firebase Console.
3. Add the GitHub Pages domain to Firebase Authentication authorized domains.
4. Create Cloud Firestore. Deploy firebase/firestore.rules after testing with Firebase Emulator.
5. Open the development deployment over HTTPS and log in as the parent.

## Architecture
- Existing localStorage remains the immediate save target.
- The optional firebase/cloud-save.js module uploads and downloads profiles by parent UID.
- Each child profile is stored in families/{uid}/children/{profileId}.
- New learning events receive random UUIDs; achievement merge uses max values.
- Parent-only rules isolate family data by Firebase UID.

## Blocking limitations
- No Firebase project has been configured or connected.
- No live Firestore, emulator, automated browser, or multi-device test has been executed.
- Snapshot writes can lose concurrent changes; proper transactional event append and deterministic replay are required before production.
- Historical events without IDs may collide in the fallback migration; a stable one-time migration is needed.
- Child deletion is not synchronized as a tombstone.
- Login uses temporary browser prompts, not a finished parent UX.
- Firestore document size may become a problem for long event histories.
- Do not merge or deploy as production until P0 gaps are fixed and tests pass.

## Rollback
Do not merge this branch. If testing a preview, remove the firebase/cloud-save.js script tag to restore local-only behavior.
