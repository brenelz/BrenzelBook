import Head from "next/head";

import Nav from "./Nav";
import { SITE_CONFIG } from "../config";

const PageLayout = ({ children }) => {
  return (
    <>
      <Head>
        <title>{SITE_CONFIG.title}</title>
        <meta name="description" content={SITE_CONFIG.description} />
      </Head>
      <Nav />
      {children}
    </>
  );
};

export default PageLayout;
