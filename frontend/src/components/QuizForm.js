import React, { useEffect, useState } from "react";
import { Radio, Input, Space, Result, Button, Skeleton, Form } from "antd";

import instance from "../config";

export default function QuizForm(props) {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [values, setValues] = useState("");

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

  const onChange = (event, name) => {
    console.log("radio checked", event.target.value);
    const value = event.target.value;

    setValues((prev) => {
      return {
        ...prev,
        [value]: value,
      };
    });

    console.log(values);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const DisplayForm = () => {
    if (error) {
      return (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      );
    }
    return (
      <div>
        <div className="container">
          <Form onFinish={() => console.log("form has submitted")}>
            {data.questions.map((question, index) => {
              return (
                <div className="mb-3" key={index}>
                  <Radio.Group onChange={onChange(question.id)}>
                    <div className="mb-1">
                      <h5>{question.text}</h5>
                    </div>
                    <Space direction="vertical">
                      {console.log(data.answers[index])}
                      {data.answers[index].map((answer, index) => {
                        return (
                          <Radio key={index} value={answer.text}>
                            {answer.text}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </div>
              );
            })}
            <button className="btn btn-success" type="submit">
              Submit
            </button>
          </Form>
        </div>
      </div>
    );
  };

  return <>{loading ? <Skeleton active /> : <DisplayForm />}</>;
}
