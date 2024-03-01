import { useRouter } from 'next/router.js';
import { useCallback, useEffect, useRef } from 'react';

type CurrentVersion = {
  buildId: string;
  buildTime: string;
};

type CreateUseVersionCheckerArgs = {
  checkInterval: number;
  currentVersion: CurrentVersion;
};

/**
 * Checks for a new version of the frontend on every route change and forces a
 * reload if a new version is available.
 */
export const createUseVersionChecker = (args: CreateUseVersionCheckerArgs) => {
  return () => {
    const router = useRouter();
    const isChecking = useRef(false);
    const lastCheck = useRef(0);

    const checkIfShouldReload = useCallback(async () => {
      if (isChecking.current) {
        return false;
      }

      // Only check once every minute (this will get fired multiple times on
      // initial load).
      const now = Date.now();
      const secondsSinceLastCheck = (now - lastCheck.current) / 1000;
      if (secondsSinceLastCheck < args.checkInterval) {
        return false;
      }

      isChecking.current = true;
      // eslint-disable-next-line no-console
      console.debug('checking version...');
      return fetch('/version.json', { cache: 'no-cache' })
        .then((res) => {
          if (!res.ok) {
            throw new Error(
              `unexpected response from version check: ${res.status}`
            );
          }
          return res.json();
        })
        .then((latestVersion) => {
          const currentBuildId = args.currentVersion.buildId;
          if (currentBuildId !== latestVersion.buildId) {
            // eslint-disable-next-line no-console
            console.debug(
              `new frontend version available: ${currentBuildId} -> ${latestVersion.buildId}`
            );

            // NOTE: we also store the last reload time in localStorage so that if the
            // something goes wrong, we don't get stuck in an infinite reload loop.
            const lastReload = parseInt(
              localStorage.getItem('lastVersionReload') ?? '0',
              10
            );
            const secondsSinceLastReload = (now - lastReload) / 1000;
            if (secondsSinceLastReload < 60) {
              // This is expected in local development, but if it happens in
              // production, something is wrong.
              if (process.env.NODE_ENV === 'production') {
                // eslint-disable-next-line no-console
                console.error(
                  `WARNING: last reload was ${secondsSinceLastReload}s ago, not reloading - something might be wrong with the version check!`
                );
              } else {
                // eslint-disable-next-line no-console
                console.debug(
                  `not reloading because last reload was ${secondsSinceLastReload}s ago`
                );
              }
              return false;
            }

            localStorage.setItem('lastVersionReload', now.toString());
            return true;
          }
          // eslint-disable-next-line no-console
          console.debug(`frontend version is up to date: ${currentBuildId}`);
          return false;
        })
        .catch((err) => {
          if (process.env.NODE_ENV === 'production') {
            // eslint-disable-next-line no-console
            console.error('error checking version', err);
          } else {
            // eslint-disable-next-line no-console
            console.debug('error checking version', err);
          }
          return false;
        })
        .finally(() => {
          isChecking.current = false;
          lastCheck.current = now;
        });
    }, []);

    // We also check on mount because this happens sooner than routeChangeStart
    // on initial load (i.e. resuming old tab or reopening browser).
    useEffect(() => {
      checkIfShouldReload().then((isUpdateAvailable) => {
        if (isUpdateAvailable) {
          // eslint-disable-next-line no-console
          console.debug('reloading page to update frontend');
          window.location.reload();
        }
      });
    }, [checkIfShouldReload]);

    useEffect(() => {
      const handleRouteChange = (url: string) => {
        checkIfShouldReload().then((isUpdateAvailable) => {
          if (isUpdateAvailable) {
            // eslint-disable-next-line no-console
            console.debug('forcing reload to update frontend');
            if (window.location.href !== url) {
              window.location.href = url;
            } else {
              window.location.reload();
            }
          }
        });
      };
      router.events.on('routeChangeStart', handleRouteChange);

      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
    }, [router, checkIfShouldReload]);
  };
};
