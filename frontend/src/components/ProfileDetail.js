import React, { useEffect, useState } from "react";
import instance from "../config";
import { connect } from "react-redux";
import {
  Skeleton,
  Result,
  Button,
  Descriptions,
  Row,
  Col,
  Card,
  Statistic,
  Collapse,
} from "antd";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import {
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Panel } = Collapse;

function ProfileDetail(props) {
  const [user, setUser] = useState(null);
  const [quizes, setQuizes] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resultsQuizes, setResultQuizes] = useState(null);
  const [mediumResult, setMeduimResult] = useState(null);

  const fetchUser = () => {
    instance
      .get(`profiles/${props.match.params.id}/`)
      .then((res) => {
        console.log(res);
        setUser(res.data.user);
        setQuizes(res.data.quizes);
        setResults(res.data.results);
        setResultQuizes(res.data.quizes_list);
        setMeduimResult(res.data.medium_result);
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

  const DisplayData = () => {
    return (
      <div className="site-card-wrapper">
        <Row gutter={16}>
          {quizes.map((data, index) => {
            return (
              <Col span={8} key={index}>
                <Link to={`/${data.id}`}>
                  <Card title={data.name} bordered={false} className="mt-3">
                    <div className="row">
                      <div className="col-3">{data.topic}</div>
                      <div className="col-1">
                        <DisplayDifficulty difficulty={data.difficulty} />
                      </div>
                      <div className="col-3">
                        {data.number_of_questions} questions
                      </div>
                      <div className="col-3">{data.time} minute</div>
                      <div className="col-2">
                        {data.required_score_to_pass}%
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

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
          <div>
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
          <div className="pt-2 pb-2">
            {mediumResult >= 85 ? (
              <Card>
                <Statistic
                  title="Medium result"
                  value={mediumResult}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            ) : (
              <Card>
                <Statistic
                  title="Medium result"
                  value={mediumResult}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            )}
          </div>
          {results !== "No result" ? (
            <div className="pt-2">
              <Collapse accordion>
                <Panel header="History of results" key="1">
                  {results.map((result, index) => {
                    return (
                      <div className="container" key={index}>
                        <div className="row">
                          <div className="col-2">
                            <h5>{result.score}%</h5>
                          </div>
                          <div className="col-3">
                            <ReactTimeAgo date={result.date} locale="en-US" />
                          </div>
                          <div className="col-5">
                            <div key={index}>
                              <Link to={`/${resultsQuizes[index].id}`}>
                                <h5>{resultsQuizes[index].name}</h5>
                              </Link>
                            </div>
                          </div>
                          <div className="col-2">
                            {result.score >=
                            resultsQuizes[index].required_score_to_pass ? (
                              <div style={{ fontSize: 20 }}>
                                passed
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  class="bi bi-patch-check"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                                  />
                                  <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                                </svg>
                              </div>
                            ) : (
                              <div style={{ fontSize: 20 }}>
                                not passed
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  class="bi bi-patch-exclamation-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Panel>
              </Collapse>
            </div>
          ) : null}

          <DisplayData />
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
