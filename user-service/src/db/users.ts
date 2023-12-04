import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  phone: { type: String, required: true },
  bio: { type: String, required: false },
  instagram: { type: String, required: false },
  twitter: { type: String, required: false },
})

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = async () => await UserModel.find();
export const getUserByPhone = async (phone: String) => await UserModel.findOne({ phone })
export const getUserById = async (id: String) => await UserModel.findById({ id });
export const createUser = async (values: Record<string, any>) => await new UserModel(values).save().then((user) => user.toObject); 
export const deleteUserById = async (id: String) => await UserModel.findByIdAndDelete({ _id: id });
export const updateUserById = async (id: string, values: Record<string, any>) => await UserModel.findByIdAndUpdate(id, values);