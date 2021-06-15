import "./App.css";

import MyLayout from "./containers/Layout";
import BaseRouter from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <MyLayout>
          <BaseRouter />
        </MyLayout>
      </Router>
    </div>
  );
}

export default App;
