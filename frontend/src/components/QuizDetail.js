import React, { useEffect, useState } from "react";
import { Skeleton, Descriptions, Result, Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import instance from "../config";

function QuizDetail(props) {
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQuiz = () => {
    const id = props.match.params.id; // Getting ID of quiz
    instance
      .get(`quiz/${id}/`)
      .then((res) => {
        setQuiz(res.data);
        setLoading(false);
        console.log(res);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const DisplayDifficulty = (difficulty) => {
    console.log(difficulty);
    switch (difficulty.difficulty) {
      case "easy":
        return <div style={{ backgroundColor: "green", width: 30 }}> </div>;
        break;
      case "medium":
        return <div style={{ backgroundColor: "yellow", width: 30 }}> </div>;
        break;
      case "hard":
        return <div style={{ backgroundColor: "red", width: 30 }}> </div>;
        break;
    }
  };

  const DisplayQuiz = () => {
    if (error) {
      return (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      );
    } else {
      return (
        <div>
          <Descriptions
            title="Quiz description"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Name">{quiz.name}</Descriptions.Item>
            <Descriptions.Item label="Topic">{quiz.topic}</Descriptions.Item>
            <Descriptions.Item label="Number of questions">
              {quiz.number_of_questions}
            </Descriptions.Item>
            <Descriptions.Item label="Required score to pass (%)">
              {quiz.required_score_to_pass}
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              {quiz.difficulty}
              <DisplayDifficulty difficulty={quiz.difficulty} />
            </Descriptions.Item>
            <Descriptions.Item label="Time (minutes)">
              {quiz.time}
            </Descriptions.Item>
          </Descriptions>
          <div
            className="mt-3"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Link to={`${quiz.id}/start`}>
              <button className="btn btn-success">Get started!</button>
            </Link>
            {quiz.author == props.user_id ? (
              <Link to={`${quiz.id}/edit/`}>
                <button className="btn btn-warning">Edit</button>
              </Link>
            ) : null}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      {loading ? <Skeleton active /> : <DisplayQuiz />}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    isAuth: state.isAuth,
    user_id: state.user_id,
  };
};

export default connect(mapStateToProps, null)(QuizDetail);
