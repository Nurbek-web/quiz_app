import React from "react";
import { useTimer as setTimer } from "react-timer-hook";

import QuizForm from "./QuizForm";
import instance from "../config";

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      main: null,
      timerTime: null,
      isRunningTimer: true,
      isActuallyRunning: true,
    };

    this.fetchQuiz = this.fetchQuiz.bind(this);
    this.MyTimer = this.MyTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  fetchQuiz() {
    instance.get(`quiz/${this.props.match.params.id}/`).then((res) => {
      this.setState({
        time: res.data.time,
      });
      console.log(this.state.time);
      const time = new Date();
      time.setSeconds(time.getSeconds() + this.state.time * 60); // 10 minutes timer
      this.setState({ timerTime: time }, () => {
        console.log("set time! Time is : ", this.state.timerTime);
      });
    });
  }

  MyTimer({ expiryTimestamp }) {
    const { seconds, minutes, hours, isRunning } = setTimer({
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });

    if (!isRunning) {
      this.setState({ isRunningTimer: false, isActuallyRunning: false });
    }

    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "100px" }}>
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
  }

  stopTimer() {
    this.setState({
      isRunningTimer: false,
    });
  }

  componentDidMount() {
    this.fetchQuiz();
  }

  render() {
    console.log("component render");
    return (
      <div>
        {this.state.isRunningTimer ? (
          <>
            {this.state.timerTime === null ? null : (
              <this.MyTimer expiryTimestamp={this.state.timerTime} />
            )}
          </>
        ) : null}

        <div>
          <QuizForm
            id={this.props.match.params.id}
            isRunningTimer={this.state.isActuallyRunning}
            stopTimer={this.stopTimer}
          />
        </div>
      </div>
    );
  }
}
