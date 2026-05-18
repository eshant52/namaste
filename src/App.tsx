import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <div className="font-display min-h-screen w-screen antialiased bg-background text-foreground">
      <Outlet />
    </div>
  );
}

export default App;
