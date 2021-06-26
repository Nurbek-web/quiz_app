import React, { useState, useEffect } from "react";
import instance from "../config";
import { connect } from "react-redux";
import {
  Result,
  Button,
  Descriptions,
  Form,
  Select,
  Input,
  Card,
  Checkbox,
  Alert,
} from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

function QuizEditMode(props) {
  const [quiz, setQuiz] = useState(null);
  const [displayForm, setDisplayForm] = useState(false);
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [displayAnswerForm, setDisplayAnswerForm] = useState(false);
  const [key, setKey] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [checkboxValue, setCheckBoxValue] = useState(false);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Token ${props.token}`,
    },
  };

  const gridStyle = {
    width: "25%",
    textAlign: "center",
  };

  const fetchQuiz = () => {
    instance.get(`quiz/${props.match.params.id}/`).then((res) => {
      console.log(res);
      setQuiz(res.data);
    });
  };

  const fetchQuestionsAndAnswers = () => {
    instance
      .get(`quiz/${props.match.params.id}/questions/`, config)
      .then((res) => {
        console.log(res);
        setQuestions(res.data.questions);
        setAnswers(res.data.answers);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchQuiz();
    fetchQuestionsAndAnswers();
  }, []);

  const DisplayDifficulty = (difficulty) => {
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

  const DisplayQuizDetail = () => {
    if (quiz !== null) {
      return (
        <div>
          <Descriptions
            title="Quiz description"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Name">{quiz.name}</Descriptions.Item>
            <Descriptions.Item label="Topic">{quiz.topic}</Descriptions.Item>
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
        </div>
      );
    }
    return null;
  };

  const AnswerForm = () => {
    return (
      <Form
        className="container pt-3"
        form={form}
        layout="vertical"
        scrollToFirstError={true}
        onFinish={onFinishAnswerForm}
      >
        <Form.Item
          name="text"
          rules={[
            {
              required: true,
              message: "Please enter text of answer!",
            },
          ]}
          hasFeedback
        >
          <Input placeholder="Enter the question text" />
        </Form.Item>
        <Form.Item name="correct">
          <Checkbox onChange={onChangeCheckbox}>
            Correct (Specifies if answer is correct)
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <button type="submit" className="btn btn-success">
            Submit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setDisplayAnswerForm(false)}
          >
            Cancel
          </button>
        </Form.Item>
      </Form>
    );
  };

  const onChangeCheckbox = (e) => {
    setCheckBoxValue(e.target.checked);
    console.log(`checked = ${e.target.checked}`);
  };

  const onClick = (value) => {
    setDisplayForm(value);
    setDisplayAnswerForm(false);
  };

  const onClickAnswerForm = (boolean, key, question_id) => {
    setKey(key);
    setDisplayAnswerForm(boolean);
    setQuestionId(question_id);
    setDisplayForm(false);
  };

  const onFinishAnswerForm = (values) => {
    const data = {
      text: values.text,
      quiz: questionId,
      correct: checkboxValue,
      question: questionId,
    };
    console.log({
      text: values.text,
      quiz: questionId,
      correct: checkboxValue,
      question: questionId,
    });
    instance.post(`quiz/${quiz.id}/answer/`, data, config);
    setDisplayAnswerForm(false);
    form.resetFields();
    fetchQuestionsAndAnswers();
  };

  const handleDeleteOfAnswer = (question, answer) => {
    const data = {
      question: question,
      answer: answer,
      user_id: props.user_id,
    };
    instance
      .delete(`quiz/${quiz.id}/answer/delete/`, data, config)
      .then((res) => console.log(res));
  };

  const onFinish = (values) => {
    console.log(values);
    instance
      .post(
        `quiz/${props.match.params.id}/edit/`,
        {
          text: values.name,
          quiz: quiz.id,
        },
        config
      )
      .then((res) => {
        console.log(res);
        setDisplayForm(false);
      });
    fetchQuestionsAndAnswers();
  };

  return (
    <div>
      {props.isAuth ? (
        <>
          {quiz !== null ? (
            <>
              <DisplayQuizDetail />
              {questions !== null ? (
                <div className="pt-3  ">
                  <h5>Questions:</h5>
                  {questions.map((question, index) => {
                    return (
                      <div className="pt-3" key={index}>
                        {answers !== null ? (
                          <>
                            <Card
                              title={
                                <>
                                  {question.text}
                                  <Button
                                    type="primary"
                                    style={{
                                      display: "flex",
                                      justifyContent: "left",
                                    }}
                                    onClick={() =>
                                      onClickAnswerForm(
                                        true,
                                        question.text,
                                        question.id
                                      )
                                    }
                                  >
                                    + add answer
                                  </Button>
                                </>
                              }
                            >
                              {answers[index].length == 0 ? (
                                <Alert
                                  message="Warning"
                                  description="Your quiz cannot start without any answer to question"
                                  type="warning"
                                  showIcon
                                  closable
                                />
                              ) : (
                                <>
                                  {answers[index].map((answer) => {
                                    return (
                                      <Card.Grid style={gridStyle}>
                                        {answer.text}
                                        <h1> </h1>
                                        <button
                                          className="btn btn-danger"
                                          onClick={() =>
                                            handleDeleteOfAnswer(
                                              question.id,
                                              answer.id
                                            )
                                          }
                                        >
                                          Delete
                                        </button>
                                      </Card.Grid>
                                    );
                                  })}
                                </>
                              )}
                            </Card>
                            {displayAnswerForm ? (
                              <>
                                {question.text == key ? <AnswerForm /> : null}
                              </>
                            ) : null}
                          </>
                        ) : (
                          <h1>NULL</h1>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
              {quiz.author == props.user_id ? (
                <div className="container text-center pt-3">
                  {displayForm ? (
                    <Form
                      className="container pt-3"
                      form={form}
                      layout="vertical"
                      onFinish={onFinish}
                      scrollToFirstError={true}
                    >
                      <Form.Item
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please select your name of quiz!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input placeholder="Enter the question text" />
                      </Form.Item>
                      <Form.Item>
                        <button type="submit" className="btn btn-success">
                          Submit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => onClick(false)}
                        >
                          Cancel
                        </button>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Button type="primary" onClick={() => onClick(true)}>
                      + add question
                    </Button>
                  )}
                </div>
              ) : (
                <h1 className="text-center">Permission Denied!</h1>
              )}
            </>
          ) : null}
        </>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Link to="/">
              <Button type="primary">Back Home</Button>
            </Link>
          }
        />
      )}
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

export default connect(mapStateToProps, null)(QuizEditMode);
