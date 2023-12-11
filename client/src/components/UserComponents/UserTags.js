import {useEffect, useState} from "react";
import {getAllTagsByUser} from "../../service/user-service";
import {useNavigate} from "react-router-dom";
import { deleteTag } from "../../service/tag-service";

const UserTags = () =>{
    let navigate = useNavigate();
    const [tags, setTags] = useState([]);
    useEffect(() => {
        getAllTagsByUser().then((response) => {
            if (response.responseCode === 200) {
                    setTags(response.responseMessage);
            }
        });
    }, []);

    const editTag = (tagId) => {
        navigate(`/user/editTag/${tagId}`)
    }

    const deleteOnClick = (tagId) => deleteTag(tagId).then((response) => {
        if (response.responseCode === 200) {
            getAllTagsByUser().then(r => {
                setTags(r.responseMessage)
            })
        } else {
            alert(response.responseMessage)
        }
    })

    return(
        <div>
            {tags && <div>
                <div className="question-header">
                    <div className="col-12 noOfQuestions" id="noOfQuestions"><h2 style={{marginLeft:"10px"}}>All Tags</h2>
                        <p style={{marginLeft:"10px"}}>{Object.keys(tags).length} Tags</p>
                    </div>
                </div>
                <div id="tagListSection" style={{ display: "flex", flexWrap: "wrap" }}>
                    {tags.map(tag => {
                        return (
                            <div key={tag.name} id={tag.name} className="card tagNode" style={{ flex: "0 0 calc(33.33% - 10px)", margin: "5px", border: "2px dotted black" }}>
                                <div className="card-body" style={{ display:"flex", justifyContent:"space-between"}}>
                                    <a style={{cursor : "pointer"}} onClick={() => editTag(tag._id)}>{tag.name}</a>
                                    <button onClick={() => deleteOnClick(tag._id)}className="btn btn-danger">X</button>
                                </div>
                            </div>)
                    })}
                </div>
            </div>}

        </div>
    )
}
export default UserTags;