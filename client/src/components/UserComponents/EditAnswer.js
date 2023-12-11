import React, {useState, useEffect} from "react";
import "../../index.css"
import { parseStringForUrl } from "../utils.js"
import { getAnswerById, updateAnswer } from '../../service/answer-service';
import { useParams, useNavigate } from "react-router-dom";

const EditAnswer = (props) => {
    const [text, setText] = useState("");
    const [answer, setAnswer] = useState(null);
    const [textWarning, setTextWarning] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    const { aid } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        getAnswerById(aid).then(r => {
            setAnswer(r);
            setText(r.text);
            console.log(r);
            console.log(answer);
        });
    }, []);

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

        const newAnswer = {
            text: urlParsedText
        }

        updateAnswer(newAnswer, aid).then(() =>
                navigate(`/user/profile/${props.user.username}`)
            )
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
export default EditAnswer;