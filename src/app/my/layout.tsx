import { FC, ReactNode } from 'react';
import { Metadata } from 'next';

import HomeLayout from 'features/my/layouts/HomeLayout';
import HomeThemeProvider from 'features/my/components/HomeThemeProvider';

export const metadata: Metadata = {
  robots: { follow: true, index: false },
};

type Props = {
  children: ReactNode;
};

const MyHomeLayout: FC<Props> = ({ children }) => {
  const homeTitle = process.env.HOME_TITLE;

  return (
    <HomeThemeProvider>
      <HomeLayout title={homeTitle}>{children}</HomeLayout>
    </HomeThemeProvider>
  );
};

export default MyHomeLayout;
