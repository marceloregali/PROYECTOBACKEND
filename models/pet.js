import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  type: {
    type: String,
    enum: ["dog", "cat", "rabbit", "parrot", "hamster"],
    required: true,
  },
});

const PetModel = mongoose.model("Pet", petSchema);
export default PetModel;
