import mongoose from "mongoose";


// This schema defines the structure of a message in a messaging application.
const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    file: { type: String }, 
  },
  { timestamps: true }
);


const Message = mongoose.model("Message", MessageSchema);
export default Message;
