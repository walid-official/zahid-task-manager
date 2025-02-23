import useAuth from "../../Auth/Hook/useAuth";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";
import TaskColumn from "./TaskColumn";

import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

const Home = () => {
  // useHooks
  const axiosPublic = useAxiosPublic();
  const { users } = useAuth();
  const email = users?.email;

  // state for tasks
  const [tasks, setTasks] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination){
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){
      return;
    }

    console.log(source, "des", destination);
    
  };

  useEffect(() => {
    axiosPublic.get(`/tasks/${email}`).then((res) => {
      setTasks(res.data);
    });
  }, [axiosPublic, email]);

  return (
    <>
      <div className=" min-h-[85vh]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 max-w-screen-xl mx-auto gap-10 pt-10 pb-28 px-6">
            <TaskColumn
              category="To-Do"
              tasks={tasks.filter((task) => task.category === "To-Do")}
            />
            <TaskColumn
              category="In Progress"
              tasks={tasks.filter((task) => task.category === "Progress")}
            />
            <TaskColumn
              category="Completed"
              tasks={tasks.filter((task) => task.category === "Completed")}
            />
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default Home;
