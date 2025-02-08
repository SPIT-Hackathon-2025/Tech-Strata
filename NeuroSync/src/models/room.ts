import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IRoom extends Document {
  username: mongoose.Types.ObjectId;
  roomID: string;
  roomPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    username: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    roomID: {
      type: String,
      required: true,
      unique: true,
    },
    roomPassword: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

roomSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.roomPassword = await bcrypt.hash(this.roomPassword, salt);
  }
  next();
});

export default mongoose.models.Room || model<IRoom>("Room", roomSchema);
