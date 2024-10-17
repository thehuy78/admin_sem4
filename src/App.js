import { Route, Routes } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import Aboutus from "./page/Aboutus";
import FileNotFound from "./page/FileNotFound";
import Auth from "./page/Auth";
import "./style/Main.scss"
import ProtectedRoute from "./function/ProtectedRoute";
import { CookiesProvider } from "react-cookie";
import { LayoutProvider } from "./hook/Layout/LayoutContext";
import LayoutSwitch from "./hook/Layout/LayoutSwitch";
function App() {
  return (

    <CookiesProvider> {/* Cung cấp context cho cookies */}
      <LayoutProvider>
        <LayoutSwitch>
          <Routes>
            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="about" element={<Aboutus />} />
              <Route path="*" element={<FileNotFound />} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={<Auth />} />
          </Routes>
        </LayoutSwitch>
      </LayoutProvider>
    </CookiesProvider>
  );
}

export default App;
