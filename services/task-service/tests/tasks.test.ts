import { createTask, getTasks } from '../src/controllers/task.controller';
import { Task } from '../src/models/task.model';
import { Request, Response } from 'express';

// Mock the Task model
jest.mock('../src/models/task.model');

// Helper function to create a mock response object
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper function to create a mock request object
const mockReq = (overrides: Partial<Request> = {}) => {
  return {
    body: {},
    ...overrides,
  } as Request;
};

describe('Get Tasks', () => {
  it('Return with 200 success response', async () => {
    const fakeTasks = [
      {
        _id: '1',
        title: 'arijit mondal',
        description: 'test description',
        userId: 'arijit@gmail.com',
        createdAt: '2026-05-14T08:49:39.908Z',
        updatedAt: '2026-05-14T08:49:39.908Z',
      },
      {
        _id: '2',
        title: 'pritam mondal',
        description: 'test description',
        userId: 'pritam@gmail.com',
        createdAt: '2026-05-14T08:49:39.908Z',
        updatedAt: '2026-05-14T08:49:39.908Z',
      },
    ];

    (Task.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeTasks),
    });

    const req = mockReq();
    const res = mockRes();

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeTasks);
  });

  it('Return 500 error DB', async () => {
    (Task.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error('DB error')),
    });

    const req = mockReq();
    const res = mockRes();

    await getTasks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('Create Task', () => {
  it('Title missing in body return with 400', async () => {
    const req = mockReq({ body: { description: 'test desc', userId: '123' } });
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title, description, and user ID are required',
    });
  });

  it('Description missing in body return with 400', async () => {
    const req = mockReq({ body: { title: 'test', userId: '123' } });
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title, description, and user ID are required',
    });
  });

  it('User Id missing in body return with 400', async () => {
    const req = mockReq({ body: { title: 'test', description: 'test desc' } });
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Title, description, and user ID are required',
    });
  });

  it('Create task with 201 status code', async () => {
    const fakeTask = { title: 'test', description: 'test desc', userId: '123' };

    (Task.create as jest.Mock).mockResolvedValue({
      toObject: jest.fn().mockReturnValue(fakeTask),
    });

    const req = mockReq({ body: fakeTask });
    const res = mockRes();

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeTask);
  });
});
