import React, {useState, useEffect} from 'react';
import Answer from './Answer.js';

const PaginatedAnswers = (props) => {
    const [answers] = useState(props.answers.filter(a => a._id !== props.pinned));
    const [currentAnswers, setCurrentAnswers] = useState(props.answers.filter(a => a._id !== props.pinned));
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        if(props.answers.length > 3) {
            setCurrentAnswers(answers.slice(0, 3));
        }
    },[]);

    const prev = () => {
        setCurrentAnswers(answers.slice(offset-3, offset));
        setOffset(offset - 3);
    }

    const next = () => {
        if(offset >= answers.length-3) {
            setCurrentAnswers(answers.slice(0, 3));
            setOffset(0);
        } else if(offset+6 > answers.length) {
            setCurrentAnswers(answers.slice(offset+3, answers.length));
            setOffset(offset + 3);
        } else {
            setCurrentAnswers(answers.slice(offset+3, offset+6));
            setOffset(offset + 3);
        }
    }

    
    return (
        <div id="answersContainer" style={{background: "whitesmoke"}}>
            <h4>Answers:</h4> {/* Adjusted font size */}
            <div className="scroll">
                {currentAnswers && currentAnswers.map(ans => 
                <Answer question={props.question} setQuestion={props.setQuestion} asked_by={props.asked_by} pinned={props.pinned} ans={ans} key={ans._id} user={props.user}/>)
                
                }
            </div>
            <div style={{
                display: "flex",
                flexDirection: "horizontal"
            }}>
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

export default PaginatedAnswers;