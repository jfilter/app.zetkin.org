import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import ClientContext from 'core/env/ClientContext';
import { getMessages } from 'utils/locale';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = 'en';
  const messages = await getMessages(lang);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ClientContext
            envVars={{
              FEAT_AREAS: process.env.FEAT_AREAS,
              FEAT_OFFICIALS: process.env.FEAT_OFFICIALS,
              FEAT_TASKS: process.env.FEAT_TASKS,
              FEAT_UNAUTH_EVENT_SIGNUP: process.env.FEAT_UNAUTH_EVENT_SIGNUP,
              INSTANCE_OWNER_HREF: process.env.INSTANCE_OWNER_HREF,
              INSTANCE_OWNER_NAME: process.env.INSTANCE_OWNER_NAME,
              MAPLIBRE_STYLE: process.env.MAPLIBRE_STYLE,
              MUIX_LICENSE_KEY: process.env.MUIX_LICENSE_KEY,
              TILESERVER: process.env.TILESERVER,
              ZETKIN_APP_DOMAIN: process.env.ZETKIN_APP_DOMAIN,
              ZETKIN_GEN2_ORGANIZE_URL: process.env.ZETKIN_GEN2_ORGANZE_URL,
              ZETKIN_PRIVACY_POLICY_LINK:
                process.env.ZETKIN_PRIVACY_POLICY_LINK,
            }}
            headers={{}}
            lang={lang}
            messages={messages}
            user={null}
          >
            {children}
          </ClientContext>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
