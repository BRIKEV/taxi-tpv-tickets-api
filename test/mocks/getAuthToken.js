
module.exports = async (request, store) => {
  const user = { email: 'kevin@test.com', password: 'secretpassword' };
  return store.registerUser(user)
    .then(async () => request
      .post('/api/v1/login')
      .send(user))
    .then(({ body }) => body.jwt);
};
