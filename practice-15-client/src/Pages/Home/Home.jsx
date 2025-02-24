import useAuth from "../../Auth/Hook/useAuth";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";
import AddTasks from "../AddTasks/AddTasks";
import TaskColumn from "./TaskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState, useCallback } from "react";
import AddTasksModal from "../AddTasksModal/AddTasksModal";

const Home = () => {
  const axiosPublic = useAxiosPublic();
  const { users } = useAuth();
  const email = users?.email;
  const [tasks, setTasks] = useState([]);

  // Function to refetch tasks
  const refetchTasks = useCallback(() => {
    if (email) {
      axiosPublic
        .get(`/tasks/${email}`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.log("Error fetching tasks:", err));
    }
  }, [axiosPublic, email]);

  // Fetch tasks on component mount or when email changes
  useEffect(() => {
    refetchTasks();
  }, [refetchTasks]);

  // Handle drag-and-drop events
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside a valid destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find the dragged task and update its category
    const draggedTask = tasks.find((task) => task._id === draggableId);
    const updatedTask = { ...draggedTask, category: destination.droppableId };

    // Update local state optimistically
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? updatedTask : task
    );
    setTasks(updatedTasks);

    // Send update to the server
    axiosPublic
      .patch(`/tasks/${draggableId}`, { category: destination.droppableId })
      .then((res) => console.log("Task Updated", res.data))
      .catch((err) => {
        console.error("Error updating task:", err);
        // Revert local state if the server update fails
        setTasks(tasks);
      });
  };

  // Handle task deletion
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
        <AddTasks refetchTasks={refetchTasks} />
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