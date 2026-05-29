# Capstone Monorepo Baseline

This repository is a clean monorepo baseline for a full-stack JavaScript capstone project.

It keeps the existing stack and workflow structure:

- Frontend: React app in packages/frontend
- Backend: Node.js + Express API in packages/backend
- Workspace management: npm workspaces at the repository root
- Spec-driven workflow: SpecKit assets under .specify and .github/prompts

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

Run from the repository root:

```bash
npm install
```

### Run the apps

```bash
npm run start
```

- Frontend: http://localhost:3000
- Backend health: http://localhost:3030/api/health

### Run tests

```bash
npm test
```

## Docs

- docs/project-overview.md
- docs/functional-requirements.md
- docs/ui-guidelines.md
- docs/coding-guidelines.md
- docs/testing-guidelines.md

Use these as your capstone source of truth. Start by filling out project overview and requirements before implementation.

