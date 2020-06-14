const { User } = require('../models');
const axios = require('axios');
const camundaApi = axios.create({
    baseURL: 'http://localhost:8080/engine-rest/',
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

async function completeTask(userId, body) {
    let pid = await getPid(userId);
    let task = await getTask(pid[0].id);
    camundaApi.post(`task/${task[0].id}/complete`, body);
}

function getPid(userId) {
    return camundaApi.get(`history/process-instance?variables=userId_eq_${userId}`).then(response => {return response.data});
}

function getTask(pid) {
    return camundaApi.get(`task?processInstanceId=${pid}`).then(response => {return response.data});
}

module.exports = {

    index(req, res) {
        User.findAll({})
            .then(users => {
                res.json({
                    error: false,
                    data: users
                });
            })
            .catch(error => res.json({
                error:true,
                data: [],
                error: error
            }));
    },

    findUser(req, res) {
        User.findAll({})
            .then(users => {
                const user_id = req.params.id;
                let user = null;
                users.forEach(element => {
                    if (element.id == user_id) {
                        user = element;
                    }
                });
                res.json({
                    error: false,
                    data: user
                });
            })
            .catch(error => res.json({
                error:true,
                data: [],
                error: error
            }));
    },

    create(req, res) {
        const { name, username } = req.body;
        User.create({
            name, username
        })
        .then(user => {
            const processDefinition = 'dp:1:e6143af7-addb-11ea-a7ff-9a6ba9cf64cf';
            const variables = JSON.parse(`{"variables":{"userId":{"value":"${user.id}"}}}`)
            camundaApi.post(`process-definition/${processDefinition}/start`, variables);
            res.status(201).json({
                error: false,
                data: user,
                message: "new user has been created"
            })
        })
        .catch(error => res.json({
            error:true,
            data: [],
            error: error
        }));
    },

    update(req, res) {
        const user_id = req.params.id;

        completeTask(user_id, null);

        const { name, username } = req.body;

        User.update({
            name, username
        }, {
            where: {
                id: user_id
            }
        })
        .then(user => res.status(201).json({
            error: false,
            data: user,
            message: 'user has been updated'
        }))
        .catch(error => res.json({
            error: true,
            error: error
        }));
    },

    reject(req, res) {
        const user_id = req.params.id;
        var variables = JSON.parse(`{"variables":{"approved":{"value":"false"}}}`);
        completeTask(user_id, variables);
    },

    destroy(req, res) {
        const user_id = req.params.id;

        var variables = JSON.parse(`{"variables":{"approved":{"value":"true"}}}`);
        completeTask(user_id, variables);

        User.destroy({ where: {
            id: user_id
        }})
        .then(status => res.status(201).json({
            error: false,
            message: 'user has been deleted'
        }))
        .catch(error => res.json({
            error: true,
            error: error
        }));
    }
}