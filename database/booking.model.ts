import mongoose, { Schema, Document, Types } from 'mongoose';
import Event from './event.model';

// Interface
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email: string) {
                    const emailRegex =
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    return emailRegex.test(email);
                },
                message: 'Please provide a valid email address',
            },
        },
    },
    { timestamps: true }
);

// ✅ FIX: Explicitly define as DOCUMENT middleware
// Removed the 'next' parameter entirely
BookingSchema.pre('save', async function () {
    if (this.isModified('eventId') || this.isNew) {
        try {
            const eventExists = await Event.findById(this.eventId).select('_id');

            if (!eventExists) {
                const error = new Error(`Event with ID ${this.eventId} does not exist`);
                error.name = 'ValidationError';
                throw error; // ✅ Simply throw the error
            }
        } catch (err) {
            console.error('Database pre-save validation failed:', err);

            const validationError = new Error('Invalid event ID format or database error');
            validationError.name = 'ValidationError';

            throw validationError; // ✅ Throw here as well
        }
    }

    // No need to return next() at the end! Mongoose knows it's done when the async function finishes.
});

// Indexes
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index(
    { eventId: 1, email: 1 },
    { unique: true, name: 'uniq_event_email' }
);

// Model
const Booking =
    (mongoose.models.Booking as mongoose.Model<IBooking>) ||
    mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;