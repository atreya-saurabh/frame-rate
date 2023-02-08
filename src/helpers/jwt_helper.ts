import jwt from "jsonwebtoken";
import createError from "http-errors";

export const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_SECRET_TOKEN;
    const options = {
      expiresIn: "20s",
      issuer: "frame-rate.com",
      audience: userId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, payload) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  });
};

export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_SECRET_TOKEN;
    const options = {
      expiresIn: "1y",
      issuer: "frame-rate.com",
      audience: userId,
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        return reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_TOKEN,
      (err, payload) => {
        if (err) {
          return reject(createError.Unauthorized());
        }
        const userId = payload.aud;
        resolve(userId);
      }
    );
  });
};