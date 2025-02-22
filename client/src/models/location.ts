import mongoose from 'mongoose';



const locationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
            latitude: {
              type: Number,
              required: true,
              min: -90,
              max: 90,
            },
            longitude: {
              type: Number,
              required: true,
              min: -180,
              max: 180,
            },
          },
          required: true, // Ensure coordinates are required
        
      
      
    },
    
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);

export default Location;
