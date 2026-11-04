const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  if (!token) {
    throw new Error('Google token khong duoc de trong');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;

  // Truong hop 1: Token la ID Token JWT (3 phan tach boi dau cham)
  if (token.split('.').length === 3) {
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID chua duoc thiet lap trong bien moi truong');
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
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
  }

  // Truong hop 2: Token la OAuth2 access_token
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Khong the xac thuc access token voi may chu Google');
  }

  const payload = await response.json();
  if (!payload || !payload.email) {
    throw new Error('Thong tin nguoi dung tu Google khong hop le');
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
