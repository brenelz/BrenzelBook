import { Provider } from "urql";

import PageLayout from "../components/PageLayout";
import client from "../utils/graphql-client";
import { UserProvider, useFetchUser } from "../utils/user";

function MyApp({ Component, pageProps }) {
  const { user, loading } = useFetchUser();

  if (user) {
    client.fetchOptions = () => {
      return user && user.idToken
        ? {
            headers: { Authorization: `Bearer ${user.idToken}` },
          }
        : {};
    };
  }

  return (
    <UserProvider value={{ user, loading }}>
      <Provider value={client}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>{" "}
    </UserProvider>
  );
}

export default MyApp;
