jest.mock('../database', () => ({
  getDatabase: jest.fn(),
}));
const db = require('../database');
const books = require('../controllers/books');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

test('getAll returns books', async () => {
  const collectionMock = { find: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([{ title: 'B' }]) })) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const res = makeRes();
  await books.getAll({}, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ title: 'B' }]);
});

test('createBook returns 400 when missing fields', async () => {
  const req = { body: { title: 'T' } };
  const res = makeRes();
  await books.createBook(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('deleteBook returns 404 when not deleted', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { deleteOne: jest.fn().mockResolvedValue({ deletedCount: 0 }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await books.deleteBook(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});
