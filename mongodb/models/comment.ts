import { IUser } from "@/types/user";
import mongoose, { models, Schema } from "mongoose";

export interface ICommentBase{
    user:IUser,
    text:string
    
}
export interface IComment extends Document, ICommentBase{
    _id: any;
    createdAt:Date,
    updatedAt:Date
    
}

const CommentSchema=new Schema<IComment>({
    user:{
       userId:{type:String, required:true},
       userFirstName:{type:String, required:true},
       userLastName:{type:String},
       userImage:{type:String, required:true},
    },
    text:{tyep:String,required:true}
},
{timestamps:true}
)

export const Comment= models.Comment || mongoose.model<IComment>("Comment",CommentSchema);