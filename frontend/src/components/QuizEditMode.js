import React, { useState, useEffect, Switch } from "react";
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
  InputNumber,
  BackTop,
  notification,
} from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
};

const style = {
  height: 40,
  width: 40,
  lineHeight: "40px",
  borderRadius: 4,
  backgroundColor: "#1088e9",
  color: "#fff",
  textAlign: "center",
  fontSize: 14,
};

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
  const [displayQuizForm, setDisplayQuizForm] = useState(false);
  const [warning, setWarning] = useState(false);

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
          <div className="pt-2">
            <DisplayQuizDetailForm />
          </div>
        </div>
      );
    }
    return null;
  };

  const DisplayQuizDetailForm = () => {
    const initialValues = {
      name: quiz.name,
      topic: quiz.topic,
      time: quiz.time,
      required_score_to_pass: quiz.required_score_to_pass,
      difficulty: quiz.difficulty,
    };

    return (
      <>
        {displayQuizForm ? (
          <Form
            onFinish={onFinishQuizDetailForm}
            layout="vertical"
            scrollToFirstError={true}
            initialValues={initialValues}
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please select your name of quiz!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter the quiz name" />
            </Form.Item>
            <Form.Item
              name="topic"
              rules={[
                { required: true, message: "Please select topic of quiz!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Enter topic of quiz" />
            </Form.Item>
            <Form.Item
              name="time"
              {...formItemLayout}
              label="Enter the time of quiz (in minutes)"
              rules={[
                { required: true, message: "Please select time of your quiz!" },
              ]}
              hasFeedback
            >
              <InputNumber min={1} max={1400} />
            </Form.Item>

            <Form.Item
              hasFeedback
              name="required_score_to_pass"
              {...formItemLayout}
              label="Enter the required score to pass (%)"
              rules={[
                {
                  required: true,
                  message: "Please select required score to pass (%)!",
                },
              ]}
            >
              <InputNumber min={1} max={100} />
            </Form.Item>

            <Form.Item
              name="difficulty"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please select difficulty of your quiz",
                },
              ]}
            >
              <Select placeholder="Please select a difficulty of your quiz">
                <Option value="easy">easy</Option>
                <Option value="medium">medium</Option>
                <Option value="hard">hard</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <div className="row justify-content-between">
                <div className="col-6">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
                <div className="col-6 text-right">
                  <button
                    className="btn btn-warning"
                    onClick={() => setDisplayQuizForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form.Item>
          </Form>
        ) : (
          <div className="text-center">
            <Button type="primary" onClick={() => setDisplayQuizForm(true)}>
              Edit
            </Button>
          </div>
        )}
      </>
    );
  };

  const openNotification = () => {
    if (!warning) {
      notification.open({
        message: "Warning",
        description:
          "Your quiz cannot start without any answer to question. Please, add any answer to your question",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
      setWarning(true);
    }
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
          <Input placeholder="Enter the answer text" />
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

  const onFinishQuizDetailForm = (values) => {
    instance
      .put(`quiz/${quiz.id}/update/`, values, config)
      .then((res) => {
        console.log(res);
        setDisplayQuizForm(false);
        fetchQuiz();
      })
      .catch((err) => console.error(err));
  };

  const onChangeCheckbox = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setCheckBoxValue(e.target.checked);
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
    instance.post(`quiz/${quiz.id}/answer/`, data, config).then(() => {
      fetchQuestionsAndAnswers();
    });
    setDisplayAnswerForm(false);
    form.resetFields();
  };

  const handleDeleteOfAnswer = (answer) => {
    instance
      .delete(`quiz/${quiz.id}/answer/${answer}/delete/`, config)
      .then((res) => {
        console.log(res);
        fetchQuestionsAndAnswers();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteOfQuestion = (question) => {
    instance
      .delete(`quiz/${quiz.id}/question/${question}/delete/`, config)
      .then((res) => {
        console.log(res);
        fetchQuestionsAndAnswers();
      })
      .catch((err) => console.error(err));
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
        fetchQuestionsAndAnswers();
      });
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
                                <div>
                                  <div className="row">
                                    <div className="col-12">
                                      {question.text}
                                    </div>
                                  </div>

                                  <div className="row justify-content-between">
                                    <div className="col-4">
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
                                    </div>
                                    <div className="col-4 text-right">
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          handleDeleteOfQuestion(question.id)
                                        }
                                      >
                                        <DeleteOutlined
                                          style={{ fontSize: 20 }}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              }
                            >
                              {answers[index] === undefined ? null : (
                                <>
                                  {answers[index].length == 0 ? (
                                    <>
                                      <Alert
                                        message="Warning"
                                        description="Your quiz cannot start without any answer to question"
                                        type="warning"
                                        showIcon
                                        closable
                                      />
                                      {openNotification()}
                                    </>
                                  ) : (
                                    <>
                                      {answers[index].map((answer) => {
                                        return (
                                          <Card.Grid style={gridStyle}>
                                            {answer.text}
                                            {answer.correct ? (
                                              <CheckCircleTwoTone
                                                twoToneColor="#52c41a"
                                                style={{ fontSize: 15 }}
                                                className="pl-1"
                                              />
                                            ) : null}
                                            <h1> </h1>
                                            <button
                                              className="btn btn-danger"
                                              onClick={() =>
                                                handleDeleteOfAnswer(answer.id)
                                              }
                                            >
                                              <DeleteOutlined
                                                style={{ fontSize: 20 }}
                                              />
                                            </button>
                                          </Card.Grid>
                                        );
                                      })}
                                    </>
                                  )}
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
      <BackTop>
        <div style={style}>UP</div>
      </BackTop>
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
