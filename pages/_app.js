import { createClient, Provider } from "urql";
const client = createClient({
  url: "https://brenzelbook.herokuapp.com/v1/graphql",
  fetchOptions: () => {
    return token
      ? {
        headers: { Authorization: `Bearer ${token}` },
      }
      : {};
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
