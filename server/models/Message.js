import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    file: { type: String }, // ✅ make sure this line is here
  },
  { timestamps: true }
);


const Message = mongoose.model("Message", MessageSchema);
export default Message;
