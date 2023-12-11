import React, {useState} from 'react';
import {formatDateMetadata} from "./utils";
import PaginatedComment from './PaginatedComments.js';
import { voteUp, voteDown } from './../service/answer-service';
import { increaseReputation, decreaseReputation } from './../service/user-service';
import { pinAnswer } from '../service/question-service';

const Answer = (props) => {
    const[ans, setAns] = useState(props.ans)
    const [upvoteActive, setUpvoteActive] = useState(false);
    const [downvoteActive, setDownvoteActive] = useState(false);
    const upvoteClick = () => {   
        voteUp(ans._id).then((r) =>{ 
            if(r.responseCode == 200) {
                increaseReputation(ans.ans_by._id).then((resp) => {
                    console.log(resp);
                    setUpvoteActive(true);
                    setAns({...ans, votes: ans.votes + 1});
                })
                
            } else {
                alert(r.responseMessage);
            }
        });
    }

    const downvoteClick = () => {
        voteDown(ans._id).then(r => {
            if(r.responseCode == 200) {
                setDownvoteActive(true);
                setAns({...ans, votes: ans.votes - 1});
                decreaseReputation(ans.ans_by._id);
            } else {
                alert(r.responseMessage);
            }
        })
    }

    const pin = () => 
        pinAnswer(props.question._id, ans._id).then(() => 
            window.location.reload(false));

    return (
        <div key={ans._id} style={{
            padding: "1rem",
            borderTop: "2px dotted rgb(0, 0, 0)",
            borderBottom: "2px dotted rgb(0, 0, 0)"
        }}>
            {props.pinned == ans._id && <h5 className="acceptedAnswerHeader">Accepted Answer:</h5>}
            <div  style={{
            display: "flex",
            justifyContent: "space-between"
            }}>
            <div className="answerText"><p dangerouslySetInnerHTML={{__html:ans.text}} style={{marginRight: "3rem"}}></p></div>
                <div className="answererInfo" style={{display: "flex", flexDirection: "column", width: "20%"}}>
                    <small className="answerUsername"
                    style={{color: "green"}}>{ans.ans_by.username}</small>
                    <small className="answerDate" style={{color: "lightslategray"}}>answered {formatDateMetadata(ans.ans_date_time)}</small>
                    <div className="answerVoteContainer" style={{display:"flex", flexDirection: "horizontal", justifyContent: "space-between"}}>
                        {props.user && props.user.reputation >= 50 && <button onClick={upvoteClick} className={`answerUpvote btn btn-success ${upvoteActive ? "active" : ""}`}>+</button>}
                        {props.user && props.user.reputation >= 50 && <button onClick={downvoteClick} className={`answerDownvote btn btn-danger ${downvoteActive ? "active" : ""}`}>-</button>}
                        <div style={{border: "1px solid black", height: "100%", width: "2rem", textAlign:"center", fontSize:"1.5rem"}}>
                    {ans.votes}
                     </div>
                        {props.pinned !== ans._id && 
                        props.user && props.user._id === props.asked_by 
                        && <button className="answerPinButton" onClick={pin}>Pin</button>}
                </div>
                </div>
            </div>
            <PaginatedComment type="answer" id={ans._id} comments={ans.comments} user={props.user}/>  
        </div>
    )
}

export default Answer;


