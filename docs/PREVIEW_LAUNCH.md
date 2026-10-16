# BelvaDeva Cloud Preview — launch checklist

This is a development build. Do not replace the production GitHub Pages site or merge the draft PR.

## Build
The GitHub Actions workflow `Cloud Preview Artifact` runs on updates to this PR. Open the latest successful workflow run and download `belvadeva-cloud-preview`.

## HTTPS preview
The downloaded files are a static website. Upload the extracted folder to an **isolated** HTTPS static host (separate site/project, not the current GitHub Pages production site). Keep the directory structure intact and serve `index.html` at its root.

In Firebase Console > Authentication > Settings > Authorized domains, add the exact preview hostname. Use only your own test parent account. Never add credentials to source files.

## Test before release
1. Sign in with the test parent account and verify Firestore data appears only under that UID.
2. Complete one Belva mission and check a matching profile record in Firestore.
3. Sign in from a second browser, verify the progress is restored.
4. Repeat with Deva and verify both profiles stay separate.
5. Simulate offline use, reconnect, and verify both local and remote progress.
6. Test two browsers completing different missions before synchronizing.
7. Verify an unrelated authenticated user cannot read or write the first family's data.
8. Verify unauthenticated reads/writes fail.
9. Confirm the game remains playable when Firebase is unavailable.
10. Verify the service worker updates after deployment.

## Release blockers
- A real HTTPS preview host and Firebase parent account are required.
- Rules need emulator validation.
- The snapshot-based sync still needs comprehensive conflict and deletion handling.
- Tests currently cover only limited merge behavior, not browser/Firebase integration.
- No claim of production readiness until all scenarios pass.

## Rollback
Keep production on `main`. Disable the separate preview site or remove the Firebase module from the preview entrypoint.
