import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import Router from "./Routes/Routes";
import NavBar from "./components/nav/Nav";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Router />
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
