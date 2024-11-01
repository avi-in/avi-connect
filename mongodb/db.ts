import mongoose from "mongoose";

const connectionString=''
if(!connectionString){
    throw new Error('Provide a valid connection string');
}

const connection2DB=async()=>{
    if(mongoose?.connection?.readyState>=1){
        return;
    }
    try {
        await mongoose.connect(connectionString);
    } catch (error) {
        console.log('Error while connecting with mongodb: ',error);
    }
}