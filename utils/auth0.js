import { initAuth0 } from "@auth0/nextjs-auth0";

export default initAuth0({
  domain: "dev-f1e3p6dp.us.auth0.com",
  clientId: "yvD9zhHwC8vsU5G6xVVba3OyfIo2Z0F2",
  clientSecret: "OzmxWw7-ZpxPfgZi-uQ3ik5bw3eEfzR9AXfN8k1goM0FHVEFoIX63k0CAST_T6CT",
  scope: "openid profile",
  redirectUri: "http://localhost:3000/api/callback",
  postLogoutRedirectUri: "http://localhost:3000/",
  session: {
    cookieSecret: "some-very-very-very-very-very-very-very-very-long-secret",
    cookieLifetime: 60 * 60 * 8,
    storeIdToken: true,
  },
});
