import React, { Component } from 'react';
import qs from 'querystring';

import api from '../services/api';
import camundaApi from '../services/camundaApi';

import TaskTable from '../components/table/TaskTable';
import UserTable from '../components/table/UserTable';
import AddUserForm from '../components/forms/AddUserForm';
import EditUserForm from '../components/forms/EditUserForm';
import ReviewUserForm from '../components/forms/ReviewUserForm';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            tasks: [],
            currentUser: { id: null, name: ''},
            editing: false
        }
    }

    componentDidMount() {
        this.refreshUserTable();
    }

    refreshUserTable() {
            this.usersData = api.get('users')
            .then(response => {
                let data = response.data;

                this.setState({ 
                    users: data.data,
                    setUsers: data.data
                });
            });
            setTimeout(() => {
                this.getAllTasks();
              }, 200);

            
    }

    getAllTasks() {
        return camundaApi.get('task')
        .then(response => {
            let tasks = response.data;
                this.setState({ 
                    tasks: tasks
                });
            });
    }

    addUser = user => {

        api.post('users', user)
            .then(res => {
                this.refreshUserTable();
            });
    };

    deleteUser = id => {

        api.delete(`users/${id}`)
            .then(res => {
                this.refreshUserTable();
            });
    };

    updateUser = (id, user) => {
        
        api.put(`users`, user)
            .then(res => {

                this.refreshUserTable();
            });
        
        this.setState({ 
            currentUser: { id: null, name: ''}
        });

        this.setEditing(false);
    };

    editRow = user => {

        this.setState({
            currentUser: { id: user.id, name: user.name }
        });

        this.setEditing(true);
    };

    reviewUser = user => {

        this.setState({ 
            currentUser: { id: user.id, name: user.name }
        });

        this.setReviewing(true);
    };

    execute = task => {
        camundaApi.get(`process-instance/${task.processInstanceId}/variables`)
            .then(response => {
                let variable = response.data;
                api.get(`users/${variable.userId.value}`)
                    .then(response => {
                        let user = response.data.resource;
                        if (task.name === 'Review user') {
                            this.reviewUser(user);
                        } else {
                            this.editRow(user);
                        }
                    });
            });
    };

    reject = userId => {
        api.put(`users/reject/${userId}`)
            .then(res => {
                this.refreshUserTable();
        });
    };

    setEditing = isEditing => {

        this.setState({ editing: isEditing });
    };

    setReviewing = isReviewing => {

        this.setState({ reviewing: isReviewing });
    };

    render () {
        const { users } = this.state;
        const { tasks } = this.state;

        return (
            <div className="container">
                    
                <div className="row">
    
                    {
                        this.state.editing ? (
                            <div className="col s12 l6">
                                <h4>Edit User</h4>
                                <EditUserForm 
                                    editing={this.state.editing}
                                    setEditing={this.setEditing}
                                    currentUser={this.state.currentUser}
                                    updateUser={this.updateUser} 
                                />
                            </div>
                        ) : this.state.reviewing ? (
                            <div className="col s12 l6">
                                <h4>Review User</h4>
                                <ReviewUserForm 
                                    editing={this.state.editing}
                                    setReviewing={this.setReviewing}
                                    currentUser={this.state.currentUser}
                                    approve={this.deleteUser} 
                                    reject={this.reject} 
                                />
                            </div>
                        ) : (
                            <div className="col s12 l6">
                                <h4>Add user</h4>
                                <AddUserForm addUser={this.addUser} />
                            </div>
                        )
                    }

                    {/* <div className="col s12 l6">
                        <h5>Users</h5>
                        <UserTable users={users} editRow={this.editRow} deleteUser={this.deleteUser} />
                </div> */}

                </div>
                <div className="col s12 l6">
                    <h4>Tasks</h4>
                    <TaskTable tasks={tasks} execute={this.execute} />
                </div>
            </div>
        );
    };
};

export default Home;