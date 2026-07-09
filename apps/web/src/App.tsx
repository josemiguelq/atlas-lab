import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout.js";
import { NewOrderPage } from "./pages/NewOrderPage.js";
import { ViewOrderPage } from "./pages/ViewOrderPage.js";
import { HomePage } from "./pages/HomePage.js";
import { BancadaAnalisePage } from "./pages/BancadaAnalisePage.js";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/os/new" element={<NewOrderPage />} />
        <Route path="/os/:id" element={<ViewOrderPage />} />
        <Route path="/bancada/analise" element={<BancadaAnalisePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
