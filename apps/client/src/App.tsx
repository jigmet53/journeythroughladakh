import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { AppRouter } from './app/router';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}
