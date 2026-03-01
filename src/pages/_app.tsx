import '../styles.css';

import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { NoSsr } from '@mui/base';
import NProgress from 'nprogress';
import Router from 'next/router';
import { useEffect, useRef, useState } from 'react';

import createStore, { Store } from 'core/store';
import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment from 'core/env/Environment';
import { MessageList } from 'utils/locale';
import { PageWithLayout } from '../utils/types';
import Providers from 'core/Providers';

// Progress bar
NProgress.configure({ showSpinner: false });
Router.events.on(
  'routeChangeStart',
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  'routeChangeComplete',
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  'routeChangeError',
  (url, { shallow }) => !shallow && NProgress.done()
);

declare global {
  interface Window {
    __reactRendered: boolean;
  }
}

// Module-level cache: translations are fetched once per language per session
const messageCache: Record<string, MessageList> = {};

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { envVars, lang, ...restProps } = pageProps;
  const c = Component as PageWithLayout;
  const getLayout = c.getLayout || ((page) => page);

  const storeRef = useRef<Store | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  if (typeof window !== 'undefined') {
    window.__reactRendered = true;
  }

  const env = new Environment(new BrowserApiClient(), envVars || {});

  // MUI-X license
  if (env.vars.MUIX_LICENSE_KEY) {
    LicenseInfo.setLicenseKey(env.vars.MUIX_LICENSE_KEY);
  }

  const effectiveLang = lang || 'en';
  const [messages, setMessages] = useState<MessageList>(
    messageCache[effectiveLang] || {}
  );

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    if (messageCache[effectiveLang]) {
      setMessages(messageCache[effectiveLang]);
      return;
    }

    fetch(`/locale/${effectiveLang}.json`)
      .then((res) => res.json())
      .then((data: MessageList) => {
        messageCache[effectiveLang] = data;
        setMessages(data);
      });
  }, [effectiveLang]);

  return (
    <Providers
      env={env}
      lang={effectiveLang}
      messages={messages}
      store={storeRef.current}
      user={pageProps.user}
    >
      <CssBaseline />
      <NoSsr>{getLayout(<Component {...restProps} />, restProps)}</NoSsr>
    </Providers>
  );
}

export default MyApp;
