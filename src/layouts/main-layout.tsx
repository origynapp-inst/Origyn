import type {
  FC,
  ReactNode,
} from 'react';

export const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="main-container prevent-overscroll">
      {/* Add your common layout elements here */}
      {/* Header, Navigation, Footer, etc. */}
      <main>
        {children}
      </main>
    </div>
  );
}
