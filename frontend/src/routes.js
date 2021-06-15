import React from "react";
import { Route } from "react-router-dom";

import ArticleList from "./components/ArticleList";
import ArticleDetail from "./components/ArticleDetail";

const BaseRouter = () => (
  <div>
    <Route path="/" component={ArticleList} exact />
    <Route exact path="/:id" component={ArticleDetail} />
  </div>
);

export default BaseRouter;
