'use server'

import { currentUser } from "@clerk/nextjs/server"

const createPostAction = async (userPostData:FormData) => {
  const loginUser=currentUser();
  if(!loginUser){
    throw new Error('User not authenticated');
  }

  const postText=userPostData.get('postInput') as string;
  const postImage=userPostData.get('postImage') as File;
  let imageUrl:string |undefined;

  if(!postText){
    throw new Error('Post comment is not available');
  }

  
}

export default createPostAction