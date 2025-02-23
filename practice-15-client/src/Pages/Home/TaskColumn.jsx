/* eslint-disable react/prop-types */

import {Draggable, Droppable} from "@hello-pangea/dnd";

const TaskColumn = ({ category, tasks }) => {
  return (
    <div className="p-4 bg-gray-200 rounded-lg">
    <h2 className="text-xl font-bold mb-4">{category}</h2>
    <Droppable droppableId={category}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="space-y-4"
        >
          {tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="p-2 bg-white rounded shadow"
                >
                  <h3>{task.title}</h3>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
  );
};

export default TaskColumn;
