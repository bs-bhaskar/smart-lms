function getEnvConfig() {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 5000),
    CLIENT_URL: process.env.CLIENT_URL,

    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,

    ENABLE_DEBUG_ENDPOINTS: process.env.ENABLE_DEBUG_ENDPOINTS === 'true',

    // 🔥 ADD THIS LINE
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  };
}

function validateEnv(config) {
  const missing = [];
  if (!config.MONGO_URI) missing.push('MONGO_URI');
  if (!config.JWT_SECRET) missing.push('JWT_SECRET');
  if (config.NODE_ENV === 'production' && !config.CLIENT_URL) missing.push('CLIENT_URL');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  getEnvConfig,
  validateEnv,
};
