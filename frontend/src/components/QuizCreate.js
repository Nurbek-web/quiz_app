import React, { useState } from "react";
import instance from "../config";
import { connect } from "react-redux";
import { Form, Input, Button, InputNumber, Select, Result } from "antd";
import { Link } from "react-router-dom";
import { browserHistory } from "react-router";

const { Option } = Select;

function QuizCreate(props) {
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 12 },
  };

  const onFinish = (values) => {
    console.log(values);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${props.token}`,
      },
    };
    instance.post("quiz/create/", values, config).then((res) => {
      props.history.push("/");
      console.log(res);
    });
  };

  return (
    <div>
      {props.isAuth ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError={true}
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
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
  };
};

export default connect(mapStateToProps, null)(QuizCreate);
