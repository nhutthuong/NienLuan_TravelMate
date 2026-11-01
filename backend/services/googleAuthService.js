const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  if (!idToken) {
    throw new Error('Google ID Token khong duoc de trong');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID chua duoc thiet lap trong bien moi truong');
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Xac minh token Google khong hop le');
  }

  if (!payload.email_verified) {
    throw new Error('Email Google chua duoc xac minh boi he thong Google');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null,
  };
};

module.exports = {
  verifyGoogleToken,
};

