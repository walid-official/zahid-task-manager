import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";
import useAuth from "../../Auth/Hook/useAuth";

const AddTasksModal = ({ refetchTasks }) => {
  const axiosPublic = useAxiosPublic();
  const { users } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const TaskCategory = {
      title: data.title,
      description: data.description || "",
      email: users?.email,
      timestamp: new Date().toISOString(),
      category: "To-Do",
    };

    try {
      const response = await axiosPublic.post("/tasks", TaskCategory);
      console.log("Task Added:", response.data);

      // Refetch tasks after adding
      refetchTasks();

      reset(); // Clear form after successful submission
      document.getElementById("my_modal_1").close(); // Close modal
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("title", { required: "Title is required", maxLength: 50 })}
              placeholder="Task Title"
              className="input input-bordered w-full max-w-xs"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

            <textarea
              {...register("description", { maxLength: 200 })}
              placeholder="Task Description (optional)"
              className="textarea textarea-bordered w-full max-w-xs mt-4"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

            <div className="my-4">
              <button type="submit" className="btn">Add Task</button>
            </div>
          </form>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AddTasksModal;
