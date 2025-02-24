import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";


const UpdateModal = ({ singleTaskData, refetchTasks }) => {
  const axiosPublic = useAxiosPublic();
  const [title, setTitle] = useState(singleTaskData?.title || "");
  const [description, setDescription] = useState(singleTaskData?.description || "");

  useEffect(() => {
    if (singleTaskData) {
      setTitle(singleTaskData?.title || "");
      setDescription(singleTaskData?.description || "");
    }
  }, [singleTaskData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updateData = {
      title,
      description,
      category: singleTaskData?.category, // ✅ Ensure category is sent
    };
  
    try {
      const { data } = await axiosPublic.patch(
        `/updateTasks/${singleTaskData.taskId}`,
        updateData
      );
      console.log("✅ Task updated:", data);
  
      refetchTasks(); // ✅ Refetch after update
      document.getElementById("my_modal_2").close();
    } catch (err) {
      console.error("❌ Error updating task:", err);
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

          <form onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="form-control">
              <label className="py-2 font-semibold">Title</label>
              <input
                type="text"
                defaultValue={title}
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
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
                className="input input-bordered"
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#007bff] to-[#007bff] px-8 py-3 rounded-full text-white font-medium"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UpdateModal;
