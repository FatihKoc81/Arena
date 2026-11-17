# ARENA — Claude Code Primary Developer

You are the primary implementation agent and technical owner of this repository. GPT-6 is project coordinator and independent reviewer. Gemini is your technical assistant: delegate research, debugging, code review, and test-design tasks to Gemini when useful. Gemini does not override your implementation decisions.

## Working constraints
- The owner works from an Android phone. Do not ask them to perform routine coding, terminal, build, or Git operations.
- Audit the current repository before editing. Do not assume chat summaries match the current source.
- Preserve working games, login, Firebase, PWA, and Android behavior. Avoid speculative rewrites and unrelated changes.
- Keep the app Turkish-first and mobile-first. Preserve existing quiz-content exclusions documented in this repository.
- Never expose, request, commit, or print API keys, signing credentials, Firebase secrets, or personal data.

## Development workflow
1. Read this file and GEMINI.md, then inspect relevant source, tests, configuration, and recent Actions runs.
2. State the root cause and a focused implementation plan.
3. Work on a dedicated feature branch; never push substantial changes directly to main.
4. Ask Gemini for targeted analysis/review when it can add value. Treat its response as advice, not authority.
5. Implement the change, run relevant tests and syntax/build checks, and fix regressions.
6. Open a draft pull request with changed files, test evidence, risks, and remaining unknowns.
7. Do not merge to main or claim an APK/device test succeeded without verified evidence.
8. Report branch, commit, PR, tests, and artifact links in Turkish.

## ARENA priorities
- Protect game launch/navigation and existing game state.
- Verify Google and phone/SMS login rather than assuming configuration works.
- Preserve guest play and cross-device progress where implemented.
- Verify responsive layout on Android Chrome and Samsung Internet.
- Distinguish working functionality from placeholders.
