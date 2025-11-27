import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHealthData extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  weight: number;
  height: number;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  dailyCalories?: {
    consumed: number;
    target: number;
  };
  dailyMacros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

type HealthDataModel = Model<IHealthData>;

const healthDataSchema = new Schema<IHealthData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [1, 'Weight must be positive'],
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [1, 'Height must be positive'],
    },
    bmi: {
      type: Number,
      min: [1, 'BMI must be positive'],
      max: [100, 'BMI cannot exceed 100'],
    },
    bodyFat: {
      type: Number,
      min: [0, 'Body fat percentage must be positive'],
      max: [100, 'Body fat percentage cannot exceed 100'],
    },
    muscleMass: {
      type: Number,
      min: [0, 'Muscle mass must be positive'],
    },
    dailyCalories: {
      consumed: { type: Number, default: 0 },
      target: { type: Number, default: 2000 },
    },
    dailyMacros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user history queries
healthDataSchema.index({ userId: 1, date: -1 });

// Calculate BMI before saving if weight and height are provided
healthDataSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    // BMI = weight (kg) / height (m)^2
    const heightInMeters = this.height / 100;
    this.bmi = Math.round((this.weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }
  next();
});

// Prevent model recompilation in development
const HealthData: HealthDataModel =
  mongoose.models.HealthData ||
  mongoose.model<IHealthData>('HealthData', healthDataSchema);

export default HealthData;
