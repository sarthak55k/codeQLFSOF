import React, {useState, useEffect} from "react";
//import ComponentType from "./UserComponents/ComponentType";
import { parseStringForUrl } from "./utils";
import { saveQuestion } from './../service/question-service';   
//import { getAllTags } from './../service/tag-service';
import {getCurrentUserAccount} from "../service/user-service";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const AskQuestions = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tagString, setTagString] = useState("");
    const [user, setUser] = useState("");
    const [emptyTitle, setEmptyTitle] = useState(false);
    const [longTitle, setLongTitle] = useState(false);
    const [emptyText, setEmptyText] = useState(false);
    const [longTags, setLongTags] = useState(false);
    const [manyTags, setManyTags] = useState(false);
    const [emptyTags, setEmptyTags] = useState(false);
    const [invalidUrl, setInvalidUrl] = useState(false);
    // eslint-disable-next-line no-unused-vars
    //const [existingTags, setExistingTags] = useState([]);

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

    function createQuestion() {
        if(!title) {
            setEmptyTitle(true);
            return null;
        } else if(title.length > 100) {
            setLongTitle(true);
            return null;
        } else if(!text) {
            setEmptyText(true);
            return null;
        } else if(tagString.split(" ").length > 5) {
            setManyTags(true);
            return null;
        } else {
            const tags = tagString.split(" ");
            var tooLong = false;
            var emptyTag = false;
            tags.forEach(t => {
                if(t.length > 20) {
                    tooLong = true;
                } else if (t.length === 0) {
                    emptyTag = true;
                }
            });
            if(tooLong) {
                setLongTags(true);
                return null;
            }
            if(emptyTag) {
                setEmptyTags(true)
                return null;
            }
        }

        const tags = tagString.split(" ");

        const urlParsedText = parseStringForUrl(text);
        if(!urlParsedText) {
            setInvalidUrl(true);
            return null;
        }
    
        const question = {
            title: title,
            text: urlParsedText,
            tags: tags,
            answers: [],
            comments: [],
            asked_by: user,
            ask_date_time: new Date(),
            views: 0,
            votes: 0,
            pinned_answer: ""
        }
        saveQuestion(question).then((response) => {
            if (response.responseCode === 200) {
                navigate(`/home`)
            } else {
                alert(response.responseMessage)
            }
        });
    }

    return (
        <div style={{paddingRight: "5rem", paddingLeft: "1rem"}}>
            <div className="" style={{paddingTop: "2rem"}}>
                <h3>Question Title*</h3>
                <div>
                    <i>Limit to 100 characters or less</i>
                </div>
                <input onChange={e => setTitle(e.target.value)} value={title} type="text" className="form-control" id="formTitleInput" aria-describedby="questionTitle"
                       placeholder="Enter question title" required=""/>
                    {emptyTitle && <p style={{color: "red"}}>Title cannot be empty</p>}
                    {longTitle && <p style={{color: "red"}}>Title cannot be more than 100 characters</p>}
            </div>
            <div className="form-group" style={{paddingTop: "2rem"}}><h3>Question Text*</h3>
                <div>
                    <i>Add details</i>
                </div>
                <textarea onChange={e => setText(e.target.value)} value={text} className="form-control" id="formTextInput" placeholder="Enter question text"
                          required=""></textarea>
                {emptyText && <p style={{color: "red"}}>Question text cannot be empty</p>}
                {invalidUrl && <p style={{color: "red"}}>Invalid hyperlink</p>}
            </div>
            <div className="form-group" style={{paddingTop: "2rem"}}>
                <h3>Tags*</h3>
                <label htmlFor="formTagInput"><i>Add keywords separated by whitespace</i></label>
                <input onChange={e => setTagString(e.target.value)} value={tagString} type="text" className="form-control" id="formTagInput" placeholder="Enter tags" required=""/>
                {longTags && <p style={{color: "red"}}>New tag length cannot be more than 20</p>}
                {manyTags && <p style={{color: "red"}}>Cannot have more than 5 tags</p>}
                {emptyTags && <p style={{color: "red"}}>Cannot have empty tags</p>}
            </div>
            <div style={{display: "flex", justifyContent: "space-between", paddingTop: "2rem"}}>
                <button id="postQuestionButton" className="askQuestions" onClick={() => createQuestion()}>Post Question</button>
                <small style={{color: "red"}}>* indicates mandatory fields</small>
            </div>
        </div>
)
}

export default AskQuestions;