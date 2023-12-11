import React, {useEffect, useState} from 'react';
import { Route, Routes, Link, useLocation, useNavigate} from 'react-router-dom';
import "../index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Questions from "./Questions";
import Tags from "./Tags";
import AskQuestions from "./AskQuestions";
import SearchComponent from "./SearchComponent";
import QuestionDetail from "./QuestionDetail";
import AnswerQuestion from "./AnswerQuestion";
import LoginComponent from "./UserComponents/Login.js";
import RegisterComponent from "./UserComponents/Register.js";
import ProfileComponent from "./UserComponents/Profile";
import {getCurrentUserAccount, userLogout} from "../service/user-service";
import EditQuestions from "./UserComponents/EditQuestion";
import EditAnswer from "./UserComponents/EditAnswer";
import EditTag from './UserComponents/EditTag';
import WelcomePage from './WelcomePage';

const FakeStackOverFlow = () => {
  const [user, setUser] = useState(null);
  const [userRetrieved, setUserRetrieved] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getCurrentUserAccount().then((response) => {
      console.log(response);
      if(response.responseCode === 200) {
        console.log(response.responseMessage)
        setUser(response.responseMessage)
      } else if (response.responseCode === 401) {
        setUser(null)
      }
      setUserRetrieved(true);
    })
  },[])

  const handleLogout = async () => {
    userLogout().then((response) => {
      setUser(null);
      alert(response.responseMessage)
      navigate("/")
    })
  }
  const handleSearch = async () => {
    // const parsedSearchInput = await parseSearchInput();
    console.log(searchInput)
    if(searchInput === "") {
      navigate(`/search/questions/null`)
    }
    navigate(`/search/questions/${searchInput}`)
  };

  // eslint-disable-next-line no-unused-vars
 
  const handleInputChange = (event) => {
    setSearchInput(event.target.value)
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchInput(event.target.value)
      handleSearch()
    }
  };

  return (<>
      {userRetrieved && <div className="container-fluid parent-div">
        <div className="fse-header">
          <div className="col-2 fsd-user">
            <h4 className="welcomeUser">{(location.pathname === "/"? "": (user? "Welcome " +user.firstName : "Welcome Guest"))}</h4>
          </div>
          <div className="col-8 fsd-title">
            <h1 className="title">Fake Stack Overflow</h1>
          </div>
          <div className="col-2 fse-searchBox">
            <input type="text" className="searchBox" id="searchBar"
                   onChange={handleInputChange}
                   onKeyDown={handleKeyDown}
                   placeholder="Search . . ."/>
          </div>
        </div>
        <div className="secondDiv">
          <div className="row">
            <div id="sideBarNav" className="col-md-auto list-div">
              <div className="list-group list-group-div">
                <Link to="/home" className={`list-group-item list-group-item-action ${location.pathname === "/home" ? 'active' : ''}`} id="questions-menu-bar">Questions
                </Link>
                <Link to="/tags" className={`list-group-item list-group-item-action ${location.pathname === "/tags" ? 'active' : ''}`} id="tags-menu-bar">Tags</Link>
                {!user && <Link to="/user/login" className={`list-group-item list-group-item-action ${location.pathname === "/user/login" ? 'active' : ''}`} id="tags-menu-bar">Login</Link>}
                {!user && <Link to="/user/register" className={`list-group-item list-group-item-action ${location.pathname === "/user/register" ? 'active' : ''}`} id="tags-menu-bar">Register</Link>}
                {user && <Link to={`/user/profile/${user.username}`} className={`list-group-item list-group-item-action ${location.pathname === `/user/profile/${user.username}` ? 'active' : ''}`} id="profile-menu-bar">Profile</Link>}
                {user && <button  onClick={() => handleLogout()} className={`list-group-item list-group-item-action`} id="tags-menu-bar">Logout</button>}

              </div>
            </div>
            <div className="col" id="mainDiv">
              <Routes>
                <Route exact path="/" element={<WelcomePage user={user? user._id : null}/>}/>
                <Route exact path="/home" element={<Questions user={user? user._id : null}/>}/>
                <Route exact path="/user/login" element={<LoginComponent setUser={setUser}/>}/>
                <Route exact path="/user/register" element={<RegisterComponent/>}/>
                <Route exact path="/user/profile/:username" element={<ProfileComponent/>}/>
                <Route exact path="/user/editQuestion/:qid" element={<EditQuestions user={user}/>}/>
                <Route exact path="/user/editAnswer/:aid" element={<EditAnswer user={user}/>}/>
                <Route exact path="/user/editTag/:tid" element={<EditTag user={user}/>}/>
                <Route exact path="/profile/:uid" element={<ProfileComponent/> }/>
                <Route exact path="/askQuestion" element={<AskQuestions/>}/>
                <Route exact path="/question/:qid" element={<QuestionDetail user={user}/> }/>
                <Route exact path="/question/:qid/answerQuestion" element={<AnswerQuestion/>}/>
                <Route exact path="/tags" element={<Tags user={user? user._id : null}/> }/>
                <Route exact path="/search/questions/:query" element={<SearchComponent/> }/>
                <Route exact path="/search/questions/" element={<SearchComponent/> }/>
                <Route exact path="/search/tags/:tagQuery" element={<SearchComponent/> }/>
              </Routes>
              {/* {state.component === ComponentType.AskQuestion ? (<AskQuestions setComponent={setState}/>) : ""}
                        {state.component === ComponentType.Question ?
                            <Questions data={{state, setState, press}}/> :
                            state.component === ComponentType.Tag ?
                                <Tags data={{
                                    setState, press}}/> :
                                state.component === ComponentType.SearchQuestion ?
                                    <SearchComponent data={{state, setState, press}}/> :
                                    state.component === ComponentType.QuestionDetail ?
                                        <QuestionDetail data={{state, setState, press}}/> :
                                        state.component === ComponentType.AnswerQuestion ?
                                            <AnswerQuestion data={{state, setState}}/> :
                                    ""
                        } */}
            </div>
          </div>
        </div>
      </div>}</>
  );
};
export default FakeStackOverFlow;
