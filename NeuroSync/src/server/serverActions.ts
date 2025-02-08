import connectDB from "../db/connectDB";
import User from "../models/user";

interface CreateUserResponse {
    status: number;
    message: string;
  }
  
  export const createUser = async (
    fullName: {
      firstName: string;
      lastName: string;
    },
    username: string,
    email: string,
    password: string
  ): Promise<CreateUserResponse> => {
    try {
      await connectDB();
  
      const userByEmail = await User.findOne({ email: email });
      console.log(userByEmail);
      if (userByEmail) {
        return {
          status: 400,
          message: "Account already exists with same email 😥",
        };
      }
  
      const userByUsername = await User.findOne({ username: username });
  
      if (userByUsername) {
        return {
          status: 400,
          message: "Account already exists with same username 😥",
        };
      }
  
      const newUser = new User({
        fullName: fullName,
        username: username,
        email: email,
        password: password,
      });
      await newUser.save();
      return { status: 200, message: "Account Created Successfully 🥳" };
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  };