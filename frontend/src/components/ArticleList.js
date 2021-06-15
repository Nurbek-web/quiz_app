import { Card, Col, Row, Skeleton } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import instance from "../config";

export default class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      loading: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.DisplayData = this.DisplayData.bind(this);
    this.DisplayDifficulty = this.DisplayDifficulty.bind(this);
  }
  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  fetchData() {
    instance
      .get("/quiz/")
      .then((res) => {
        this.setState({
          data: res.data,
          loading: true,
        });
        console.log(res.data);
      })
      .catch((e) => console.error(e));
  }

  componentDidMount() {
    this.fetchData();
  }

  DisplayDifficulty(difficulty) {
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
  }

  DisplayData() {
    return (
      <div className="site-card-wrapper">
        <Row gutter={16}>
          {this.state.data.map((data, index) => {
            return (
              <Col span={8} key={index}>
                <Link to={`${data.id}`}>
                  <Card title={data.name} bordered={false} className="mt-3">
                    <div className="row">
                      <div className="col-3">{data.topic}</div>
                      <div className="col-1">
                        <this.DisplayDifficulty difficulty={data.difficulty} />
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
  }

  render() {
    return (
      <div>
        {this.state.loading ? <this.DisplayData /> : <Skeleton active />}
      </div>
    );
  }
}
