# AI Operating Guardrails

- Read `AGENTS.md` before editing.
- Keep runtime behavior stable unless the user explicitly requests a behavior
  change.
- State the affected surface and blast radius before edits.
- Do not invent verification evidence. Report exact commands and outcomes.
- Do not create or commit secrets, `.env` files, private keys, or production
  credentials.
- Do not replace the mission or bridge command plane.
- If app behavior changes, add focused regression coverage or record why tests
  are blocked.
- If a change touches deploy, release, auth, data access, or external
  integrations, update the relevant contract under `.jarvis/` or `docs/`.
