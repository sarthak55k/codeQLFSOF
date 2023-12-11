import React, {useEffect, useState} from "react";
import {getAllAnswersByUser} from "../../service/user-service";
import {formatDateMetadata} from "../utils";
import {useNavigate} from "react-router-dom";
import { deleteAnswer } from "../../service/answer-service";



const UserAnswers = () => {
    const [answers, setAnswers] = useState([]);

    let navigate = useNavigate();
    function getAnswerDetails(_id) {
        navigate(`/user/editAnswer/${_id}`)
    }
    useEffect(() => {
        getAllAnswersByUser().then((response) => {
            if (response.responseCode === 200) {
                console.log(response.responseMessage)
                setAnswers(response.responseMessage);
            } else {
                alert("Invalid User")
            }
        });
    }, []);

    const deleteOnClick = (aid) => deleteAnswer(aid).then(() =>
        getAllAnswersByUser().then(r => setAnswers(r.responseMessage)));
    return(
        <div>
            {answers &&
                <div>
                    {<div className="question-header">
                        <div className="col-4 noOfQuestions" style={{marginLeft:"10px"}} id="noOfQuestions"><h2>All Answers</h2>
                            <p>{answers.length} answers</p>
                        </div>
                    </div>}
                    <div className="scroll">
                        <div id="questions">
                            {answers && answers.map(answer => (
                                <div key={answer._id}>
                                    <div className="row questionRow" style={{borderBottom: "2px dotted rgb(0, 0, 0)"}}>
                                        <div className="col-7 questionMiddle">
                                            <button key={answer._id} id={answer._id} onClick={() => {getAnswerDetails(answer._id)}} className="postTitle" style={{
                                                border: "none",
                                                background: "inherit",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                color: "black"
                                            }}>{answer.text}
                                            </button>
                                            <br/>
                                        </div>
                                        <div className="col-3 lastActivity">
                                            <span className="time"
                                                  style={{color: "lightgray", marginTop: "20px", fontSize: "13px"}}>{"answered " + formatDateMetadata(answer.ans_date_time)}</span>
                                        </div>
                                        <div className="col">
                                            <button onClick={() => deleteOnClick(answer._id)} className="btn btn-danger">X</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
export default UserAnswers;