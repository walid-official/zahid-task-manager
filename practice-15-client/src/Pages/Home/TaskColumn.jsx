/* eslint-disable react/prop-types */
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MdDelete, MdEdit } from "react-icons/md";
import UpdateModal from "../UpdateModal/UpdateModal";
import useAxiosPublic from "../../Auth/Hook/useAxiosPublic";
import { useState } from "react";

const TaskColumn = ({ category, tasks, handleDeleteTask, refetchTasks }) => {
  const axiosPublic = useAxiosPublic();
  const [singleTaskData, setSingleTaskData] = useState({});

  const handleUpdateModal = async (taskId) => {
    document.getElementById("my_modal_2").showModal();
    console.log(taskId);
    try {
      const { data } = await axiosPublic.get(`/singleTasks/${taskId}`);
      setSingleTaskData({ ...data}); // ✅ Ensure category is set
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className="p-4 bg-gray-200 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{category}</h2>
      <Droppable droppableId={category}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 min-h-[100px]"
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task._id.toString()}
                draggableId={task._id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-2 bg-white rounded shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <h4 className="text-sm text-gray-500">{task.category}</h4>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button onClick={() => handleUpdateModal(task._id)}>
                          <MdEdit />
                        </button>
                        <button onClick={() => handleDeleteTask(task._id)}>
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm">{new Date(task?.timestamp).toLocaleString()}</p>
                    <p className="text-sm">{task?.description}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Update Modal */}
      <UpdateModal singleTaskData={singleTaskData} refetchTasks={refetchTasks} />
    </div>
  );
};

export default TaskColumn;
