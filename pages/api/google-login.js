export default function handler(req, res) {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    if (!GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google client ID not found' });
    }

    const redirectUri = `http://${process.env.SERVER_HOST}.nip.io:${process.env.SERVER_PORT}/connection/exuberance/google/callback`;
    const scopes = encodeURIComponent("https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email");

    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=${scopes}&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirectUri}&client_id=${GOOGLE_CLIENT_ID}&prompt=select_account`;

    res.status(200).json({ url: googleLoginUrl });
}