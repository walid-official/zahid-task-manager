import React from 'react';

const AddTasks = () => {
    
const handleTaskModal = () => {
    document.getElementById("my_modal_1").showModal()
}

    return (
        <div className=''>
            <button onClick={handleTaskModal} className='btn'>Add Task +</button>
        </div>
    );
};

export default AddTasks;