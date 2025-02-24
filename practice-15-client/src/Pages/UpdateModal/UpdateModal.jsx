import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";

const UpdateModal = ({ singleTaskData, refetchTasks }) => {
  const axiosPublic = useAxiosPublic();
  const [title, setTitle] = useState(singleTaskData?.title || "");
  const [description, setDescription] = useState(singleTaskData?.description || "");
console.log(singleTaskData);

useEffect(() => {
  if (singleTaskData) {
    setTitle(singleTaskData.title || "");
    setDescription(singleTaskData.description || "");
  }
}, [singleTaskData]);


  const handleUpdateTask = async (title, description, taskId) => {
    const updateData = { title, description };
    try {
      const { data } = await axiosPublic.patch(`/update-task/${taskId}`, updateData);
      console.log("✅ Task updated:", data);
      refetchTasks(); // Refetch tasks to update UI
      document.getElementById("my_modal_2").close();
    } catch (err) {
      console.log("❌ Error updating task:", err);
    }
  };

  return (
    <div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative">
          {/* Close button */}
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => document.getElementById("my_modal_2").close()}
          >
            <FaTimes />
          </button>

          <h2 className="text-xl font-bold text-center mb-4">Update Task</h2>

          <div>
            {/* Title Input */}
            <div className="form-control">
              <label className="py-2 font-semibold">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                className="input input-bordered"
                required
              />
            </div>

            {/* Description Input */}
            <div className="form-control">
              <label className="py-2 font-semibold">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="input input-bordered"
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                onClick={() => handleUpdateTask(title, description, singleTaskData._id)}
                type="submit"
                className="bg-gradient-to-r from-[#007bff] to-[#007bff] px-8 py-3 rounded-full text-white font-medium"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default UpdateModal;
