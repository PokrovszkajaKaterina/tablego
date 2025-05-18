"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RestaurantSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    description: { type: String, required: false },
    about: { type: String, required: false },
    maxCapacity: { type: Number, required: true },
    openingHours: {
        monday: { open: { type: String }, close: { type: String } },
        tuesday: { open: { type: String }, close: { type: String } },
        wednesday: { open: { type: String }, close: { type: String } },
        thursday: { open: { type: String }, close: { type: String } },
        friday: { open: { type: String }, close: { type: String } },
        saturday: { open: { type: String }, close: { type: String } },
        sunday: { open: { type: String }, close: { type: String } }
    }
});
RestaurantSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
RestaurantSchema.set('toJSON', {
    virtuals: true,
});
exports.Restaurant = mongoose_1.default.model('Restaurant', RestaurantSchema);
