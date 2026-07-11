import { useState } from "react";
import "./manageTask.css";

const AttrTask = ["Name", "Period", "CPU time", "Arrival Time", "Deadline"];

type TaskProd = {
  Name: string;
  Period: number;
  CpuTime: number;
  ArrivalTime: number;
  Deadline: number;
};

type Props = {
  tasks: TaskProd[];
  setTask: React.Dispatch<React.SetStateAction<TaskProd[]>>;
};

export default function TableTask({ tasks, setTask }: Props) {
  const [isModalOpen, setModal] = useState(false);

  function addTask(formData: FormData) {
    const newTask: TaskProd = {
      Name: String(formData.get("Name")),
      Period:
        Number(formData.get("Period")) != 0
          ? Number(formData.get("Period"))
          : -1,
      CpuTime: Number(formData.get("CPU time")),
      ArrivalTime: Number(formData.get("Arrival Time")),
      Deadline:
        Number(formData.get("Deadline")) != 0
          ? Number(formData.get("Deadline"))
          : Number(formData.get("Period")),
    };
    console.log(newTask.Name);
    setTask((tasks) => [...tasks, newTask]);
    closeTask();
  }

  function delTask(nome: string) {
    setTask((tasks) => tasks.filter((task) => task.Name !== nome));
  }

  function handleTask() {
    setModal(true);
  }
  function closeTask() {
    setModal(false);
  }

  return (
    <>
      <div className="task-panel-header">
        <h3 className="eyebrow-heading panel-title">Task set</h3>
        <button className="add-task-btn" onClick={handleTask}>
          Add new Task
        </button>
      </div>

      {isModalOpen && (
        <div id="windowTask" className="modal">
          <div id="modal-content">
            <button id="close" className="close" onClick={closeTask}>
              &times;
            </button>
            <h4 className="eyebrow-heading">Add here a new task!</h4>
            <ul className="modal-hint">
              <li>leave blank period if aperiodic</li>
              <li>Priority is set by the algorithm you choose</li>
              <li>leave blank deadline if equal to period</li>
            </ul>
            <form action={addTask} className="task-form">
              {AttrTask.map((attr) => (
                <div className="field" key={attr}>
                  <label htmlFor={attr}>{attr}</label>
                  <input type="text" id={attr} name={attr} placeholder={attr} />
                </div>
              ))}
              <button type="submit">add</button>
            </form>
          </div>
        </div>
      )}

      <table id="table" className="task-table">
        <caption>Table of task scheduled</caption>
        <thead>
          <tr>
            {AttrTask.map((attr) => (
              <th key={attr}>{attr}</th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.Name}>
              <td>{task.Name}</td>
              <td>{task.Period}</td>
              <td>{task.CpuTime}</td>
              <td>{task.ArrivalTime}</td>
              <td>{task.Deadline}</td>
              <td>
                <button className="del-btn" onClick={() => delTask(task.Name)}>
                  Del
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
