import { IUser } from "@/types/user";
import { Comment,IComment, ICommentBase } from "./comment";
import mongoose,{ Model, Schema,models,Document } from "mongoose";


export interface IPost{
    user:IUser,
    postText:string,
    postImageUrl?:string,
    postComments?:IComment[],
    postLikes?:string[]
}

export interface IPostExtented extends Document,IPost{
    createdAt:Date,
    updatedAt:Date
}

interface IPostExtentedMethods{
    likePost(userId:string):Promise<void>;
    unLikePost(userId:string):Promise<void>;
    commentOnPost(comment:ICommentBase):Promise<void>;
    getAllComments():Promise<void>;
    removePost(userId:string):Promise<void>;
}
interface IPostStaticsMethods{
    getAllPosts():Promise<IPostDocument>;
}

export interface IPostDocument extends IPost, IPostExtentedMethods{
    [x: string]: any;
};
interface IPostModel extends IPostStaticsMethods,Model<IPostDocument>{}

const PostSchema=new Schema<IPostDocument>({
    user:{
        userId:{type:String, required:true},
        userFirstName:{type:String, required:true},
        userLastName:{type:String},
        userImage:{type:String, required:true}
     },
     postText:{tyep:String,required:true},
     postImageUrl:{type:String},
     postComments:{type:Schema.Types.ObjectId, ref:"Comment", default:[]},
     postLikes:{type:[String]}
},
{timestamps:true}
)

PostSchema.methods.likePost=async function (userId:string){
    try {
       await this.updateOne({$addToSet:{likes:userId}}); 
    } catch (error:any) {
        throw new Error('Failed to like post: ', error)
    }
}

PostSchema.methods.unLikePost=async function (userId:string){
    try {
       await this.updateOne({$pull:{likes:userId}}); 
    } catch (error:any) {
        throw new Error('Failed to unlike post: ', error)
    }
}

PostSchema.methods.removePost=async function (){
    try {
       await this.model("Post").deleteOne({_id:this._id}); 
    } catch (error:any) {
        throw new Error('Failed to remove post: ', error)
    }
}

PostSchema.methods.commentOnPostPost=async function (commentToAdd:ICommentBase){
    try {
        const comment=await Comment.create(commentToAdd);
        this.postComments.push(comment._id)
       await this.save(); 
    } catch (error:any) {
        throw new Error('Failed to comment on post: ', error)
    }
}

PostSchema.methods.getAllComments=async function (){
    try {
       await this.populate({
        path:'comments',
        options:{sort:{createdAt:-1}}
       }); 
       return this.postComments
    } catch (error:any) {
        throw new Error('Failed to get all comments: ', error)
    }
}
PostSchema.statics.getAllPosts=async function (){
    try {
        const posts=await this.find().sort({createdAt:-1})
        .populate({
            path:'comments',
            options:{sort:{createdAt:-1}}
           })
           .lean();
           return posts.map((post:IPostDocument)=>({
            ...posts,
            _id:post._id.toString(),
            comments:post.postComments?.map((comment:IComment)=>({
                ...comment,
                _id:comment._id.toString(),
            }))
           }));
    } catch (error:any) {
        throw new Error('Failed to get all posts: ', error)
    }
}

export const Post= models.Post as IPostModel || mongoose.model<IPostDocument,IPostModel>("Post",PostSchema);