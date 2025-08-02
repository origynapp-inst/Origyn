import './index.css';

import {
  Route,
  Switch,
} from 'wouter';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClientProvider } from '@tanstack/react-query';

import Origyn from './components/Origyn';
import { queryClient } from './lib/queryClient';
import Journal from './pages/Journal';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Origyn} />
      <Route path="/journal" component={() => <Journal onBack={() => window.history.back()} />} />
      <Route>
        <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-400">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="main-container prevent-overscroll">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
