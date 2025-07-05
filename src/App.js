import "./App.css";
import DashboardPage from "./Components/Home/Home";
import { Routes, Route } from "react-router-dom";
import Login from "../src/Components/AuthenticationPages/LogIn";
import SignUp from "../src/Components/AuthenticationPages/SignUp";
import { BrowserRouter } from "react-router-dom";
import Forget from "./Components/AuthenticationPages/Forget";
import Reset from "./Components/AuthenticationPages/Reset";
import { useSelector } from "react-redux";

function App() {
  const { token } = useSelector((state) => state);

  return (
    <BrowserRouter basename="/autasisAdmin">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/reset" element={<Reset />} />

        {
          token ? (
            <Route path="*" element={<DashboardPage />} />
          ) : (
            <Route path="/" element={<Login />} />
          )
        }
      </Routes>
    </BrowserRouter>
  );
}

export default App;