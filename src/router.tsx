import { Route, Switch } from 'wouter';

import { AppLayout } from './layouts/app-layout';
import { FullscreenLayout } from './layouts/fullscreen-layout';
import { MainLayout } from './layouts/main-layout';
import {
  JournalScreen,
  Main,
  MuseScreen,
  NotFound,
  ProgressSccreen,
} from './pages';

type LayoutType = 'app' | 'fullscreen' | 'main';

interface LayoutProps {
  showNavigation?: boolean;
  showHeader?: boolean;
  className?: string;
}

const withLayout = (
  Component: React.ComponentType,
  layoutType: LayoutType = 'app',
  layoutProps: LayoutProps = {}
) => {
  return () => {
    const content = <Component />;

    switch (layoutType) {
      case 'app':
        return (
          <AppLayout
            showNavigation={layoutProps.showNavigation}
            showHeader={layoutProps.showHeader}
          >
            {content}
          </AppLayout>
        );

      case 'fullscreen':
        return (
          <FullscreenLayout className={layoutProps.className}>
            {content}
          </FullscreenLayout>
        );

      case 'main':
      default:
        return <MainLayout>{content}</MainLayout>;
    }
  };
};

export const Router = () => {
  return (
    <Switch>
      <Route path="/" component={withLayout(Main, 'app')} />

      <Route path="/journal" component={withLayout(JournalScreen, 'app')} />

      <Route path="/progress" component={withLayout(ProgressSccreen, 'app')} />

      <Route path="/muse" component={withLayout(MuseScreen, 'app')} />

      <Route component={withLayout(NotFound, 'main')} />
    </Switch>
  );
};
