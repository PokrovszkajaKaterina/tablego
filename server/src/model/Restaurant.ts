import mongoose, { Document, Model, Schema } from 'mongoose';

interface OpeningHour {
    open: string;
    close: string;
}

interface IRestaurant extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    about: string;
    maxCapacity: number;
    openingHours: {
        monday: OpeningHour[];
        tuesday: OpeningHour[];
        wednesday: OpeningHour[];
        thursday: OpeningHour[];
        friday: OpeningHour[];
        saturday: OpeningHour[];
        sunday: OpeningHour[];
    };
}

const RestaurantSchema: Schema<IRestaurant> = new mongoose.Schema({
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

export const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);