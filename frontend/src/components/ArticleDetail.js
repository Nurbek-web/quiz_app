import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";

import instance from "../config";

export default function ArticleDetail(props) {
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuiz = () => {
    const id = props.match.params.id; // Getting ID of quiz
    instance
      .get(`quiz/${id}/`)
      .then((res) => {
        setQuiz(res.data);
        setLoading(false);
        console.log(res);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const DisplayQuiz = () => {
    return <div className="container"></div>;
  };

  return (
    <div className="container">
      {loading ? <Skeleton active /> : <DisplayQuiz />}
    </div>
  );
}
