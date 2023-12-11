import React, {useState, useEffect} from "react";
import {formatDateMetadata} from "./utils";
import AskQuestionButton from "./AskQuestionButton";
import { getQuestionDetailById, voteUp, voteDown } from "../service/question-service";
import { useParams, Link } from "react-router-dom";
import PaginatedAnswers from './PaginatedAnswers.js';
import PaginatedComments from './PaginatedComments.js';
import Answer from './Answer';


const QuestionDetail = (props) => {
    const { qid } = useParams();
    const [question, setQuestion] = useState(null);
    const [pinnedAnswer, setPinnedAnswer] = useState(null);
    const [upvoteActive, setUpvoteActive] = useState(false);
    const [downvoteActive, setDownvoteActive] = useState(false);


    const upvoteClick = () => {   
        voteUp(qid).then((r) =>{ 
            if(r.responseCode == 200) {
                setUpvoteActive(true);
                setQuestion({...question, votes: question.votes + 1});
            } else {
                alert(r.responseMessage);
            }
        });
        
    }

    const downvoteClick = () => {
        voteDown(qid).then(r => {
            if(r.responseCode == 200) {
                setDownvoteActive(true);
                setQuestion({...question, votes: question.votes - 1});
            } else {
                alert(r.responseMessage);
            }
        })
    }
    
    useEffect(() => {
        getQuestionDetailById(qid).then((response) => {
            console.log(response);
            setQuestion(response);
            setPinnedAnswer(response.answers.find(a => a._id == response.pinned_answer));    
        });
        
    }, []);

    return (
        <div>
            {question &&
                <div style={{ backgroundColor: "#a1e3f078" }}>
                    <div
                        id="answersHeader"
                        style={{
                            display: "flex",
                            height: "1.5rem", // Adjusted height
                            justifyContent: "space-between",
                            padding: "0.5rem", // Adjusted padding
                            marginBottom: '2rem', // Adjusted margin
                        }}
                    >
                        <b id="numAnswers" style={{ fontSize: "0.8rem" }}>{question.answers.length} answers</b> {/* Adjusted font size */}
                        <b id="questionTitle" style={{ maxWidth: "50%", fontSize: "1rem" }}>{question.title}</b> {/* Adjusted font size */}
                        {props.user && <AskQuestionButton />}
                    </div>
                    <div
                        id="questionBody"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.5rem", // Adjusted padding
                        }}
                    >
                        <b id="questionViews" style={{ fontSize: "0.8rem" }}>{question.views} views</b> {/* Adjusted font size */}
                        <p  id="questionText"
                            dangerouslySetInnerHTML={{ __html: question.text }}
                            style={{ width: "70%", fontSize: "0.9rem" }} // Adjusted font size
                        ></p>
                        <div id="questionAskerDiv" style={{ display: "flex", flexDirection: "column-reverse" }}>
                            <small id="questionDate"style={{ color: "lightslategray", fontSize: "0.7rem" }}>asked {formatDateMetadata(question.ask_date_time)}</small> {/* Adjusted font size */}
                            <small id="questionAsker" style={{ color: "red", fontSize: "0.8rem" }}>{question.asked_by.username}</small> {/* Adjusted font size */}
                            <div id="questionVotingDiv" style={{ display: "flex", flexDirection: "horizontal", justifyContent: "space-between" }}>
                                {props.user && props.user.reputation >= 50 && <button id="questionUpvote" onClick={upvoteClick} className={`btn btn-success ${upvoteActive ? "active" : ""}`} style={{ fontSize: "0.8rem" }}>+</button>} {/* Adjusted font size */}
                                {props.user && props.user.reputation >= 50 && <button id="questionDownvote" onClick={downvoteClick} className={`btn btn-danger ${downvoteActive ? "active" : ""}`} style={{ fontSize: "0.8rem" }}>-</button>} {/* Adjusted font size */}
                                <div id="questionVotes" style={{ border: "1px solid black", height: "100%", width: "1.5rem", textAlign: "center", fontSize: "1rem" }}> {/* Adjusted font size */}
                                    {question.votes}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="questionComments" style={{ paddingLeft: "1rem", paddingRight: "1rem", paddingBottom: "1rem" }}> {/* Adjusted padding */}
                        <PaginatedComments type="question" id={question._id} comments={question.comments} user={props.user} />
                    </div>
                    {pinnedAnswer && 
                        <div id="pinnedAnswerDiv"> 
                            <Answer question={question} setQuestion={setQuestion} asked_by={question.asked_by._id} pinned={question.pinned_answer} ans={pinnedAnswer} key={pinnedAnswer._id} user={props.user}/>
                        </div>
                    }
                    
                    <PaginatedAnswers question={question} setQuestion={setQuestion} asked_by={question.asked_by._id} pinned={question.pinned_answer} answers={question.answers} user={props.user} />
                    
                </div>
            }
            <div style={{padding: "1rem"}}>
                {props.user && <Link to={`/question/${qid}/answerQuestion`} className="askQuestions" style={{marginBottom: "10px"}}>Answer Question</Link>}
            </div>
        </div>
    )
    
   
}
export default QuestionDetail;