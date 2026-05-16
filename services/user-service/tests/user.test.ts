import { createUser, getUsers } from "../src/controllers/user.controller";
import { User } from "../src/models/user.model";
import { Request, Response } from "express";

jest.mock("../src/models/user.model");

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides: Partial<Request> = {}) => ({ body: {}, ...overrides }) as Request;

describe("Get users", () => {
  it("Return with 200 status code", async () => {
    const fakeUsers = [
      {
        _id: "1",
        name: "arijit mondal",
        email: "arijit@gmail.com",
        createdAt: "2026-05-14T07:59:10.222Z",
        updatedAt: "2026-05-14T07:59:10.222Z",
      },
      {
        _id: "2",
        name: "pritam mondal",
        email: "pritam@gmail.com",
        createdAt: "2026-05-14T07:59:10.222Z",
        updatedAt: "2026-05-14T07:59:10.222Z",
      },
    ];

    (User.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(fakeUsers),
    });

    const req = mockReq();
    const res = mockRes();

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeUsers);
  });

  it("DB error return with 500", async () => {
    (User.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const req = mockReq();
    const res = mockRes();

    await getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});

describe("Create user", () => {
  it("Name is missing in the body return with 400", async () => {
    const req = mockReq({ body: { email: "test@gmail.com" } });
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Name and email are required" });
  });

  it("Email is missing in the body return with 400", async () => {
    const req = mockReq({ body: { name: "test" } });
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Name and email are required" });
  });

  it("DB error faild with 500", async () => {
    (User.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    const req = mockReq({ body: { name: "test", email: "test@gmail.com" } });
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it("Create user successfully return with 201", async () => {
    const fakeUser = {
      _id: "1",
      name: "test",
      email: "test@gmail.com",
      createdAt: "2026-05-14T07:59:10.222Z",
      updatedAt: "2026-05-14T07:59:10.222Z",
    };

    (User.create as jest.Mock).mockReturnValue({
      toObject: jest.fn().mockReturnValue(fakeUser),
    });

    const req = mockReq({ body: { name: "test", email: "test@gmail.com" } });
    const res = mockRes();

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
  });
});
