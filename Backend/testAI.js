require("dotenv").config();


const {
generateAIResponse
}=require("./src/services/aiService");


generateAIResponse(
"Explain cloud computing in simple words"
)
.then((response)=>{

console.log(response);

})
.catch((error)=>{

console.log(error);

});