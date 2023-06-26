import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./Routes/Routes";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
