import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in minutes
  notes?: string;
  completed?: boolean;
}

export interface IWorkoutSession {
  date: Date;
  completed: boolean;
  duration?: number; // in minutes
  notes?: string;
}

export interface IWorkoutPlan extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planName: string;
  description?: string;
  exercises: IExercise[];
  targetMuscleGroups?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number; // in minutes
  completedSessions: IWorkoutSession[];
  isActive: boolean;
  scheduledDays?: string[]; // e.g., ['Monday', 'Wednesday', 'Friday']
  createdAt: Date;
  updatedAt: Date;
}

type WorkoutPlanModel = Model<IWorkoutPlan>;

const exerciseSchema = new Schema<IExercise>(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true,
    },
    sets: {
      type: Number,
      required: [true, 'Number of sets is required'],
      min: [1, 'Sets must be at least 1'],
    },
    reps: {
      type: Number,
      required: [true, 'Number of reps is required'],
      min: [1, 'Reps must be at least 1'],
      max: [1000, 'Reps cannot exceed 1000'],
    },
    weight: {
      type: Number,
      min: [0, 'Weight must be positive'],
    },
    duration: {
      type: Number,
      min: [0, 'Duration must be positive'],
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const workoutSessionSchema = new Schema<IWorkoutSession>(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      min: [0, 'Duration must be positive'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { _id: false }
);

const workoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
      maxlength: [100, 'Plan name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    exercises: {
      type: [exerciseSchema],
      required: [true, 'At least one exercise is required'],
      validate: {
        validator: function (v: IExercise[]) {
          return v && v.length > 0;
        },
        message: 'At least one exercise is required',
      },
    },
    targetMuscleGroups: [{ type: String }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    estimatedDuration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
    },
    completedSessions: [workoutSessionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduledDays: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Index for active plans
workoutPlanSchema.index({ userId: 1, isActive: 1 });

// Prevent model recompilation in development
const WorkoutPlan: WorkoutPlanModel =
  mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>('WorkoutPlan', workoutPlanSchema);

export default WorkoutPlan;
