import { Schema, models, model } from 'mongoose';

interface IUser extends Document {
  clerkId: string;
  username: string;
  email: string;
  photo: string;
  firstName: string;
  lastName: string;
  planId: string;
  creditBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  planId: { type: String, required: false },
  creditBalance: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;
