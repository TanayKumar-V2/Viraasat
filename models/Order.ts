import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    color: { type: String, required: true },
});

const AddressSchema = new Schema({
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true },
});

const OrderSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        products: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        paymentId: { type: String },
        status: {
            type: String,
            enum: ['pending', 'paid', 'processing', 'shipped'],
            default: 'pending',
        },
        shippingAddress: { type: AddressSchema, required: true },
    },
    { timestamps: true }
);

const Order = models.Order || model('Order', OrderSchema);

export default Order;
