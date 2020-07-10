import auth0 from "../../utils/auth0";

export default async function session(req, res) {
  try {
    const session = await auth0.getSession(req);

    if (session) {
      res.status(200).json(session);
    } else {
      res.status(403).json({
        code: 403,
        error: "Unauthorized",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
}
