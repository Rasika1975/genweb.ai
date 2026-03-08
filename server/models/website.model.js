
import mongoose from "mongoose"

const messageSchema=new mongoose.Schema({
    role:{
        type:String,
        enum:["ai","user"],
        required:true
    },
    content:{
        type:String,
        required:true
        
    }

},{timestamps:true})

const websiteSchema = new mongoose.Schema({ 
    user:
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    
    },
    title:{
        type:String,
        default:'Untitled'
    },
    latestCode:{
        type:String,
        required:true
    
    },
    conversation:[
        messageSchema
    ],
    depolyed:{
        type:Boolean,
        default:false
    
    },
    depolyUrl:{
        type:String,
    },
    slug:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        default:() => `site-${new mongoose.Types.ObjectId().toString()}`
    }

}, {timestamps:true})

const website = mongoose.model('Website',websiteSchema);

export default website;
