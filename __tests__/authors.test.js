jest.mock('../database', () => ({
  getDatabase: jest.fn(),
}));
const db = require('../database');
const authors = require('../controllers/authors');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

test('getAll returns authors', async () => {
  const collectionMock = { find: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([{ name: 'A' }]) })) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const res = makeRes();
  await authors.getAll({}, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ name: 'A' }]);
});

test('createAuthor returns 400 when missing fields', async () => {
  const req = { body: { name: 'X' } };
  const res = makeRes();
  await authors.createAuthor(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('updateAuthor returns 404 when not modified', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 0 }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id }, body: { name: 'A', bio: 'B' } };
  const res = makeRes();
  await authors.updateAuthor(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});
