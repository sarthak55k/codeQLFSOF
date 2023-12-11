import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTagById, updateTag } from './../../service/tag-service';

const EditTags = (props) => {
    const navigate = useNavigate();
    const [tag, setTag] = useState(null);
    const { tid } = useParams();
    const [tagName, setTagName] = useState("");
    const [longTags, setLongTags] = useState(false);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        getTagById(tid).then(r => {
            setTag(r);
            setTagName(r.name);
            console.log(r)
        });
    }, []);

    function editTag() {
        if(!tagName) {
            setEmpty(true);
            return;
        } else if(tagName.length>20) {
            setLongTags(true);
            return;
        }
        const updatedTag = {
            _id: tag._id,
            name: tagName
        }
        updateTag(updatedTag, tid).then(r => {
            console.log(r);
            if(r.responseCode == 200) {
                navigate(`/user/profile/${props.user.username}`)
            } else {
                alert(r.responseMessage);
            }
        });
    }

    return(
        <>
         {tag && <div style={{paddingRight: "5rem", paddingBottom:"2rem"}}>
            <div className="form-group" style={{paddingTop: "2rem"}}>
                <h3>Tag Name*</h3>
                <input onChange={e => setTagName(e.target.value)} value={tagName} type="text" className="form-control" id="formTagInput" placeholder="Enter tags" required=""/>
                {empty && <p style={{color: "red"}}>Tag name can not be empty</p>}
                {longTags && <p style={{color: "red"}}>Tag length cannot be more than 20</p>}
            </div>
            <div className="newAnswerButtonContainer">
                <button onClick={editTag} id="editTagButton" className="btn btn-primary">Edit Tag</button>
                <small style={{color: "red"}}>* indicates mandatory fields</small>
            </div>
        </div>}
        </>
    )
}

export default EditTags;