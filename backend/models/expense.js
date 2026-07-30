const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema(
    {
        house:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"House",
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        amount:{
            type:Number,
            required:true,
        },
        paidBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        participants:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        shares: [                 
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                amount: {
                    type: Number,
                },
            },
        ],
        splitType: {              
            type: String,
            enum: ["equal", "custom"],
            default: "equal",
        },
        
    },{timestamps:true}
)

module.exports = mongoose.model("Expense",ExpenseSchema);