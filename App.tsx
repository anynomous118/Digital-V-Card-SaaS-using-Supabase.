import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardApp from './DashboardApp';
import PublicVCardPage from "./PublicVCardPage";





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/v/:slug" element={<PublicVCardPage />} />

        {/* AUTHENTICATED APP */}
        <Route path="/*" element={<DashboardApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
