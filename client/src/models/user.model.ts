import mongoose from "mongoose";
import bcrypt from "bcrypt";
const bloodReportSchema = new mongoose.Schema({
  report_details: {
    patient_name: String,
    age: String, // You might consider using a Number type if age is always a number
    gender: String,
    report_date_time: String, // Consider using a Date type for better date handling
  },
  blood_group: {
    group: String,
    rh_factor: String,
    du: String, // Or Boolean if it's always a yes/no or null
  },
  complete_blood_count: {
    hemoglobin: {
      value: Number,
      reference_range: String, // You could split this into min/max Number fields
      unit: String,
      status: String,
    },
    rbc_count: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    packed_cell_volume: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
      status: String,
    },
    mean_corpuscular_volume: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    mean_corpuscular_hemoglobin: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    mean_corpuscular_hemoglobin_concentration: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    red_cell_distribution_width: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    wbc_count: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
    differential_wbc_count: {
      neutrophils: {
        value: Number,
        reference_range: String, // Same as above
      },
      lymphocytes: {
        value: Number,
        reference_range: String, // Same as above
      },
      eosinophils: {
        value: Number,
        reference_range: String, // Same as above
      },
      monocytes: {
        value: Number,
        reference_range: String, // Same as above
      },
      basophils: {
        value: Number,
        reference_range: String, // Same as above
      },
    },
    platelet_count: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
      status: String,
    },
    esr: {
      value: Number,
      reference_range: String, // Same as above
      unit: String,
    },
  },
  interpretation: String,
  abnormalities: [String], // Array of strings
});
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Wallet address (for Web3 login)
  email: { type: String, unique: true, sparse: true,required:true }, // Optional Email login
  passwordHash: { type: String, default: null,required:true }, // Hashed password for Email login
  firstName: { type: String, required: true }, // User's first name
  lastName: { type: String, required: true }, // User's last name
  dateOfBirth: { type: Date, required: true }, // User's date of birth
  bloodType: { type: String, required: true }, // User's blood type
  lastDonationDate: { type: Date }, // Last donation date
  donationEligibility: { type: Boolean, default: false },
   // AI-based eligibility prediction
  nftRewards: [{ type: String }] ,
  BloodReport:[bloodReportSchema]// List of earned NFT Token IDs
});

// Hash password before saving to DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

export const User = mongoose.model("User ", UserSchema);