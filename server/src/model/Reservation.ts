import mongoose, { Model, Schema, Types } from 'mongoose';

interface IReservation extends Document {
    restaurantId: Types.ObjectId;
    userId: Types.ObjectId;
    date: Date;
    time: {
        hour: number;
        minute: number;
    };
    numberOfPeople: number;
    comment: string;
    status: string;
}

const ReservationSchema: Schema<IReservation> = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: {
        hour: { type: Number, required: true },
        minute: { type: Number, required: true }
    },
    numberOfPeople: { type: Number, required: true },
    comment: { type: String, required: false },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
});

export const Reservation: Model<IReservation> = mongoose.model<IReservation>('Reservation', ReservationSchema);