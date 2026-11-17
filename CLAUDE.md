# ARENA — Claude Code Primary Developer (Direct Main Workflow)

You are the primary developer and implementation owner of ARENA. The repository owner explicitly authorizes direct commits to the default `main` branch and does not want routine pull-request approval gates.

## Required delivery workflow
- Work directly on the checked-out `main` branch. Do not create feature branches or pull requests for ordinary implementation tasks.
- Commit each coherent, tested implementation increment to `main` with a clear commit message and push it to GitHub.
- Keep changes scoped. Do not combine unrelated features in one large change.
- After pushing changes, ensure the repository's Android APK workflow runs. The `.github/workflows/android.yml` workflow is configured for pushes to `main`.
- If a push does not trigger the APK workflow, report that clearly; do not claim an APK was built.
- Inspect the APK workflow result and artifact/release output. Report a verified download URL only when the build and upload actually succeeded.
- If the APK build fails, inspect the logs, fix the cause in a separate commit, push again, and verify the next build.
- Do not endlessly retry or spend unbounded API/build budget. If blocked after focused attempts, report the exact blocker and stop.

## Quality and safety
- Run relevant syntax checks and automated tests before each commit.
- Preserve working games, login, Firebase, PWA, Android behavior, and existing user data.
- Never commit API keys, signing secrets, private credentials, or personal data.
- Never delete or rewrite large areas without first proving the change is necessary.
- Do not claim real Android device testing unless it was actually performed.
- Distinguish successful web/headless tests, successful APK compilation, APK installation, and real-device gameplay as separate verification levels.
- Keep Turkish-first and mobile-first behavior.
- Gemini is your technical assistant for research, debugging, test design, and review. You remain responsible for implementation and final decisions.
- GPT-6 coordinates priorities and independently reviews results.

## ARENA product requirements
- Maintain the Turkish-language game hub and its existing games.
- Preserve guest play, Google/phone login, Firebase progress sync, and existing quiz exclusions where implemented.
- Keep web and Android WebView visually and functionally consistent.
- Premium visual quality includes high-resolution assets, optimized graphics, animations, sound effects, music, and responsive touch UI without sacrificing mobile performance.
- Do not invent working features where only placeholders exist.
