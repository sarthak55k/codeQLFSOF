import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import AskQuestionButton from "./AskQuestionButton.js";
import { getAllQuestion } from "../service/question-service";
import { getAllTags } from "../service/tag-service";

const Tags = (props) => {
    const navigate = useNavigate();
    let [tags, setTags] = useState([]);
    // eslint-disable-next-line no-unused-vars
    let [questions, setQuestions] = useState([]);
    let [render, setRender] = useState(null);

    useEffect(()=>{
        getAllTags().then(response => {
            setTags(response);
            getAllQuestion("newest").then(r => {
                const tagCounts = {};
                setQuestions(r);
                response.forEach(t => {
                    tagCounts[t._id] = 0;
                });
                r.forEach(q => {
                    q.tags.forEach(tag => {
                        if (!tagCounts[tag._id]) {
                            tagCounts[tag._id] = 1;
                        } else {
                            tagCounts[tag._id]++;
                        }
                    });
                });
                console.log(tagCounts)
                setRender(tagCounts);
            });
        })
    },[]);

    const getTagName = (tagId) => {
        return tags.find((tag) => tag._id === tagId).name
    }


    const tagSearch = (tagId) => {
        navigate(`/search/tags/${getTagName(tagId)}`);
    }

    return (
        <div>
            {render && <div>
                <div className="row">        
                    {props.user && <AskQuestionButton />}
                </div>
                <div className="question-header">
                    <div className="col-12 noOfQuestions" id="noOfQuestions"><h2>All Tags</h2>
                        <p>{Object.keys(render).length} Tags</p>
                    </div>
                </div>
                <div id="tagListSection" style={{ display: "flex", flexWrap: "wrap" }}>
                    {Object.keys(render).map(tagId => {
                        return (
                            <div key={tagId} id={tagId} className="card tagNode" style={{ flex: "0 0 calc(33.33% - 10px)", margin: "5px", border: "2px dotted black" }}>
                                <div className="card-body">
                                    <a style={{cursor : "pointer"}} onClick={() => tagSearch(tagId)}>{getTagName(tagId)}</a>
                                    <p className="card-text">{render[tagId]} {render[tagId] === 1 ? "question": "questions"}</p>
                                </div>
                            </div>)
                    })}
                </div>
            </div>}
           
        </div>
    );
}
export default Tags;