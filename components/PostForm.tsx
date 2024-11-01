'use client'
import { useUser } from '@clerk/nextjs';
import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Divide, ImageIcon, XIcon } from 'lucide-react';
import createPostAction from '@/actions/createPostAction';

const PostForm = () => {
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ref = useRef<HTMLFormElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        file && setPreview(URL.createObjectURL(file))

    }

    const handlePostAction= async (postData: FormData)=> {
        const userPostData=postData;
        ref.current?.reset();

        const postText=userPostData.get('postInput') as string;
        if(!postText?.trim()){
            throw new Error("Please provide a post input");
        }
        setPreview(null);
        try {
           await createPostAction(userPostData); 
        } catch (error) {
            console.log('Error creating in post:', error);
        }
    }

    return (
        <div className='mb-2'>
            <form ref={ref} action={(formData) => {
                handlePostAction(formData);
            }} className='p-3 bg-white rounded-lg border'>
                <div className='flex items-center space-x-2'>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <input
                        className='flex-1 outline-none rounded-full py-3 px-4 border'
                        type='text'
                        name='postInput'
                        placeholder='Hi!! Write a post'
                    />
                    <input
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        type='file'
                        name='postImage'
                        accept='images/*'
                        hidden
                    />
                    <button type='submit' hidden>
                        Post
                    </button>
                </div>
                {
                    preview &&
                    (<div className='mt-3'>
                        <img src={preview} alt='preview' className='w-full object-cover' />

                    </div>)
                }

                <div className='flex mt-2 justify-end space-x-2'>
                    <Button type='button' onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className='mr-2' size={16} color='currentColor' />
                        {preview ? 'Change' : 'Add'} Image
                    </Button>

                    {preview && (
                        <Button variant='outline' type='button' onClick={() => setPreview(null)}>
                            <XIcon className='mr-2' size={16} color='currentColor' />
                            Remove Image
                        </Button>
                    )}
                </div>
            </form>

            <hr className='mt-2 border-gray-300' />
        </div>
    )
}

export default PostForm


