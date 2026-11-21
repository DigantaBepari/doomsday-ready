import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { BookingPage } from "../pages/BookingPage";
import { MoviesPage } from "../pages/MoviesPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RewatchPlanPage } from "../pages/RewatchPlanPage";

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/movies" replace />} />
      <Route path="movies" element={<MoviesPage />} />
      <Route path="rewatch" element={<RewatchPlanPage />} />
      <Route path="booking" element={<BookingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);
