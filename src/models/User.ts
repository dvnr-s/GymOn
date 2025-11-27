import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'instructor';
  profile: {
    name: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    location?: string;
    bio?: string;
    avatarUrl?: string;
    bloodType?: string;
    emergencyContact?: string;
    allergies?: string[];
    medicalConditions?: string[];
    medications?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'instructor'],
      default: 'user',
    },
    profile: {
      name: { type: String, default: '' },
      phone: { type: String },
      dateOfBirth: { type: String },
      gender: { type: String },
      location: { type: String },
      bio: { type: String },
      avatarUrl: { type: String },
      bloodType: { type: String },
      emergencyContact: { type: String },
      allergies: [{ type: String }],
      medicalConditions: [{ type: String }],
      medications: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in development
const User: UserModel =
  mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
