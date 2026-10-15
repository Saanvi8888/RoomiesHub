const {getActivities} = require("../controllers/activityController")
const Activity = require("../models/activity")
const House = require("../models/house")
jest.mock("../models/activity")
jest.mock("../models/house")

describe("getActivities",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });
    test("should return all activities successfully",async()=>{
        const req={
            params:{
                houseId:"1434"
            },
            user:{
                _id:"user123"
            }
        };

        const res= {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

         const activities = [
            {
                _id: "activity1",
                house: "1434",
                user: {
                    name: "Saanvi"
                }
            },
            {
                _id: "activity2",
                house: "1434",
                user: {
                    name: "Rahul"
                }
            }
        ];

        House.findOne.mockResolvedValue({
            _id: "1434",
            members: ["user123"],

        })
        Activity.find.mockReturnValue({
            populate:jest.fn().mockReturnThis(),
            sort:jest.fn().mockReturnThis(),
            limit:jest.fn().mockResolvedValue(activities),
        })

        await getActivities(req,res);
        // console.log(res.json.mock.calls);
        expect(House.findOne).toHaveBeenCalledWith({
            _id:"1434",
            members: "user123",
        })

        expect(Activity.find).toHaveBeenCalledWith({
            house: "1434",
        })

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(activities);

    }),

    test("should return 403 if user is not a member of the house",async()=>{
        const req={
            params:{
                houseId: "1434",
            }, 
            user:{
                _id: "user123",
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json : jest.fn()
        }

        House.findOne.mockResolvedValue(null);

        await getActivities(req,res);

        expect(House.findOne).toHaveBeenCalledWith({
            _id: "1434",
            members: "user123"
        })

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.json).toHaveBeenCalledWith({
            message: "Access denied"
        })

        expect(Activity.find).not.toHaveBeenCalled();
    }),
    test("should return 500 if database error occurs", async () => {

    
        const req = {
            params: {
                houseId: "1434"
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

        // Act
        await getActivities(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Database error"
        });
    }),
    test("should populate user, sort by createdAt and limit activities", async () => {

    // Arrange
        const req = {
            params: {
                houseId: "1434"
            },
            user: {
                _id: "user123"
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const activities = [
            {
                _id: "activity1",
                house: "1434",
                user: {
                    name: "Saanvi"
                }
            }
        ];

        House.findOne.mockResolvedValue({
            _id: "1434",
            members: ["user123"]
        });

        const mockQuery = {
            populate: jest.fn(),
            sort: jest.fn(),
            limit: jest.fn()
        };

        mockQuery.populate.mockReturnValue(mockQuery);
        mockQuery.sort.mockReturnValue(mockQuery);
        mockQuery.limit.mockResolvedValue(activities);

        Activity.find.mockReturnValue(mockQuery);

        await getActivities(req, res);

        expect(mockQuery.populate).toHaveBeenCalledWith(
            "user",
            "name"
        );

        expect(mockQuery.sort).toHaveBeenCalledWith({
            createdAt: -1
        });
        expect(mockQuery.limit).toHaveBeenCalledWith(50);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(activities);
    });
})