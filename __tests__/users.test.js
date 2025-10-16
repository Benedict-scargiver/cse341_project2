jest.mock('../database', () => ({
  getDatabase: jest.fn(),
}));
const db = require('../database');
const users = require('../controllers/users');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

beforeEach(() => jest.clearAllMocks());

test('getSingle returns 404 when not found', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { findOne: jest.fn().mockResolvedValue(null) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await users.getSingle(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
});

test('createUser returns 400 when missing required fields', async () => {
  const req = { body: { firstName: 'A' } };
  const res = makeRes();
  await users.createUser(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('createUser returns 400 when email exists', async () => {
  const collectionMock = { findOne: jest.fn().mockResolvedValue({ email: 'a@b.com' }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { body: { firstName: 'A', lastName: 'B', email: 'a@b.com' } };
  const res = makeRes();
  await users.createUser(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('deleteUser returns 200 when deleted', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await users.deleteUser(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
});
