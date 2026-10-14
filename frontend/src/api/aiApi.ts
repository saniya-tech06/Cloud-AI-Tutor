import api from "./axios";

export const getAIErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) return response.data.message;
    }

    return error instanceof Error ? error.message : "The AI request failed. Please try again.";
};


// Generate AI Summary
export const generateSummary = async(documentId:number)=>{

    const response = await api.post(
        `/ai/summary/${documentId}`
    );

    return response.data;

};



// AI Chat
export const askAI = async(
    documentId:number,
    question:string
)=>{

    const response = await api.post(
        `/ai/chat/${documentId}`,
        {
            question
        }
    );

    return response.data;

};

export const getChatHistory = async(documentId: number) => {
    const response = await api.get(`/ai/chat/${documentId}/history`);
    return response.data;
};



// Generate Quiz
export const generateQuiz = async(documentId:number)=>{

    const response = await api.post(
        `/ai/quiz/${documentId}`
    );

    return response.data;

};



// Generate Key Points
export const generateKeyPoints = async(documentId:number)=>{

    const response = await api.post(
        `/ai/key-points/${documentId}`
    );

    return response.data;

};



// Generate Important Questions
export const generateImportantQuestions = async(documentId:number)=>{

    const response = await api.post(
        `/ai/important-questions/${documentId}`
    );

    return response.data;

};

type QuizResult = { document_id: number; score: number; total_questions: number };

export const saveQuizResult = async(data:QuizResult)=>{

  const response = await fetch(
    "http://localhost:5000/api/quiz/save",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json",

        Authorization:
        `Bearer ${localStorage.getItem("token")}`
      },

      body:JSON.stringify(data)
    }
  );

  return response.json();

};
