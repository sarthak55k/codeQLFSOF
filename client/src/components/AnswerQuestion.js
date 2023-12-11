import React, {useEffect, useState} from "react";
import "../index.css"
import { parseStringForUrl } from "./utils.js"
import {saveAnswer} from './../service/answer-service';
import {addAnswerId} from './../service/question-service';
import { useParams, useNavigate } from "react-router-dom";
import {getCurrentUserAccount} from "../service/user-service";

const AnswerQuestion = () => {
    const [user, setUser] = useState("");
    const [text, setText] = useState("");
    const [textWarning, setTextWarning] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    const { qid } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        getCurrentUserAccount().then((response) => {
            console.log(response);
            if(response.responseCode === 200) {
                setUser(response.responseMessage._id)
            } else {
                alert(response.responseMessage)
            }
        })
    },[])
    const newAnswer = () => {
        if(!text) {
            setTextWarning(true);
            return;
        }

        const urlParsedText = parseStringForUrl(text);
        if(!urlParsedText) {
            setInvalidUrl(true);
            return null;
        }

        const answer = {
            text: urlParsedText,
            ans_by: user,
            ans_date_time: new Date().toISOString(),
            comments: [],
            votes: 0
        }

        saveAnswer(answer).then(response => {
            if(response.responseCode === 200) {
                addAnswerId(response.responseMessage._id, qid).then((r) => {
                    if (r.responseCode === 200) {
                        navigate(`/question/${qid}`)
                    } else {
                        alert(r.responseMessage);
                    }
                })
            } else {
                alert(response.responseMessage);
            }
        })
    }

    return (
        <div style={{paddingRight: "5rem", paddingBottom:"2rem"}}>
            <div className="form-group" style={{paddingTop: "2rem"}}>
                <h3>Answer Text*</h3>
            <textarea onChange={e => setText(e.target.value)} value={text}
                className="form-control" id="answerTextInput" placeholder="Enter answer text" required></textarea>
                {textWarning && <p style={{color: "red"}}>Answer text cannot be empty</p>}
                {invalidUrl && <p style={{color: "red"}}>Invalid hyperlink</p>}
            </div>
            <div className="newAnswerButtonContainer">
                <button onClick={() => newAnswer()} id="postAnswerButton" className="btn btn-primary">Post Answer</button>
                <small style={{color: "red"}}>* indicates mandatory fields</small>
            </div>
        </div>
    )
}
export default AnswerQuestion;