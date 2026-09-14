function getJwtSecretOrThrow() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  return process.env.JWT_SECRET;
}

module.exports = {
  getJwtSecretOrThrow,
};

