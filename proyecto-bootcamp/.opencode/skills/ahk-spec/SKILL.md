---
name: ahk-spec
description: Turn approved use cases or a product request into a linked functional specification.
---

## Provider Delegation Guidance

- Sequential: Use @<role-name> to delegate to a specific agent. Child sessions need a self-contained objective.
- Parallel: Launch multiple @mentions in a single message for parallel work.
- Context Transfer: Each child session needs: objective, scope, known context, restrictions, output contract.
- Wait For Completion: Wait for each @mention to complete before proceeding.


Locate relevant context with `specs.list`, `specs.search`, and `specs.get`. A functional spec defines the product scope, rules, exclusions, acceptance criteria, decisions, and unresolved questions. It does not select implementation details.

Read [the workflow](resources/workflow.md) and [the template](resources/template.md) before saving.

When based on use cases, reference every approved upstream use case with `sourceUseCases`. Create a `spec` draft in `docs/specs/`, save a coherent draft before approval, validate after every write, and transition only after the user explicitly approves it. A changed approved upstream use case sends this spec to `needs-decision` and derived technical work to `needs-reconciliation`.

Use `feature` or `fix` only where those existing specialized workflows fit. Offer `ahk-spec-tech` only after the functional source is approved.
