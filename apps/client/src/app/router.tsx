import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/home/HomePage';
import { PlacesPage } from '../pages/places/PlacesPage';
import { DestinationDetailPage } from '../pages/places/DestinationDetailPage';
import { PackagesPage } from '../pages/packages/PackagesPage';
import { PackageDetailPage } from '../pages/packages/PackageDetailPage';
import { PlannerPage } from '../pages/planner/PlannerPage';
import { ItineraryDetailPage } from '../pages/itinerary/ItineraryDetailPage';
import { AiPage } from '../pages/ai/AiPage';
import { LoginPage } from '../pages/account/LoginPage';
import { RegisterPage } from '../pages/account/RegisterPage';
import { TripsPage } from '../pages/account/TripsPage';
import { CreditsPage } from '../pages/about/CreditsPage';
import { AboutPage } from '../pages/about/AboutPage';
import { ContactPage } from '../pages/contact/ContactPage';
import { FaqPage } from '../pages/faq/FaqPage';
import { GuidePage } from '../pages/guide/GuidePage';
import { PrivacyPage } from '../pages/legal/PrivacyPage';
import { TermsPage } from '../pages/legal/TermsPage';
import { InboxPage } from '../pages/admin/InboxPage';
import { NotFoundPage } from '../pages/system/NotFoundPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/places/:slug" element={<DestinationDetailPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/packages/:slug" element={<PackageDetailPage />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
      <Route path="/ai" element={<AiPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/credits" element={<CreditsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route
        path="/admin/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/trips"
        element={
          <ProtectedRoute>
            <TripsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
