import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ConfigProvider } from "./contexts/ConfigContext";
import Layout from "./components/Layout";
import Login from "./pages/Auth/login";
import renderRoutes from "./Routes/routesController";
import { commonRoutes, adminRoutes } from "./Routes/routersConfig";
import NotFound from "./components/feedback/notFound";
import Home from "./pages/Home";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./theme.css";
import React from "react";
import { AlertProvider } from "./contexts/AlertContext";

const allowedRoutes = ["admin", "assetManager", "globalAssetManager"];
function App() {
  const basename =
    process.env.REACT_APP_ENV === "production" ? "/universal_signage" : "/";

  return (
    // Remove and rely on package.json
    <Router basename={basename}>
      <AuthProvider>
        <ConfigProvider>
          <AlertProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                {renderRoutes(commonRoutes, "common", allowedRoutes)}
                {renderRoutes(adminRoutes, "admin", allowedRoutes)}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AlertProvider>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;
