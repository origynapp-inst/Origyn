import { ChevronLeft, Link } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-400">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button variant="secondary" className="mt-4">
            <ChevronLeft /> Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
};
