"use client"
import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'
import convertor from "@/lib/converter"
import axios from "axios"
import Image from "next/image"
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { api_Secret,api_key } from "@/lib/pinata"
export default function Home() {
  const google = createGoogleGenerativeAI({apiKey:"AIzaSyAVQpop5MJZpJg2x3DhEfWs4nCFmOQ-Op0"});
  const [processing, setProcessing] = useState<boolean>(false)
  const [texts, setTexts] = useState<Array<string>>([])
  const [preview, setPreview] = useState<string>("")
  const [fileName, setFileName] = useState<string>("No file chosen")
  const [result, setResult] = useState<string>("")
  const imageInputRef = useRef<HTMLInputElement>(null)

  const openBrowseImage = () => {
    imageInputRef.current?.click()
  }
  const processData = async () => {
    if (texts.length) {
      setResult("");
      const {text} =await generateText({
        model:google("gemini-1.5-flash"),
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
give only the json object response to the client.
`, 
         prompt:`${texts}`,
        })
        setResult(removeChars(text));
          console.log(removeChars(text));
        
    }
  }

  const removeChars=(str: string): string=> {
    if (typeof str !== 'string') {
      return "Input must be a string";
    }
    if (str.length <= 12) {  
      return "";
    }
  return str.slice(8, -4);
  }
  
  const convert = async (url: string, file: File) => {
    if (url.length) {
      setProcessing(true)
      setPreview(url)
      setFileName(file.name)
      await convertor(url).then((txt: string) => {
        setTexts((prevTexts) => [...prevTexts, txt])
      })
      setProcessing(false)
    }
  }

  const handleFile = (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file)
      console.log("File uploaded",file)
      convert(url, file)
    }
  }
  const handleSubmit_pinata = async (event:any) => {
    event.preventDefault();
    const data = new FormData();
    data.append("file", imageInputRef.current?.files?.[0] as Blob);
    const response_data=await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
      headers: {
        "Content-Type": `multipart/form-data`,
        pinata_api_key: api_key,
        pinata_secret_api_key: api_Secret,
      },
    })
  const fileurl="https://gateway.pinata.cloud/ipfs/"+response_data.data.IpfsHash;
  console.log(fileurl);
  }
  
  return (
    <div className="container max-w-2xl mx-auto py-8 min-h-screen px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-serif">Upload Blood Report</CardTitle>
          <CardDescription>
            Upload your blood test report for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="">
          <input
            ref={imageInputRef}
            type="file"
            hidden
            accept="image/*,.pdf"
            required
            onChange={(e) => {
              e.preventDefault()
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />  

          <div 
            className="border-2 border-dashed rounded-lg p-6 mb-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={openBrowseImage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) handleFile(file)
            }}
          >
            {preview ? (
              <div className="relative w-full aspect-video">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Drag and drop or click to upload</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-sm text-muted-foreground truncate">
              {fileName}
            </div>
            <Button 
              disabled={processing || !imageInputRef.current?.files?.length}
              onClick={handleSubmit_pinata}
              className="bg-red-500 hover:bg-red-600"
              type="submit"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Supported formats:JPG, PNG
          </p>
          </form>
        </CardContent>
        
      </Card>
      <Button 
        disabled={processing || !imageInputRef.current?.files?.length}
        onClick={processData}
        className="bg-red-500 hover:bg-red-600"
         >
        <Upload className="w-4 h-4 mr-2" />
          Analyse
        </Button>
        <p>{result}</p>
    </div>
  )
}