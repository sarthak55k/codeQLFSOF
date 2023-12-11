import React, {useState, useEffect} from 'react';
import { createComment } from '../service/comment-service.js'
import { addComment } from '../service/answer-service.js';
import { addCommentIdToQuestion } from '../service/question-service.js';

const PaginatedComments = (props) => {
    const [currentComments, setCurrentComments] = useState(null);
    const [offset, setOffset] = useState(0);
    const [cInput, setCInput] = useState("");
    useEffect(() => {
        if(props.comments.length <= 3) {
            setCurrentComments(props.comments);
        } else {
            setCurrentComments(props.comments.slice(0, 3));
        }
    },[]);

    const prev = () => {
        setCurrentComments(props.comments.slice(offset-3, offset));
        setOffset(offset - 3);
    }

    const next = () => {
        console.log(offset)
        if(offset >= props.comments.length-3) {
            setCurrentComments(props.comments.slice(0, 3));
            setOffset(0);
        } else if(offset+6 > props.comments.length) {
            setCurrentComments(props.comments.slice(offset+3, props.comments.length));
            setOffset(offset + 3);
        } else {
            setCurrentComments(props.comments.slice(offset+3, offset+6));
            setOffset(offset + 3);
        }
    }

    const newComment = () => {
        const newComment = {
            comment: cInput,
            comment_by: props.user,
            comment_date_time: new Date()
        }
        createComment(newComment).then(r => {
            if(props.type == "answer") {
                addComment(props.id, r._id).then(() => {
                    setCInput("");
                    window.location.reload(false);
            })} else {
                addCommentIdToQuestion(props.id, r._id).then(() => {
                    setCInput("");
                    window.location.reload(false);
            })
            }
        });
    }

    // const upvoteClick = (cid) => {
    //     voteUp(cid)
    // }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <b>Comments:</b> 
            {currentComments && currentComments.map(comment => 
                    <div className="commentContainer" key={comment._id} style={{
                        display: "flex",
                        flexDirection: "horizontal",
                        padding: "0.3rem",
                        paddingBottom: 0,
                        justifyContent: "space-between",
                        borderRadius: "1rem",
                        marginBottom: "0.3rem",
                        border: "1px solid",
                        fontSize: "0.75rem"
                    }}>
                        <p className="commentText">{comment.comment}</p>
                        <p className="commentAuthor" style={{color:"purple"}}>{comment.comment_by.username}</p>
                    </div>
                )
            }
            <div style={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                {currentComments && currentComments.length > 0 && <div style={{
                    display: "flex",
                    flexDirection: "horizontal"
                }}>
                    <button className="previous" onClick={prev} disabled={offset==0}>
                        Prev
                    </button>
                    <button className="next" onClick={next}>
                        Next
                    </button>
                </div>}
                {props.user && 
                    <div style={{
                    display: "flex",
                    flexDirection: "horizontal",
                    height:"2.5rem",
                    marginTop: "1rem"
                }}>
                        <input value={cInput} onChange={e => setCInput(e.target.value)} className="form-control commentInput" placeholder="Enter comment text"/>
                        <button disabled={cInput.length == 0} onClick={newComment} className="addComments" >Add comment</button>
                    </div>}
            </div>
        </div>
    )
}

export default PaginatedComments;