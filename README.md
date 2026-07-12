# RTOS Scheduler

A small React + TypeScript app for visualizing real-time task scheduling, built alongside the *Embedded Operating Systems* course at UniVR.

Add periodic or aperiodic tasks (period, CPU time, arrival time, deadline) and watch them get scheduled tick-by-tick under some algorithm.

## Features

- **Task manager** — add/remove tasks with period, CPU time, arrival time and deadline
- **Scheduler simulation** — tick-by-tick trace over one hyperperiod, with proper periodic job releases (each task re-runs every period, not just once)
- **Utilization factor** — U = ΣCᵢ/Tᵢ, checked against the Liu & Layland bound
- **Schedulability check** — flags missed deadlines directly in the simulated trace

## Tech stack

- React + TypeScript
- react-router

## Getting started
### local access
you need to clone the repo, install react and execute command below
```bash
npm install
npm run dev
```

### web access
[click here](https://rtos-scheduler.vercel.app/)


## Project structure

```
App.tsx           # app shell / layout
menu.tsx          # top navigation bar
manageTask.tsx     # task table + add/remove form
scheduler.tsx      # algorithm picker, trace, utilization 
algorithms.tsx     # scheduling simulation, utilization 
```

## Roadmap

- Aperiodic-serving policies (polling, deferrable, background server, total bandwidth server)
- Theory page with algorithm explanations
- web link to acess without installing react and clone repo
