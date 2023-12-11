import React, {useState, useEffect} from "react";
import {formatDateMetadata} from "../utils.js";
import {getAllQuestionsByUser} from "../../service/user-service";
import {useNavigate} from "react-router-dom";
import { deleteQuestion } from "../../service/question-service.js";
const UserQuestions = (props) => {
    console.log(props)
    let navigate = useNavigate();

    const [questions, setQuestions] = useState(null);
    const [sortType, setSortType] = useState('newest');
    useEffect(() => {
        getAllQuestionsByUser(sortType).then(response => {
            setQuestions(response.responseMessage);
        });
    }, [sortType])

    const sort = (sortType) => {
        if (sortType === "newest") {
            setSortType("newest")
        } else if (sortType === "active") {
            setSortType("active")
        } else if (sortType === "unanswered") {
            setSortType("unanswered")
        }
    }

    const getQuestionDetails = (qid) => {
        console.log(qid)
        navigate(`/user/editQuestion/${qid}`)
    }
    
    const deleteOnClick = (qid) => deleteQuestion(qid).then(() =>
            getAllQuestionsByUser(sortType).then(r => setQuestions(r.responseMessage)));

    return (
        <div>
            {questions &&
                <div>
                    {<div className="question-header">
                        <div className="col-4 noOfQuestions" id="noOfQuestions"><h2 style={{marginLeft:"10px"}}>All Questions</h2>
                            <p style={{marginLeft:"10px"}}>{questions.length} questions</p>
                        </div>
                        <div className="col-8 topButtons">
                            <div className="sortButtons">
                                <button className="sort" id="newest" onClick={() => sort("newest")}>Newest</button>
                                <button className="sort" id="active" onClick={() => sort("active")}>Active</button>
                                <button className="sort" id="unanswered" onClick={() => sort("unanswered")}>Unanswered</button>
                            </div>
                        </div>
                    </div>}
                    <div className="scroll">
                        <div id="questions">
                            {questions.map(question => (
                                <div key={question._id}>
                                    <div className="row questionRow" style={{borderBottom: "2px dotted rgb(0, 0, 0)"}}>
                                        <div className="col-2 postStats"><span
                                            style={{color: "red", fontSize: "13px", marginTop: "10px"}}>{question.answers.length} answers</span><br/><span
                                            style={{color: "red", fontSize: "13px", marginTop: "10px"}}>{question.views ? question.views : 0} views</span></div>
                                        <div className="col-7 questionMiddle">
                                            <button key={question._id} id={question._id} onClick={() => {getQuestionDetails(question._id)}} className="postTitle" style={{
                                                border: "none",
                                                background: "inherit",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                color: "black"
                                            }}>{question.title}
                                            </button>
                                            <br/>
                                        </div>
                                        <div className="col-3 lastActivity">
                                            <span className="time"
                                                  style={{color: "lightgray", marginTop: "20px", fontSize: "13px"}}>{"asked " + formatDateMetadata(question.ask_date_time)}</span>
                                        </div>
                                        <div className="col">
                                            <button onClick={() => deleteOnClick(question._id)} className="btn btn-danger">X</button>
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
export default UserQuestions;