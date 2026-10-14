const { extractTextFromPDF } =
require("./src/services/pdfService");


extractTextFromPDF("./src/uploads/sample.pdf")
.then((text)=>{

    console.log("PDF TEXT:");
    console.log(text);

})
.catch((error)=>{

    console.log("Error:", error);

});