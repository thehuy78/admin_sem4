//lib
import { CookiesProvider } from "react-cookie";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
//provider
import ProtectedRoute from "./shared/function/ProtectedRoute";
import { LayoutProvider } from "./shared/hook/Layout/LayoutContext";
import LayoutSwitch from "./shared/hook/Layout/LayoutSwitch";
import { ContextToken } from "./shared/hook/ContextToken";
//page
import Dashboard from "./features/Dashboard/page/Dashboard";
import Aboutus from "./features/Aboutus/page/Aboutus";
import FileNotFound from "./shared/Config/FileNotFound";
import Auth from "./features/Auth/page/Auth";
import ListHospital from "./features/Hospital/page/ListHospital";
import CreateHospital from "./features/Hospital/page/CreateHospital";
//css
import "./shared/layout/style/Main.scss"



function App() {

  console.log(process.env.REACT_APP_API_KEY);

  useEffect(() => {
    const body = document.body;
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    }
  }, []);
  return (

    <CookiesProvider> {/* Cung cấp context cho cookies */}
      <LayoutProvider>
        <LayoutSwitch>
          <Routes>
            {/* Protected admin routes */}
            <Route path="/admin/*" element={<ContextToken><ProtectedRoute /></ContextToken>}>
              <Route index element={<Dashboard />} />
              <Route path="hospital/*">
                <Route index element={<ListHospital />} />
                <Route path="create" element={<CreateHospital />} />
              </Route>
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
