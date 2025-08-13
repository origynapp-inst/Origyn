import { type FC } from 'react';

import { twMerge } from 'tailwind-merge';
import { useLocation } from 'wouter';

import { useOrigyn } from '@/hooks/useOrigyn';
import { navigationMenu } from '@/lib/constants';
import { getTranslatedText } from '@/lib/translations';

export const Navigation = () => {
  const { user, language, theme } = useOrigyn();
  const [location, navigate] = useLocation();
  const currentPath = location.split('/')[1];

  const t = (englishText: string): string => {
    const currentLang = user?.language || language;
    const translated = getTranslatedText(englishText, currentLang);
    return translated;
  };

  return (
    <div
      className={twMerge(
        'nav-bar-fixed px-6',
        theme === 'dark' ? 'backdrop-blur-glass' : 'backdrop-blur-glass light'
      )}
    >
      <div className="flex justify-around">
        {navigationMenu.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path.split('/')[1];
          return (
            <NavigationButton
              key={item.path}
              icon={Icon}
              label={t(item.label)}
              path={item.path}
              isActive={isActive}
              onClick={() => navigate(item.path)}
              theme={theme}
            />
          );
        })}
      </div>
    </div>
  );
};

type NavigationButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
  theme: string;
};

const NavigationButton: FC<NavigationButtonProps> = ({
  icon: Icon,
  label,
  path,
  isActive,
  onClick,
  theme = 'light',
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex flex-col items-center gap-1',
        isActive
          ? 'text-purple-500'
          : theme === 'dark'
          ? 'text-gray-400'
          : 'text-gray-600'
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </button>
  );
};
