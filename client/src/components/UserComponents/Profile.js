import React, {useEffect, useState} from "react";
import {
    getCurrentUserAccount
} from "../../service/user-service";

import ComponentType from "./ComponentType";
import UserQuestions from "./UserQuestions";
import UserTags from "./UserTags";
import UserAnswers from "./UserAnswers";
import {formatDateMetadata} from "../utils";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {

    const initialState = {
        component : ComponentType.Question,
    }

    const [state, setState] = useState(initialState)
    const press = (button) => {
        if (button === "questions") {
            console.log("questions")
            setState({component: ComponentType.Question});
        } else if (button === "tags") {
            console.log("tags")
            setState({component: ComponentType.Tag})
        } else if (button === "answers") {
            console.log("answers")
            setState({component: ComponentType.Answer})
        }
    }
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        getCurrentUserAccount().then((response) => {
            if (response.responseCode === 200) {
                console.log(response)
                setUser(response.responseMessage);
            } else {
                console.log(response.responseMessage)
                navigate('/');
            }
        });
    }, []);

    const calculateDays = (time) => {
        const registrationDate = new Date(time);
        const currentDate = new Date();
        return Math.floor((currentDate - registrationDate) / (24 * 60 * 60 * 1000));
    }

    return(
        <div>
        {user &&
            <div>
            <div className="border rounded px-0 py-3">
                <div className="row px-3">
                    <div className="col-11">
                        <div className="fw-bold">{user.firstName} {user.lastName}</div>
                        <div className="text-secondary small">Reputation : {user.reputation}</div>
                        <div className="text-secondary small">Joined : {formatDateMetadata(user.registration_date_time)}</div>
                        <div className="text-secondary small">Number of days as a member: {calculateDays(user.registration_date_time)} days </div>
                    </div>
                    <div className="list-group list-group-div d-flex">
                        <button
                            className={`list-group-item list-group-item-action ${state.component === ComponentType.Question ? 'active' : ''}`}
                            id="questions-menu-bar"
                            onClick={() => press("questions")}
                        >
                            Questions
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${state.component === ComponentType.Tag ? 'active' : ''}`}
                            id="tags-menu-bar"
                            onClick={() => press("tags")}
                        >
                            Tags
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${state.component === ComponentType.Answer ? 'active' : ''}`}
                            id="answers-menu-bar"
                            onClick={() => press("answers")}
                        >
                            Answers
                        </button>
                    </div>
                </div>
                <br/>
            </div>
                <div className="container-fluid parent-div">
                    <div className="secondDiv">
                        <div className="row">
                            <div className="col" id="mainDiv">
                                {state.component === ComponentType.Question ?
                                    <UserQuestions data={{state, setState, press}}/> :
                                    state.component === ComponentType.Tag ?
                                        <UserTags data={{state, setState, press}}/> :
                                        state.component === ComponentType.Answer ?
                                            <UserAnswers data={{state, setState, press}}/> :
                                                    ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
</div>
    );
};
export default ProfileComponent;