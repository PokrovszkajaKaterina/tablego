"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ReservationSchema = new mongoose_1.default.Schema({
    restaurantId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true }
    },
    numberOfPeople: { type: Number, required: true },
    comment: { type: String, required: false },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
});
exports.Reservation = mongoose_1.default.model('Reservation', ReservationSchema);
