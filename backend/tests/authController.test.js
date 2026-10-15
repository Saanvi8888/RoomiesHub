// const verifyIdToken = jest.fn();

jest.mock("../models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

// jest.mock("google-auth-library", () => ({
//     OAuth2Client: jest.fn(() => ({
//         verifyIdToken
//     }))
// }));

const {signup,login,googleLogin} = require("../controllers/authController");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

describe("signup", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should signup a new user successfully", async () => {

        const req = {
            body: {
                name: "Saanvi",
                email: "SAANVI@GMAIL.COM",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(null);

        bcrypt.hash.mockResolvedValue("hashedPassword");

        User.create.mockResolvedValue({
            _id: "123",
            name: "Saanvi",
            email: "saanvi@gmail.com"
        });

        jwt.sign.mockReturnValue("fake-token");

        await signup(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: "saanvi@gmail.com"
        });

        expect(bcrypt.hash).toHaveBeenCalledWith(
            "123456",
            10
        );

        expect(User.create).toHaveBeenCalledWith({
            name: "Saanvi",
            email: "saanvi@gmail.com",
            password: "hashedPassword"
        });

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            token: "fake-token",
            user: {
                id: "123",
                name: "Saanvi",
                email: "saanvi@gmail.com"
            }
        });
    });

        test("should return 400 if user already exists", async () => {

        const req = {
            body: {
                name: "Saanvi",
                email: "saanvi@gmail.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({
            _id: "123",
            email: "saanvi@gmail.com"
        });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: "User already exists."
        });

        expect(bcrypt.hash).not.toHaveBeenCalled();

        expect(User.create).not.toHaveBeenCalled();
    });

        test("should return 500 if signup fails", async () => {

        const req = {
            body: {
                name: "Saanvi",
                email: "saanvi@gmail.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockRejectedValue(
            new Error("Database error")
        );

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Database error"
        });
    });

});

describe("login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test("should login successfully", async () => {

        const req = {
            body: {
                email: "SAANVI@GMAIL.COM",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({
            _id: "123",
            name: "Saanvi",
            email: "saanvi@gmail.com",
            password: "hashedPassword"
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue("fake-token");

        await login(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            email: "saanvi@gmail.com"
        });

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "123456",
            "hashedPassword"
        );

        expect(res.json).toHaveBeenCalledWith({
            token: "fake-token",
            user: {
                id: "123",
                name: "Saanvi",
                email: "saanvi@gmail.com"
            }
        });
    });


    test("should return 400 if user does not exist", async () => {

        const req = {
            body: {
                email: "saanvi@gmail.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid Credentials."
        });

        expect(bcrypt.compare).not.toHaveBeenCalled();
    });


    test("should return 400 if password is incorrect", async () => {

        const req = {
            body: {
                email: "saanvi@gmail.com",
                password: "wrongpassword"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockResolvedValue({
            _id: "123",
            name: "Saanvi",
            email: "saanvi@gmail.com",
            password: "hashedPassword"
        });

        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "wrongpassword",
            "hashedPassword"
        );

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: "Invalid Credentials."
        });

        expect(jwt.sign).not.toHaveBeenCalled();
    });


    test("should return 500 if login fails", async () => {

        const req = {
            body: {
                email: "saanvi@gmail.com",
                password: "123456"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        User.findOne.mockRejectedValue(
            new Error("Database error")
        );

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Database error"
        });
    });

});