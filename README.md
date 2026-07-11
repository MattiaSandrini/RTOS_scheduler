# RTOS Scheduler

A small React + TypeScript app for visualizing real-time task scheduling, built alongside the *Embedded Operating Systems* course at UniVR.

Add periodic or aperiodic tasks (period, CPU time, arrival time, deadline) and watch them get scheduled tick-by-tick under **Rate Monotonic** or **Earliest Deadline First**.

## Features

- **Task manager** — add/remove tasks with period, CPU time, arrival time and deadline
- **Scheduler simulation** — tick-by-tick trace over one hyperperiod, with proper periodic job releases (each task re-runs every period, not just once)
- **Utilization factor** — U = ΣCᵢ/Tᵢ, checked against the Liu & Layland bound (RM) or U ≤ 1 (EDF)
- **Worst-case response time** — classical fixed-priority response-time analysis for RM, observed worst response time from simulation for EDF
- **Schedulability check** — flags missed deadlines directly in the simulated trace

## Tech stack

- React + TypeScript
- react-router

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
App.tsx           # app shell / layout
menu.tsx          # top navigation bar
manageTask.tsx     # task table + add/remove form
scheduler.tsx      # algorithm picker, trace, utilization & WCRT panels
algorithms.tsx     # scheduling simulation, utilization and WCRT math
```

## Roadmap

- Aperiodic-serving policies (polling, deferrable, background server, total bandwidth server)
- Theory page with algorithm explanations
