import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeal {
  name: string;
  time: string;
  calories: number;
  items: string[];
  completed?: boolean;
}

export interface IDietPlan extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planType: string;
  name: string;
  description?: string;
  dailyCalories: number;
  macroRatio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: IMeal[];
  tags?: string[];
  benefits?: string[];
  tips?: string[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type DietPlanModel = Model<IDietPlan>;

const mealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
    },
    time: {
      type: String,
      required: [true, 'Meal time is required'],
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories must be positive'],
      max: [5000, 'Calories per meal cannot exceed 5000'],
    },
    items: [{ type: String }],
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const dietPlanSchema = new Schema<IDietPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    planType: {
      type: String,
      required: [true, 'Plan type is required'],
      enum: [
        'mediterranean',
        'keto',
        'plant-based',
        'intermittent-fasting',
        'paleo',
        'dash',
        'custom',
      ],
    },
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    dailyCalories: {
      type: Number,
      required: [true, 'Daily calories target is required'],
      min: [500, 'Daily calories must be at least 500'],
      max: [10000, 'Daily calories cannot exceed 10000'],
    },
    macroRatio: {
      protein: {
        type: Number,
        required: true,
        min: [0, 'Protein ratio must be positive'],
        max: [100, 'Protein ratio cannot exceed 100'],
      },
      carbs: {
        type: Number,
        required: true,
        min: [0, 'Carbs ratio must be positive'],
        max: [100, 'Carbs ratio cannot exceed 100'],
      },
      fat: {
        type: Number,
        required: true,
        min: [0, 'Fat ratio must be positive'],
        max: [100, 'Fat ratio cannot exceed 100'],
      },
    },
    meals: [mealSchema],
    tags: [{ type: String }],
    benefits: [{ type: String }],
    tips: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active plans
dietPlanSchema.index({ userId: 1, isActive: 1 });

// Prevent model recompilation in development
const DietPlan: DietPlanModel =
  mongoose.models.DietPlan ||
  mongoose.model<IDietPlan>('DietPlan', dietPlanSchema);

export default DietPlan;
