import React, { useEffect, useState } from "react";
import { Alert, Button, Skeleton, Progress } from "antd";
import instance from "../config";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import DisplayForm from "../containers/DisplayForm";

function QuizForm(props) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [values, setValues] = useState("");

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const [percentOfCorrectAnswers, setPercentOfCorrectAnswers] = useState("");

  const fetchQuestions = () => {
    const id = props.id;
    console.log(id);
    instance
      .get(`quiz/${id}/form/`)
      .then((res) => {
        console.log(res);
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  const HandleSubmit = () => {
    let correctAnswers = 0;
    let questionNumber = data.questions.length;

    console.log("form has submitted", values);

    Object.entries(values).map((item) => {
      if (item[1]) {
        correctAnswers++;
      }
    });
    setPercentOfCorrectAnswers((correctAnswers / questionNumber) * 100);
    console.log(correctAnswers);
    console.log(data.quiz.required_score_to_pass);

    if (
      (correctAnswers / questionNumber) * 100 >=
      data.quiz.required_score_to_pass
    ) {
      setResult(true);
      console.log(result);
      console.log("YEEEEEEEEEEEEEEES!!");
    } else {
      setResult(false);
    }

    console.log(questionNumber);
    console.log(percentOfCorrectAnswers + "%");
    setShowResult(true);

    // Stopping timer
    props.stopTimer();

    // sending result to server
    console.log("Is authenticated :", props.isAuth);
    if (props.isAuth) {
      console.log("Posting results");
      console.log(props.token);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Token ${props.token}`,
        },
      };
      instance
        .post(
          "results/create/",
          {
            user: props.user_id,
            quiz: data.quiz.id,
            score: (correctAnswers / questionNumber) * 100,
          },
          config
        )
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  };

  const onChange = (event, name) => {
    console.log("radio checked", event.target.value);
    const value = event.target.value;

    setValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    console.log(values);
  };

  useEffect(() => {
    fetchQuestions();
    console.log("useEffect");
  }, []);

  return (
    <>
      {props.isRunningTimer ? (
        <div>
          {showResult ? null : (
            <div>
              {loading ? (
                <Skeleton active />
              ) : (
                <div className="container">
                  <DisplayForm
                    data={data}
                    HandleSubmit={HandleSubmit}
                    error={error}
                    onChange={onChange}
                  />
                </div>
              )}
            </div>
          )}
          {showResult ? (
            <div className="container mt-3">
              {console.log(result)}
              {result ? (
                <>
                  <Alert
                    message="Success!!!"
                    description={`You passed this test. Your score is ${percentOfCorrectAnswers}%`}
                    type="success"
                    showIcon
                  />
                  <Progress
                    type="circle"
                    percent={percentOfCorrectAnswers}
                    status={"success"}
                    className="container text-center pt-4"
                  />
                </>
              ) : (
                <>
                  <Alert
                    message="Fail"
                    description={`You failed test :( . Your score is ${percentOfCorrectAnswers}%. Required score is ${data.quiz.required_score_to_pass}%`}
                    type="error"
                    showIcon
                  />
                  <Progress
                    type="circle"
                    percent={percentOfCorrectAnswers}
                    status={"exception"}
                    className="container text-center pt-4"
                  />
                </>
              )}
              <div className="mt-3 text-center">
                <Link to="/">
                  <Button type="primary">Back to home</Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <Alert
          message="Your time is up!"
          description="Sorry, you have wasted your time :("
          type="error"
          showIcon
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
    user_id: state.user_id,
    token: state.token,
  };
};

export default connect(mapStateToProps, null)(QuizForm);
