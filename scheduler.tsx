import { useState } from "react";
import { CalcMajor, dist, calcUtilization } from "./algorithms";
import "./scheduler.css";

type TaskProd = {
  Name: string;
  Period: number;
  CpuTime: number;
  ArrivalTime: number;
  Deadline: number;
};

type Props = {
  tasks: TaskProd[];
};

type Tlink = {
  id: string;
  value: string;
};

const TASK_COLORS = [
  "#5fd4c4",
  "#ffb454",
  "#8f7ee6",
  "#ff8fa3",
  "#7ee6b0",
  "#6ea8ff",
];

export default function Scheduler({ tasks }: Props) {
  const [algo, setAlgo] = useState("RM");

  const links: Tlink[] = [
    {
      id: "RM",
      value: "https://en.wikipedia.org/wiki/Rate-monotonic_scheduling",
    },
    {
      id: "EDF",
      value: "https://en.wikipedia.org/wiki/Earliest_deadline_first_scheduling",
    },
  ];

  function retLink(algo: String) {
    let value: string = "0";
    links.map((link) => {
      if (link.id === algo) {
        value = link.value;
      }
    });
    return value;
  }

  const colorFor = (name: string) => {
    const idx = tasks.findIndex((t) => t.Name === name);
    return TASK_COLORS[(idx < 0 ? 0 : idx) % TASK_COLORS.length];
  };

  const result = dist(tasks, algo);
  const isStatus = (s: string) => s.startsWith("set ");
  const ticks = result.filter((s) => !isStatus(s));
  const status = result.find((s) => isStatus(s));

  const util = calcUtilization(tasks, algo);
  const utilPct = Math.min(
    100,
    (util.utilization / Math.max(util.bound * 1.15, 1)) * 100,
  );
  const boundPct = Math.min(
    100,
    (util.bound / Math.max(util.bound * 1.15, 1)) * 100,
  );

  return (
    <>
      <h4 className="eyebrow-heading panel-title">Scheduler</h4>
      <div className="scheduler-panel">
        <label className="algo-field">
          <span>choose the algorithm for scheduling</span>
          <div className="algo-toggle">
            <button
              type="button"
              className={algo === "RM" ? "active" : ""}
              onClick={() => setAlgo("RM")}
            >
              Rate Monotonic
            </button>
            <button
              type="button"
              className={algo === "EDF" ? "active" : ""}
              onClick={() => setAlgo("EDF")}
            >
              Earliest Deadline First
            </button>
            <button
              type="button"
              className={algo === "EF" ? "active" : ""}
              onClick={() => setAlgo("EF")}
            >
              Earliest First
            </button>
          </div>
        </label>

        <p className="scheduler-meta">
          here you set of tasks scheduled with{" "}
          <a href={retLink(algo)} target="_blank">
            {algo}
          </a>{" "}
          and major <strong>{CalcMajor(tasks)}</strong>, number of tasks{" "}
          <strong>{tasks.length}</strong>
        </p>

        <div className="trace-frame">
          <div className="trace-strip">
            {ticks.map((t, i) => {
              const name = t.trim();
              return (
                <span
                  key={i}
                  className={"tick" + (name === "idle" ? " idle" : "")}
                  style={
                    name === "idle"
                      ? undefined
                      : ({
                          "--task-color": colorFor(name),
                        } as React.CSSProperties)
                  }
                  title={`tick ${i}: ${name}`}
                >
                  {name}
                </span>
              );
            })}
          </div>
          {status && (
            <p
              className="scheduler-meta"
              style={{
                marginTop: 10,
                color:
                  status === "set schedulable"
                    ? "var(--teal)"
                    : "var(--danger)",
              }}
            >
              {status}
            </p>
          )}
        </div>

        <div className="trace-legend">
          {tasks.map((t) => (
            <span className="trace-legend-item" key={t.Name}>
              <span
                className="trace-legend-swatch"
                style={
                  { "--swatch-color": colorFor(t.Name) } as React.CSSProperties
                }
              />
              {t.Name}
            </span>
          ))}
        </div>

        {/* ---- utilization factor ---- */}
        <div className="metric-block">
          <h5 className="eyebrow-heading metric-title">Utilization factor</h5>
          <div className="meter">
            <div className="meter-track">
              <div
                className={"meter-fill" + (util.boundOk ? "" : " over")}
                style={{ width: `${utilPct}%` }}
              />
              <div className="meter-mark" style={{ left: `${boundPct}%` }} />
            </div>
            <div className="meter-labels">
              <span>
                U = <strong>{util.utilization.toFixed(3)}</strong>
              </span>
              <span>
                bound ({algo === "RM" ? "Liu & Layland" : "U \u2264 1"}) ={" "}
                <strong>{util.bound.toFixed(3)}</strong>
              </span>
            </div>
          </div>
          <p className="metric-note">
            {util.boundIsExact
              ? util.boundOk
                ? "U is within the bound: the exact schedulability test says this set is schedulable."
                : "U exceeds 1: this set is not schedulable under EDF."
              : util.boundOk
                ? "U is under the Liu & Layland bound: this is a sufficient condition, so the set is guaranteed schedulable."
                : "U is over the Liu & Layland bound. This is only a sufficient test, not necessary \u2014 check the response-time analysis below before concluding it's unschedulable."}
          </p>
        </div>
      </div>
    </>
  );
}
