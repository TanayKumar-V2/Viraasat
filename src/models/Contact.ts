import mongoose, { Document } from "mongoose";

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        message: {
            type: String,
            required: [true, "Please provide a message"],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Contact ||
    mongoose.model<IContact>("Contact", ContactSchema);
