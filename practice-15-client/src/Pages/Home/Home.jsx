import useAuth from "../../Auth/Hook/useAuth";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";
import AddTasks from "../AddTasks/AddTasks";
import TaskColumn from "./TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import AddTasksModal from "../AddTasksModal/AddTasksModal";

const Home = () => {
  const axiosPublic = useAxiosPublic();
  const { users } = useAuth();
  const email = users?.email;
  const [tasks, setTasks] = useState([]);

  // Function to refetch tasks
  const refetchTasks = () => {
    if (email) {
      axiosPublic
        .get(`/tasks/${email}`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.log("Error fetching tasks:", err));
    }
  };

  useEffect(() => {
    refetchTasks();
  }, [axiosPublic, email]);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find((task) => task._id === draggableId);
    const updatedTask = { ...draggedTask, category: destination.droppableId };

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? updatedTask : task
    );
    setTasks(updatedTasks);

    axiosPublic
      .patch(`/tasks/${draggableId}`, { category: destination.droppableId })
      .then((res) => console.log("Task Updated", res.data))
      .catch((err) => console.error("Error updating task:", err));
  };

  const handleDeleteTask = (taskId) => {
    axiosPublic
      .delete(`/tasks/${taskId}`)
      .then((res) => {
        if (res.data.deletedCount > 0) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
          console.log("Task Deleted Successfully");
        }
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  return (
    <div className="min-h-[85vh]">
      <div className="flex justify-center">
        <AddTasks />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 max-w-screen-xl mx-auto gap-10 pt-10 pb-28 px-6">
          <TaskColumn
            handleDeleteTask={handleDeleteTask}
            refetchTasks={refetchTasks}
            category="To-Do"
            tasks={tasks.filter((task) => task.category === "To-Do")}
          />
          <TaskColumn
            handleDeleteTask={handleDeleteTask}
            refetchTasks={refetchTasks}
            category="In Progress"
            tasks={tasks.filter((task) => task.category === "In Progress")}
          />
          <TaskColumn
            handleDeleteTask={handleDeleteTask}
            refetchTasks={refetchTasks}
            category="Completed"
            tasks={tasks.filter((task) => task.category === "Completed")}
          />
        </div>
      </DragDropContext>

      {/* Pass refetchTasks to Modal */}
      <AddTasksModal refetchTasks={refetchTasks} />
    </div>
  );
};

export default Home;
