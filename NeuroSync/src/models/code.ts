import mongoose, { Schema, Document } from "mongoose";

export interface ICode extends Document {
  fileName: string;
  content: string;
  updatedAt: Date;
}

const CodeSchema = new Schema<ICode>({
  fileName: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Code ||
  mongoose.model<ICode>("Code", CodeSchema);
