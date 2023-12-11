import "./vote.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';

const Post = ({ post }) => {
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);

    const handleUpvote = () => {
        setUpvoted(!upvoted);
        setDownvoted(false);
    };

    const handleDownvote = () => {
        setDownvoted(!downvoted);
        setUpvoted(false);
    };

    const calculateVotes = () => {
        if (upvoted) {
            return post.votes + 1;
        } else if (downvoted) {
            return post.votes - 1;
        } else {
            return post.votes;
        }
    };

    return (
        <li className="list-group-item">
            <i className="glyphicon glyphicon-chevron-up" onClick={handleUpvote}></i>
            <span className="label label-primary">{calculateVotes()}</span>
            <i className="glyphicon glyphicon-chevron-down" onClick={handleDownvote}></i>
            <a>{post.title}</a>
        </li>
    );
};

export default Post;
