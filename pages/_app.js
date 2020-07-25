import { Provider } from "urql";

import PageLayout from "../layouts/PageLayout";
import hasuraClient from "../utils/hasuraRequest";
import { UserProvider, useFetchUser } from "../utils/user";

import "../styles/tailwind.css";

function MyApp({ Component, pageProps }) {
  const { user, loading } = useFetchUser();

  if (user) {
    hasuraClient.fetchOptions = () => {
      return user && user.idToken
        ? {
            headers: { Authorization: `Bearer ${user.idToken}` },
          }
        : {};
    };
  }

  return (
    <UserProvider value={{ user, loading }}>
      <Provider value={hasuraClient}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>{" "}
    </UserProvider>
  );
}

export default MyApp;
