import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import {formatDateMetadata} from "./utils.js";
import AskQuestionButton from './AskQuestionButton';
import {getFilteredQuestions, incrementView} from '../service/question-service.js';
import {getAllTags} from '../service/tag-service.js';
//import {incrementView} from '../service/question-service.js';

const SearchComponent = () => {
    console.log()
    const navigate = useNavigate();
    const { query, tagQuery } = useParams();
    const [questions, setQuestions] = useState();
    const [fullQuestions, setFullQuestions] = useState(null);
    const [tags, setTags] = useState();
    const [sortType, setSortType] = useState('newest');
    const [offset, setOffset] = useState(0);

    const parseSearchInput = (query) => {
        let input = query;
    
        let insideSquareBrackets = input.match(/\[([^\]]+)]/g);
        insideSquareBrackets = insideSquareBrackets ? insideSquareBrackets.map(match => match.replace(/\[|\]/g, '')) : [];
    
        let inputWithoutSquareBrackets = input.replace(/\[[^\]]+]/g, '');
    
        let outsideSquareBrackets = inputWithoutSquareBrackets.match(/[^[\]\s]+/g);
    
        return {
          tagParams: insideSquareBrackets,
          searchParams: outsideSquareBrackets || [],
        };
    }

    useEffect(() => {
        if(query === "") {
            setQuestions([]);
            return;
        }
        if(query) {
            const searchQuery = parseSearchInput(query);
            console.log(searchQuery)
            getFilteredQuestions(searchQuery, sortType).then(r => {
                setFullQuestions(r);
                if(r.length <= 5) {
                    setQuestions(r);
                } else {
                    setQuestions(r.slice(0,5));
                }
            });
        } else if (tagQuery) {
            const parsedTagQuery = {
                tagParams: [tagQuery],
                searchParams: []
            }
            getFilteredQuestions(parsedTagQuery, sortType).then(r => {
                setFullQuestions(r);
                if(r.length <= 5) {
                    setQuestions(r);
                } else {
                    setQuestions(r.slice(0,5));
                }
            })
        }
        
        getAllTags().then(response => {
            setTags(response);
        });
    }, [query, tagQuery, sortType])
    // const getTagName = (tagId) => {
    //     return tags.find(t => t._id === tagId).name;
    // }

    const tagSearch = (tagName) => {
        navigate(`/search/tags/${tagName}`);
    }


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
        incrementView(qid).then(() => console.log("views increased"));
        navigate(`/question/${qid}`);
    }

    const prev = () => {
        setQuestions(fullQuestions.slice(offset-5, offset));
        setOffset(offset - 5);
    }

    const next = () => {
        if(offset >= fullQuestions.length-5) {
            setQuestions(fullQuestions.length > 5 ? fullQuestions.slice(0,5) : fullQuestions);
            setOffset(0);
        } else if(offset+10 > fullQuestions.length) {
            setQuestions(fullQuestions.slice(offset+5, fullQuestions.length));
            setOffset(offset + 5);
        } else {
            setQuestions(fullQuestions.slice(offset+5, offset+10));
            setOffset(offset + 5);
        }
    }

    return (
        <div>
            <div className="row">        
                {<AskQuestionButton />}
            </div>
            {<div className="question-header">
            <div className="col-4 noOfQuestions" id="noOfQuestions"><h2>Search Result</h2>
                <p>{fullQuestions ? fullQuestions.length : 0} results</p>
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
                    {questions && tags && questions.map(question => (
                        <div key={question._id}>
                            <div className="row questionRow" style={{borderBottom: "2px dotted rgb(0, 0, 0)"}}>
                                <div className="col-2 postStats"><span
                                    style={{color: "red", fontSize: "13px", marginTop: "10px"}}>{question.answers.length} answers</span><br/><span
                                    style={{color: "red", fontSize: "13px", marginTop: "10px"}}>{question.views} views</span></div>
                                <div className="col-7 questionMiddle">
                                    <button id={question._id} onClick={() => getQuestionDetails(question._id)} className="postTitle" style={{
                                        border: "none",
                                        background: "inherit",
                                        textDecoration: "none",
                                        cursor: "pointer",
                                        color: "black"
                                    }}>{question.title}
                                    </button>
                                    <br/>
                                    {question.tags.length > 0 && question.tags[0].name != "" && question.tags.map(tag => (
                                        <button onClick={() => tagSearch(tag.name)} key={tag._id} id={tag._id} className="tag">{tag.name}</button>
                                    ))}
                                </div>
                                <div className="col-3 lastActivity">
                                <span className="name"
                                      style={{color: "red", fontSize: "13px", marginTop: "10px"}}>{question.asked_by.username} </span>
                                    <span className="time"
                                          style={{color: "lightgray", marginTop: "20px", fontSize: "13px"}}>{"asked " + formatDateMetadata(question.ask_date_time)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                    <button className="previous" onClick={prev} disabled={offset==0}>
                        Prev
                    </button>
                    <button className="next" onClick={next}>
                        Next
                    </button>
                </div>
        </div>
    )
}
export default SearchComponent;