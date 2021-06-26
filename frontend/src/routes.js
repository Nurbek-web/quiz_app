import React from "react";
import { Route, Switch } from "react-router-dom";

import QuizList from "./components/QuizList";
import QuizDetail from "./components/QuizDetail";
// import QuizForm from "./components/QuizForm";
import QuizCreate from "./components/QuizCreate";
import NormalLoginForm from "./components/Login";
import Signup from "./components/Signup";
import ProfileDetail from "./components/ProfileDetail";
import Main from "./components/Main";
import QuizEditMode from "./components/QuizEditMode";

const BaseRouter = (props) => (
  <Switch>
    <Route exact path="/" component={QuizList} />
    <Route exact path="/login/" component={NormalLoginForm} />
    <Route exact path="/signup/" component={Signup} />
    <Route exact path="/profile/:id/" component={ProfileDetail} />
    <Route exact path="/create/" component={QuizCreate} />
    <Route exact path="/:id/" component={QuizDetail} />
    <Route exact path="/:id/start/" component={Main} />
    <Route exact path="/:id/edit/" component={QuizEditMode} />
  </Switch>
);

export default BaseRouter;
