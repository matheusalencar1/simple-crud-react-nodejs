import React, { useState, useEffect } from 'react';

const ReviewUserForm = props => {
    const [user, setUser] = useState(props.currentUser);

    const approve = event => {
        props.approve(user.id, user);
    };

    const reject = event => {
        props.reject(user.id, user);
    };
    

    useEffect(() => {
        setUser(props.currentUser);
    }, [props]);

    return (
        <div className="row">

            <form className="col s12">
                <div className="row">
                    <div className="input-field col s12">

                        <input type="text" 
                            id={user.id} 
                            name="name"
                            value={user.name}
                            required 
                            disabled/>
                        <label htmlFor="name"></label>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">

                        <input 
                            type="text" 
                            name="username" 
                            value={user.username}
                            required 
                            disabled/>
                        <label htmlFor="username"></label>
                    </div>
                </div>
                
                <div className="row">
                    <div className="input-field col s12 m6">

                        <button className="waves-effect waves-light btn-small" onClick={approve}>approve</button>
                    </div>

                    <div className="input-field col s12 m6">

                        <button className="waves-effect waves-light btn-small red darken-4" onClick={reject}>reject</button>
                    </div>

                    <div className="input-field col s12 m6">

                        <button 
                            className="waves-effect waves-light btn"
                            onClick={() => props.setReviewing(false)}
                            >Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewUserForm;
