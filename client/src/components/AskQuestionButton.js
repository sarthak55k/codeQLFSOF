import React from 'react';
import { Link } from 'react-router-dom';
import "../index.css"

const AskQuestionButton = () => {
    return (
        <div className="topButtons">
            <Link to="/askQuestion" id="askQuestions"
                    className="askQuestions" style={{float: "right"}}>Ask a Question</Link>
        </div>
    )
}

export default AskQuestionButton;