import React from "react";
import { Route } from "react-router-dom";

import QuizList from "./components/QuizList";
import QuizDetail from "./components/QuizDetail";
import QuizForm from "./components/QuizForm";

const BaseRouter = () => (
  <div>
    <Route path="/" component={QuizList} exact />
    <Route exact path="/:id" component={QuizDetail} />
    <Route exact path="/:id/start" component={QuizForm} />
  </div>
);

export default BaseRouter;
