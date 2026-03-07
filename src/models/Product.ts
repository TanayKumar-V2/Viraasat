import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, enum: ['men', 'women', 'unisex'], required: true },
        images: [{ type: String }],
        sizes: [{ type: String }],
        colors: [{ type: String }],
        qikink_sku: { type: String, required: true },
    },
    { timestamps: true }
);

const Product = models.Product || model('Product', ProductSchema);

export default Product;
