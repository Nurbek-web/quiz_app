import React, { useEffect, useState } from "react";
import instance from "../config";
import { connect } from "react-redux";
import { Skeleton, Result, Button, Descriptions, Badge } from "antd";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import { UserOutlined } from "@ant-design/icons";

function ProfileDetail(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchUser = () => {
    instance
      .get(`profiles/${props.match.params.id}/`)
      .then((res) => {
        console.log(res);
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    fetchUser();
    TimeAgo.addLocale(en);
  }, []);

  return (
    <div className="container">
      {loading ? (
        <Skeleton active />
      ) : error ? (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      ) : (
        <div>
          {user.is_superuser ? (
            <div className="text-center">
              <UserOutlined style={{ fontSize: 40 }} />
              ADMIN
            </div>
          ) : null}
          <Descriptions title="User Info" bordered>
            <Descriptions.Item label="Username">
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Last seen">
              <ReactTimeAgo date={user.last_login} locale="en-US" />
            </Descriptions.Item>
            <Descriptions.Item label="Date joined">
              <ReactTimeAgo date={user.date_joined} locale="en-US" />
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuth: state.isAuth,
  };
};

export default connect(mapStateToProps, null)(ProfileDetail);
