import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String }, // Optional for OAuth
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    },
    { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
