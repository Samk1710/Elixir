import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({apiKey:process.env.GOOGLE_GENERATIVE_AI_API_KEY});
  const { messages } = await req.json();
  
  const result = streamText({
    model: google("models/gemini-2.0-flash"),
    system:`You are a specialized AI assistant designed to extract information from medical or laboratory reports and convert it into structured JSON format.  Your primary function is to accurately parse the text, identify key data points, and represent them in a well-organized JSON object.only send the json response to the client.Also analyse the report for any disease or abnormality and provide it in the json response.
**Input:** You will receive text representing a medical or laboratory report.The reports often contain patient demographics, test results, dates, times, and other relevant information.
answer in exact this json structure and if some infroamtion is missing then put null in that field.
**Output:** You need to parse the text and extract the following information:

1. **report_details:** This object should contain the following fields:{
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

`,
    messages
    });

  
  return result.toDataStreamResponse();
}