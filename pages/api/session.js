import auth0 from "../../utils/auth0";

export default async function session(req, res) {
  try {
    const { idToken } = await auth0.getSession(req);

    res.status(200).json({ idToken });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
}
