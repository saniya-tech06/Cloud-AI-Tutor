const fs = require("fs");
const { PDFParse } = require("pdf-parse");


const extractTextFromPDF = async (filePath) => {

    try {

        const dataBuffer = fs.readFileSync(filePath);

        const parser = new PDFParse({
            data: dataBuffer
        });


        const result = await parser.getText();


        return result.text;


    } catch (error) {

        console.log("PDF extraction error:", error);
        throw error;

    }

};


module.exports = {
    extractTextFromPDF
};