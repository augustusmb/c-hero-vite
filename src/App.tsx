import "./App.css";
import { ToastContainer } from "react-toastify";
import MainPanelLayout from "./MainPanelLayout";

function App() {
  return (
    <div className="h-full min-h-screen bg-slate-050">
      <ToastContainer position="bottom-left" autoClose={3000} />
      <MainPanelLayout />
    </div>
  );
}

export default App;
