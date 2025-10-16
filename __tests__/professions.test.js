jest.mock('../database', () => ({
  getDatabase: jest.fn(),
}));

const db = require('../database');
const ObjectId = require('mongodb').ObjectId;
const professions = require('../controllers/professions');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('getAll returns professions', async () => {
  const collectionMock = {
    find: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([{ name: 'Dev' }]) })),
  };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const res = makeRes();
  await professions.getAll({}, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ name: 'Dev' }]);
});

test('getSingle returns profession when found', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { findOne: jest.fn().mockResolvedValue({ _id: id, name: 'Dev' }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await professions.getSingle(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ _id: id, name: 'Dev' });
});

test('getSingle returns 404 when not found', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { findOne: jest.fn().mockResolvedValue(null) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await professions.getSingle(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
});

test('createProfession returns 400 when missing fields', async () => {
  const req = { body: { name: 'Tester' } };
  const res = makeRes();
  await professions.createProfession(req, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('createProfession returns 201 on success', async () => {
  const collectionMock = { insertOne: jest.fn().mockResolvedValue({ insertedId: 'abcd' }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { body: { name: 'Tester', description: 'desc' } };
  const res = makeRes();
  await professions.createProfession(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'Profession created', id: 'abcd' });
});

test('updateProfession returns 404 when nothing modified', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 0 }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id }, body: { name: 'A', description: 'B' } };
  const res = makeRes();
  await professions.updateProfession(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

test('deleteProfession returns 200 on success', async () => {
  const id = '507f1f77bcf86cd799439011';
  const collectionMock = { deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }) };
  db.getDatabase.mockReturnValue({ db: () => ({ collection: () => collectionMock }) });

  const req = { params: { id } };
  const res = makeRes();
  await professions.deleteProfession(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Profession deleted' });
});
