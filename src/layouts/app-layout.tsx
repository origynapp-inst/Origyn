import type {
  FC,
  ReactNode,
} from 'react';

import { Link } from 'wouter';

import { Navigation } from '@/components/features/navigation';

interface AppLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showHeader?: boolean;
}

export const AppLayout: FC<AppLayoutProps> = ({ 
  children, 
  showHeader = false 
}) => {


  return (
    <div className="main-container prevent-overscroll min-h-screen bg-background">
      {showHeader && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">Origyn</span>
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      <Navigation />
    </div>
  );
};
