import React, { useEffect, useState } from "react";
import { Alert, Button, Skeleton } from "antd";
import instance from "../config";
import { Link } from "react-router-dom";
import { useTimer } from "react-timer-hook";

import DisplayForm from "../containers/DisplayForm";

export default function QuizForm(props) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [values, setValues] = useState("");
  const [isRunning, setIsRunning] = useState(true);

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const [percentOfCorrectAnswers, setPercentOfCorrectAnswers] = useState("");

  const fetchQuestions = () => {
    const id = props.match.params.id;
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

  function MyTimer({ expiryTimestamp }) {
    const { seconds, minutes, hours, days, isRunning } = useTimer({
      expiryTimestamp,
    });
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "100px" }}>
          <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
          <span>{seconds}</span>
        </div>
        <div style={{ display: "none" }}>
          {setIsRunning(isRunning ? true : false)}
        </div>
      </div>
    );
  }

  let time;

  useEffect(() => {
    fetchQuestions();
    console.log("useEffect");

    time = new Date();
    time.setSeconds(time.getSeconds() + data.quiz.time * 60);
  }, []);

  return (
    <>
      {isRunning ? (
        <div>
          {showResult ? null : (
            <div>
              {loading ? (
                <Skeleton active />
              ) : (
                <div>
                  <div className="container">
                    {/* <div style={{ display: "none" }}>
                      {time.setSeconds(time.getSeconds() + data.quiz.time * 60)}
                    </div> */}
                    <MyTimer expiryTimestamp={time} />
                  </div>
                  <div className="container">
                    <DisplayForm
                      data={data}
                      HandleSubmit={HandleSubmit}
                      error={error}
                      onChange={onChange}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {showResult ? (
            <div className="container mt-3">
              {console.log(result)}
              {result ? (
                <Alert
                  message="Success!!!"
                  description={`You passed this test. Your score is ${percentOfCorrectAnswers}%`}
                  type="success"
                  showIcon
                />
              ) : (
                <Alert
                  message="Fail"
                  description={`You failed test :( . Your score is ${percentOfCorrectAnswers}%. Required score is ${data.quiz.required_score_to_pass}%`}
                  type="error"
                  showIcon
                />
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
          message="Time is wasted"
          description="Sorry, your time came up ): !"
          type="error"
          showIcon
        />
      )}
    </>
  );
}
