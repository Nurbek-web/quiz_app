import React, { useState } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { Form, Input, Select, Button } from "antd";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = (props) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.onAuth(
      values.nickname,
      values.email,
      values.password,
      values.confirm
    );
  };

  // const validatePassword = (rule, value, callback) => {
  //   if (value && value.length < 8) {
  //     let upper, lower;
  //     for (let i = 0; i < value.length; i++) {
  //       if (value[i] == value[i].toUpperCase()) {
  //         upper = true;
  //       }
  //       if (value[i] == value[i].toLowerCase()) {
  //         lower = true;
  //       }
  //     }
  //     if (upper & lower) {
  //       callback();
  //     } else {
  //       callback("Error");
  //     }
  //   } else {
  //     callback();
  //   }
  // };

  return (
    <div>
      {props.isAuth ? (
        <Redirect to="/" />
      ) : (
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                // validator: validatePassword,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="Nickname"
            tooltip="What do you want others to call you?"
            rules={[
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
            Or <Link to="/login">login now!</Link>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
    isAuth: state.isAuth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, email, password1, password2) =>
      dispatch(actions.authSignup(username, email, password1, password2)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
