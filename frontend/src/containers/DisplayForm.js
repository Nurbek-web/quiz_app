import React from "react";
import { Radio, Space, Result, Button, Form } from "antd";

const DisplayForm = ({ data, HandleSubmit, error, onChange }) => {
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
        <Form onFinish={HandleSubmit}>
          {data.questions.map((question, index) => {
            return (
              <div className="mb-3" key={index}>
                <Radio.Group
                  value={question.text}
                  onChange={(event) => onChange(event, question.id)}
                >
                  <div className="mb-1">
                    <h5>{question.text}</h5>
                  </div>
                  <Space direction="vertical">
                    {data.answers[index].map((answer, index) => {
                      return (
                        <Radio value={answer.correct} key={index}>
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

export default DisplayForm;
