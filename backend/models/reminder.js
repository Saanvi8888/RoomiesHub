const mongoose = require("mongoose")

const reminderSchema = new mongoose.Schema(
    {
        house:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"House",
            required:true,
            index:true,
        },
        title:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            default:"",
        },
        dueDate:{
            type:Date,
            required:true,
            index:true,
        },
        assignedTo:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
            
        ],
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        isCompleted:{
            type:Boolean,
            default:false,
        },

        lastNotified:{
            type:Date,
            default:null,
        },

    },{timestamps:true}
    
);

module.exports = mongoose.model("Reminder",reminderSchema);