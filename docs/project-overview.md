# Project Overview

## Introduction

This repository is a fresh baseline for a full-stack JavaScript capstone built with a monorepo.

Use this document to describe the product you are building, who it serves, and the outcomes that define success.

## Architecture

The project follows a monorepo architecture with the following structure:

- `packages/frontend/`: React-based web application
- `packages/backend/`: Express.js API server

## Technology Stack

### Frontend
- React
- React DOM
- CSS for styling
- Jest for testing

### Backend
- Node.js
- Express.js
- Configurable persistence strategy (SQLite first, PostgreSQL-ready migration path)
- Jest for testing

## Capstone Definition (Fill In)

### Product Name
- Fantasy Football Playoffs Draft

### Problem Statement
- Traditional fantasy platforms focus on regular season and are not readily available for users for NFL Playoffs formats.
- Friends who want a short, customized playoff experience need fast league setup, synchronous drafting, and transparent scoring.
- Existing tools do not reliably support playoff snake drafts with real-time countdown-based picks and live standings.
- This product provides a dedicated playoff fantasy experience from league creation through scoring and standings.

### Target Users
- Commisioners creating and managing a playoff league
- Casual participants joining private leagues for friendly competition
- Competitve users who want clear scoring rules, real-time standings, and customizable features

### Core User Journeys
- Create and join league: commissioner creates league, shares invite code, participants join.
- Live snake draft: all users enter draft room, timer enforces pick windows, auto-pick on timeout.
- Scoring and standings: system ingests player stats, computes team totals, displays ranked standings.
- Commissioners can also configure various league settings (number of entrants, scoring system, eligible positions for player selection, etc)

### Scope Guardrails
- Payments, prizes, and wagering.
- Mobile native apps.
- Dynasty/keeper formats.
- Trade system after draft.
- Public leagues and matchmaking.
- Multi-season history and analytics dashboards.

### Success Metrics
- Time to create and fill a league under 5 minutes.
- Drafts complete without manual admin intervention (though manual admin intervention is supported)
- Stat ingestion to update standings virtually instantaneously (as fast as live data can be relayed via external APIs) during games
- Precise scoring with nonexistent scoring discrepancies between leagues and real-life statistics from data providers
- Experience is enjoyable enough that at least 70% of users return for the following season


## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository
2. Run `npm install` at the root of the project to install all dependencies
3. Start the development environment using `npm run start`

## Development Workflow

The project uses npm workspaces to manage the monorepo structure. You can:

- Run `npm run start` from the root to start both frontend and backend in development mode
- Run `npm test` from the root to run tests for all packages
- Work on individual packages by navigating to their directories and using their specific scripts

## Deployment

Deployment approach and environments should be defined once MVP requirements are approved.
