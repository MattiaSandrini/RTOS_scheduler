import "./App.css";
import { NavLink } from "react-router";
import NavBar from "./menu.tsx";
import TableTask from "./manageTask.tsx";
import Scheduler from "./scheduler.tsx";
import { useState } from "react";

type TaskProd = {
  Name: string;
  Period: number;
  CpuTime: number;
  ArrivalTime: number;
  Deadline: number;
};

function App() {
  /*
PAGINA APP:
  tabella
  form
  scheduler (gantt)
PAGINA TEORIA
  vari algoritmi
*/
  const [tasks, setTask] = useState<TaskProd[]>([
    {
      Name: "T1",
      Period: 8,
      CpuTime: 4,
      ArrivalTime: 0,
      Deadline: 8,
    },
    {
      Name: "T2",
      Period: 4,
      CpuTime: 1,
      ArrivalTime: 2,
      Deadline: 6,
    },
  ]);
  /*
TODO
  implementazione dinamica della form e della tabella
OK  modal window o simili per aggiungere un nuovo task
OK  costruire dinamicamente la tabella dei task in base ai task presenti
OK    aggiungere il modo di rimuovere un task

add task
  filtro per far aggiungere solo quelli con nome diverso

  
OK  implementare scheduler
  OK  scelta algoritmo
  OK  href con riferimento all'algoritmo nella tab teoria (href alla pagina wiki)
  OK    simulation metrics
  OK  calc major
  OK  lista con task schedulati ogni tick

  tab teoria con spiegazione degli algoritmi 

OK  css per rendere tutto piu fancy (ai-driven)
*/
  return (
    <>
      <NavBar />
      <div className="app-shell">
        <section id="center" className="panel intro-panel">
          <h2 className="eyebrow-heading">Introduction</h2>
          <p>
            This is a RTOS scheduler linked to the course{" "}
            <a
              href="https://www.corsi.univr.it/?ent=cs&id=1291&menu=studiare&tab=insegnamenti&codiceCs=S86R&codins=4S009005"
              target="_blank"
            >
              Embedded Operating System
            </a>
          </p>
          <NavLink to="/theory" className="theory-link">
            theory
          </NavLink>
        </section>

        <div id="task" className="panel">
          <TableTask tasks={tasks} setTask={setTask} />
        </div>

        <div className="panel">
          <Scheduler tasks={tasks} />
        </div>
      </div>
    </>
  );
}

export default App;
