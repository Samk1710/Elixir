import Tesseract from "tesseract.js"

const convertor = async (url: string) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(url, "eng", { logger: (m) => {} })
    return text
  } catch (error) {
    console.error("Error converting image:", error)
    return ""
  }
}

export default convertor