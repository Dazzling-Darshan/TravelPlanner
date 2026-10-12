import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    tripData: {
        type: Object, // Stores the entire JSON object from AI
        required: true,
    },
    duration: {
        type: Number,
        required: false,
    },
    budget: {
        type: String,
        required: false,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "cancelled", "approved"],
        default: "published",
    },
    capacity: {
        type: Number,
        default: 10,
    },
    price: {
        type: Number,
        default: 0,
    },
    terms: {
        type: String,
        default: "1. All members must follow safety guidelines. 2. Payments are non-refundable after approval. 3. Respect local culture.",
    },
    packageNotes: {
        type: String,
        default: "",
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    selectedHotel: {
        type: Object,
        default: null
    },
    startDate: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    }
}, { timestamps: true });

export default mongoose.model("Trip", TripSchema);
