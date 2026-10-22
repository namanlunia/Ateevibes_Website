# Permanent Dead-Code Prevention & Quality Rules

All AI agents and developers working on the Ateevibes repository must adhere strictly to these rules:

- **Never write dead code**: No unused imports, variables, parameters, props, state, functions, components, hooks, types, files, CSS classes, keyframes, CSS variables, assets or dependencies.
- **No commented-out code, debuggers, or console calls**: No debugger statements, no `console.log` (or `console.warn`/`console.error` outside the ErrorBoundary), no speculative "for later" code, no placeholder stubs, and no duplicate old versions of files. Every new file must be imported or referenced; every new export must be used.
- **Delete on replacement**: When code is replaced or a feature is removed, delete everything that only existed to support it (files, imports, styles, assets, tests, dependencies) in the same task.
- **Clean up artifacts**: Remove temporary, scratch, debug, log, backup and generated files you create during a task before finishing.
- **Run verification checks before completion**: Before finishing ANY task, run `npm run check` and `npm run build`. If anything reports unused or dead code, delete it before reporting the task complete, and mention "dead code removed: <list or none>" in the final summary.
- **Preserve behavior and editable placeholders**: Never change visible behaviour while removing dead code, and keep anything that is referenced dynamically or listed in `TODO.md` as an editable placeholder.
