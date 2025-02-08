import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  password: string;
  roles: string[];
  rooms: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const fullNameSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
});

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    fullName: fullNameSchema,
    password: {
      type: String,
      required: true,
      select: false,
    },
    roles: {
      type: [
        {
          type: String,
          enum: ["owner", "editor", "viewer"],
        },
      ],
      default: ["viewer"],
      validate: {
        validator: (roles: string[]) => roles.length > 0,
        message: "User must have at least one role.",
      },
    },
    rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.models.User || model<IUser>("User", userSchema);
