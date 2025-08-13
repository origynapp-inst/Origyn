import type {
  FC,
  ReactNode,
} from 'react';

interface FullscreenLayoutProps {
  children: ReactNode;
  className?: string;
}

export const FullscreenLayout: FC<FullscreenLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`main-container prevent-overscroll min-h-screen ${className}`}>
      {children}
    </div>
  );
};
