import React from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";
import { Form, Input, Button, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";

const NormalLoginForm = (props) => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    props.onAuth(values.username, values.password);
  };

  return (
    <div>
      {console.log(props.isAuth)}
      {props.isAuth ? (
        <Redirect to="/" />
      ) : (
        <div>
          {props.loading ? (
            <LoadingOutlined
              style={{
                fontSize: 82,
                display: "flex",
                justifyContent: "center",
              }}
              spin
            />
          ) : (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
                Or <Link to="/signup">register now!</Link>
              </Form.Item>
            </Form>
          )}
        </div>
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
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
