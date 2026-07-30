const House = require("../models/house")
const User = require("../models/user")
const generateCode = ()=>{
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

exports.createHouse = async(req,res)=>{
    try {
        const {name} = req.body
        const house = await House.create({
            name,
            createdBy:req.user._id,
            members:[req.user._id],
            inviteCode:generateCode()
        })
        res.status(201).json(house)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.joinHouse = async(req,res)=>{
    try {
        const {inviteCode} = req.body;
        const house = await House.findOne({inviteCode})
        if(!house){
            return res.status(401).json({message:"House not found."})
        }
        if (house.members.includes(req.user._id)) {
            return res.json({
                message: "Already in the house.",
                house
            });
        }
        house.members.push(req.user._id);
        await house.save();
        const user = await User.findById(req.user._id);
        user.houseId = house._id;
        await user.save();
        res.json({message:"House joined successfully.",house})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHouse = async(req,res)=>{
    try {
        const house = await House.findById(req.params.houseId).populate("members", "name email");
        if(!house){
            return res.status(404).json({ message: "House not found" });
        }
        res.json(house);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.getAllHouses = async(req,res) =>{
    try {
        const houses = await House.find({
            members:req.user._id,
        }).select("name inviteCode")
        res.json(houses)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
exports.deleteHouse = async (req, res) => {
  try {
    const house = await House.findById(req.params.houseId);

    if (!house) {
      return res.status(404).json({ message: "House not found." });
    }

    if (house.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    await house.deleteOne();

    res.json({ message: "House deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};