import { User } from '@src/models/user';

describe('Users functional test', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe('when creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUSer = {
        name: 'john doe',
        email: 'john@mail.com',
        password: '1234',
      };

      const response = await global.testRequest.post('/users').send(newUSer);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUSer));
    });
  });
});
