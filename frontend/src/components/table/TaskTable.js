import React from 'react';

const TaskTable = props => (
  
    <table className="responsive-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Actions</th>
            </tr>
        </thead>
    <tbody>
        {
            props.tasks.length > 0 ? (
                props.tasks.map (task => (

                    <tr key={task.id}>
                        <td>{task.name}</td>
                        <td className="center-align">
                            <button 
                                className="waves-effect waves-light btn-small"
                                onClick={() => props.execute(task)}>
                                execute
                            </button>
                        </td> 
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3}>{props.tasks[0]} No Tasks</td>
                    </tr>
                )
        }          
    </tbody>
  </table>
);
    
export default TaskTable;