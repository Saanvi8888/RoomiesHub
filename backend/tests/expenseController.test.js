const { addExpense, getExpenses } = require("../controllers/expenseController");

const Expense = require("../models/expense");
const House = require("../models/house");

const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification");

jest.mock("../models/expense");
jest.mock("../models/house");
jest.mock("../utils/logActivity");
jest.mock("../utils/createNotification");

describe("addExpense", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should successfully add an expense", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123",
                name: "Saanvi"
            },
            body: {
                title: "Dinner",
                amount: 100
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const house = {
            _id: "house123",
            members: ["user123", "user456", "user789"]
        };

        const expense = {
            _id: "expense123",
            house: "house123",
            title: "Dinner",
            amount: 100,
            paidBy: "user123",
            participants: house.members,
            shares: [
                {
                    user: "user123",
                    amount: 33.33
                },
                {
                    user: "user456",
                    amount: 33.33
                },
                {
                    user: "user789",
                    amount: 33.34
                }
            ],

            populate: jest.fn()
        };
        House.findOne.mockResolvedValue(house);
        Expense.create.mockResolvedValue(expense);
        expense.populate.mockResolvedValue(expense);
        logActivity.mockResolvedValue();
        createNotification.mockResolvedValue();
        await addExpense(req, res);

        expect(House.findOne).toHaveBeenCalledWith({
            _id: "house123",
            members: "user123"
        });

        expect(Expense.create).toHaveBeenCalledWith({
            house: "house123",
            title: "Dinner",
            amount: 100,
            paidBy: "user123",
            participants: ["user123", "user456", "user789"],
            shares: [
                {
                    user: "user123",
                    amount: 33.33
                },
                {
                    user: "user456",
                    amount: 33.33
                },
                {
                    user: "user789",
                    amount: 33.34
                }
            ],
            splitType: "equal"
        });

        expect(logActivity).toHaveBeenCalled();
        expect(createNotification).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expense);
    }),
    test("should return 400 if title or amount is missing", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123",
                name: "Saanvi"
            },
            body: {
                title: "",
                amount: 100
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await addExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "All fields are required."
        });
        expect(House.findOne).not.toHaveBeenCalled();
        expect(Expense.create).not.toHaveBeenCalled();
    }),
    test("should return 400 if amount is less than or equal to zero", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123",
                name: "Saanvi"
            },
            body: {
                title: "Dinner",
                amount: 0
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await addExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "All fields are required."
        });
    }),

    test("should return 403 if user is not a member of the house", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123",
                name: "Saanvi"
            },
            body: {
                title: "Dinner",
                amount: 100
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        House.findOne.mockResolvedValue(null);
        await addExpense(req, res);
        expect(House.findOne).toHaveBeenCalledWith({
            _id: "house123",
            members: "user123"
        });
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Access denied"
        });
        expect(Expense.create).not.toHaveBeenCalled();
    }),

    test("should return 500 if database error occurs", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123",
                name: "Saanvi"
            },
            body: {
                title: "Dinner",
                amount: 100
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        House.findOne.mockRejectedValue(
            new Error("Database error")
        );
        await addExpense(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Database error"
        });
    });
});

describe("getExpenses",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    test("should successfully fetch expenses",async()=>{
        const req = {
            params:{
                houseId:"1434",
            },
            user:{
                _id:"user123",
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),

        };
        const expenses = [
            {
                _id: "expense1",
                title: "Dinner",
                amount: 100
            },
            {
                _id: "expense2",
                title: "Groceries",
                amount: 500
            }
        ];
        House.findOne.mockResolvedValue({
            _id:"1434",
            members:"user123"
        })

        const mockquery = {
            populate: jest.fn(),
            sort: jest.fn(),
        }

        mockquery.populate.mockReturnThis(mockquery);
        mockquery.sort.mockResolvedValue(expenses);

        Expense.find.mockReturnValue(mockquery);

        await getExpenses(req,res);

        expect(House.findOne).toHaveBeenCalledWith({
            _id:"1434",
            members: "user123"
        })

        expect(Expense.find).toHaveBeenCalledWith({
            house: "1434"
        });
        expect(mockquery.populate).toHaveBeenNthCalledWith(
            1,
            "paidBy",
            "name"
        );

        expect(mockquery.populate).toHaveBeenNthCalledWith(
            2,
            "participants",
            "name"
        );

        expect(mockquery.populate).toHaveBeenNthCalledWith(
            3,
            "shares.user",
            "name"
        );

        expect(mockquery.sort).toHaveBeenCalledWith({
            createdAt: -1
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith(expenses);
    }),
    test("should return 403 if user is not a member of the house", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        House.findOne.mockResolvedValue(null);
        await getExpenses(req, res);
        expect(House.findOne).toHaveBeenCalledWith({
            _id: "house123",
            members: "user123"
        });
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            message: "Not authorized"
        });
        expect(Expense.find).not.toHaveBeenCalled();
    }),
    test("should return 500 if database error occurs", async () => {

        const req = {
            params: {
                houseId: "house123"
            },
            user: {
                _id: "user123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        House.findOne.mockRejectedValue(
            new Error("Database error")
        );
        await getExpenses(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Database error"
        });
    });
})