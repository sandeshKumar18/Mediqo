import mongoose from "mongoose";

const generalRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    queueNumber: {
      type: Number,
      required: true,
    },

    bookingFee: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: [
        "waiting",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
        "no_show",
      ],
      default: "waiting",
    },

    assignedDoctor: {
      type: String,
      ref: "doctor",
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    actionReason: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

generalRequestSchema.index({
  department: 1,
  createdAt: 1,
  queueNumber: 1,
});

generalRequestSchema.index({
  department: 1,
  status: 1,
  createdAt: 1,
});

generalRequestSchema.index({
  user: 1,
  createdAt: -1,
});

const generalRequestModel =
  mongoose.models.generalRequest ||
  mongoose.model("generalRequest", generalRequestSchema);

export default generalRequestModel;
