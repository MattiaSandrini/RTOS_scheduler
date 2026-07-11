//lista di tutti gli algoritmi ognuno con una funzione per calcolarlo

/*
List of algorithm
    Jackson - EDD (1 | sync | Lmax) [aperidic]
        Horn - EDF (1 | preem | Lmax) [aperidic]
    LDF - tasks with precedence [aperidic]
    modified EDF  (1 | (prec, preem) | Lmax) [aperidic]
    Cyclic Executive [periodic]
    Rate Monotonic [periodic]
        EDF [periodic]
    Deadline Monotonic - T > d [periodic]
        EDF - T > d [periodic]
    Immediate service [aperiodic, periodic]
    background Scheduling [aperiodic, periodic]
    RM + Polling Server [aperiodic, periodic]
    RM + Deferrable Server [aperiodic, periodic]
    EDF Polling Server [aperiodic, periodic]
    EDF + Deferrable Server [aperiodic, periodic]
    Total Bandwith Server [aperiodic, periodic]

*/

type TaskProd = {
  Name: string;
  Period: number;
  CpuTime: number;
  ArrivalTime: number;
  Deadline: number;
};

// a "Job" is one runtime instance of a task: same static data as TaskProd,
// plus the mutable state needed to simulate periodic releases (remaining
// budget for the current instance + its own absolute deadline, which moves
// forward every period).
type Job = TaskProd & {
  remaining: number;
  absDeadline: number;
  relDeadline: number;
  everReleased: boolean;
};

function edf(ready: Job[]): Job {
  return ready.reduce((best, job) =>
    job.absDeadline < best.absDeadline ? job : best,
  );
}

function rm(ready: Job[]): Job {
  // shorter period => higher priority.
  // Aperiodic jobs (Period === -1) have no "rate", so under plain RM they
  // are simply run at the lowest priority here. Real aperiodic-serving
  // policies (polling/deferrable/background/...) are a separate concern.
  return ready.reduce((best, job) => {
    if (job.Period === -1) return best;
    if (best.Period === -1) return job;
    return job.Period < best.Period ? job : best;
  });
}

type Instance = { release: number; finish: number | null };

// core tick-by-tick simulation, shared by dist() (the schedule trace) and
// calcObservedResponseTimes() (per-instance timing)
export function simulate(tasks: TaskProd[], algo: string) {
  const jobs: Job[] = tasks.map((task) => ({
    ...task,
    remaining: 0,
    absDeadline: 0,
    // deadline given relative to the task's first arrival, re-applied
    // to every subsequent release
    relDeadline: task.Deadline - task.ArrivalTime,
    everReleased: false,
  }));

  const instances: Record<string, Instance[]> = {};
  tasks.forEach((t) => {
    instances[t.Name] = [];
  });

  // simulate exactly one hyperperiod; if there are no periodic tasks at
  // all, fall back to covering every aperiodic task's deadline once
  const horizon =
    CalcMajor(tasks) || Math.max(1, ...tasks.map((t) => t.Deadline));

  const trace: string[] = [];
  let missedDeadline = false;

  for (let t = 0; t < horizon; t++) {
    // a task instance whose deadline has already arrived but that still
    // needs CPU time has missed its deadline. This MUST run before releases
    // below, otherwise a new instance's reset would silently erase the
    // overrun of the instance it's replacing.
    jobs.forEach((job) => {
      if (job.remaining > 0 && t >= job.absDeadline) {
        missedDeadline = true;
      }
    });

    // release a new instance of every task that is due at this tick
    jobs.forEach((job) => {
      const sinceArrival = t - job.ArrivalTime;
      const isDue =
        job.Period > 0
          ? sinceArrival >= 0 && sinceArrival % job.Period === 0
          : sinceArrival === 0 && !job.everReleased;

      if (isDue) {
        job.remaining = job.CpuTime;
        job.absDeadline = t + job.relDeadline;
        job.everReleased = true;
        instances[job.Name].push({ release: t, finish: null });
      }
    });

    const ready = jobs.filter((job) => job.remaining > 0);

    if (ready.length === 0) {
      trace.push("idle ");
      continue;
    }

    const chosen =
      algo === "EDF" ? edf(ready) : algo === "RM" ? rm(ready) : ready[0];

    chosen.remaining--;
    trace.push(chosen.Name + " ");

    if (chosen.remaining === 0) {
      const list = instances[chosen.Name];
      const last = list[list.length - 1];
      if (last && last.finish === null) last.finish = t;
    }
  }

  trace.push(missedDeadline ? "set not schedulable" : "set schedulable");
  return { trace, instances };
}

export function dist(tasks: TaskProd[], algo: string) {
  return simulate(tasks, algo).trace;
}

function gcd(a: number, b: number) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

export function CalcMajor(tasks: TaskProd[]) {
  // only periodic tasks (Period > 0) contribute to the hyperperiod;
  // aperiodic tasks (Period === -1) run once and don't repeat
  const periodic = tasks.filter((t) => t.Period > 0);
  if (periodic.length === 0) return 0;

  let major: number = periodic[0].Period;
  periodic.forEach((x) => {
    major = (x.Period * major) / gcd(x.Period, major);
  });

  return major;
}

// ---- utilization factor ----

export type UtilizationResult = {
  utilization: number;
  bound: number;
  boundOk: boolean;
  // RM's bound (Liu & Layland) is a sufficient-only test: U under the bound
  // guarantees schedulability, but U over it doesn't necessarily mean failure.
  // EDF's bound (U <= 1) is necessary AND sufficient when D === T for every task.
  boundIsExact: boolean;
};

export function calcUtilization(
  tasks: TaskProd[],
  algo: string,
): UtilizationResult {
  const periodic = tasks.filter((t) => t.Period > 0);
  const utilization = periodic.reduce(
    (sum, t) => sum + t.CpuTime / t.Period,
    0,
  );
  const n = periodic.length;

  if (algo === "EDF") {
    const allImplicitDeadlines = periodic.every(
      (t) => t.Deadline - t.ArrivalTime === t.Period,
    );
    return {
      utilization,
      bound: 1,
      boundOk: utilization <= 1,
      boundIsExact: allImplicitDeadlines,
    };
  }

  const bound = n > 0 ? n * (Math.pow(2, 1 / n) - 1) : 0;
  return {
    utilization,
    bound,
    boundOk: utilization <= bound,
    boundIsExact: false,
  };
}
