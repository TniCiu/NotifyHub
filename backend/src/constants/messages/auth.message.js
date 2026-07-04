const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  FULL_NAME_REQUIRED: "Full name is required",
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID: "Email is invalid",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
  USER_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCESS_TOKEN_MISSING: "Missing access token",
  JWT_SECRET_MISSING: "JWT secret is not configured",
  TOKEN_INVALID: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
};

module.exports = AUTH_MESSAGES;
