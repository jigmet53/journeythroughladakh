import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/home/HomePage';
import { PlacesPage } from '../pages/places/PlacesPage';
import { DestinationDetailPage } from '../pages/places/DestinationDetailPage';
import { PlannerPage } from '../pages/planner/PlannerPage';
import { AiPage } from '../pages/ai/AiPage';
import { LoginPage } from '../pages/account/LoginPage';
import { RegisterPage } from '../pages/account/RegisterPage';
import { TripsPage } from '../pages/account/TripsPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/places/:slug" element={<DestinationDetailPage />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/ai" element={<AiPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/account/trips"
        element={
          <ProtectedRoute>
            <TripsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
