import { useState } from "react";
import { Brain } from "lucide-react";
import { generateQuiz, getAIErrorMessage, saveQuizResult } from "../api/aiApi";

interface Props{
    documentId:number;
}

type QuizQuestion={
    question:string;
    options:string[];
    correctAnswer:string;
};

type QuizState = {
  quiz: QuizQuestion[];
  selectedAnswers: Record<number, string>;
  score: number;
  submitted: boolean;
};

const readSavedQuiz = (documentId: number): QuizState => {
  const empty: QuizState = { quiz: [], selectedAnswers: {}, score: 0, submitted: false };
  const key = `quizData_${documentId}`;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return empty;
    const data = JSON.parse(saved) as Partial<QuizState>;
    const validQuiz = Array.isArray(data.quiz) && data.quiz.every(
      (item) => item && typeof item.question === "string" && Array.isArray(item.options) && item.options.every((option) => typeof option === "string") && typeof item.correctAnswer === "string"
    );
    if (!validQuiz) throw new Error("Saved quiz is invalid");
    return {
      quiz: data.quiz as QuizQuestion[],
      selectedAnswers: data.selectedAnswers && typeof data.selectedAnswers === "object" ? data.selectedAnswers : {},
      score: Number(data.score) || 0,
      submitted: Boolean(data.submitted),
    };
  } catch {
    localStorage.removeItem(key);
    return empty;
  }
};

function AIQuiz({documentId}:Props){

const [savedQuiz] = useState(() => readSavedQuiz(documentId));
const [quiz,setQuiz]=useState<QuizQuestion[]>(savedQuiz.quiz);
const [loading,setLoading]=useState(false);
const [error,setError]=useState("");

const [selectedAnswers,setSelectedAnswers]=
useState<Record<number,string>>(savedQuiz.selectedAnswers);

const [submitted,setSubmitted]=
useState(savedQuiz.submitted);

const [score,setScore]=
useState(savedQuiz.score);

const handleGenerate = async()=>{

try{

console.log("Quiz generation started");

setLoading(true);
  setError("");

const response = await generateQuiz(documentId);

if (!Array.isArray(response.quiz) || response.quiz.length === 0) {
  throw new Error("The AI returned an empty quiz. Please try again.");
}

console.log("Quiz response:", response);

setQuiz(response.quiz);

setSelectedAnswers({});
setSubmitted(false);
setScore(0);
localStorage.setItem(`quizData_${documentId}`, JSON.stringify({ quiz: response.quiz, selectedAnswers: {}, score: 0, submitted: false }));

}
catch(error){

setError(getAIErrorMessage(error));

}
finally{

console.log("Quiz loading finished");

setLoading(false);

}

};

const handleGenerateMore=async()=>{

try{

setLoading(true);
setError("");

const response=
await generateQuiz(documentId);

if (!Array.isArray(response.quiz) || response.quiz.length === 0) {
  throw new Error("The AI returned an empty quiz. Please try again.");
}

setQuiz(response.quiz);
setSelectedAnswers({});
setSubmitted(false);
setScore(0);

// Save generated quiz
localStorage.setItem(
  `quizData_${documentId}`,
  JSON.stringify({
    quiz: response.quiz,
    selectedAnswers: {},
    score: 0,
    submitted: false
  })
);
}
catch(error){

setError(getAIErrorMessage(error));

}
finally{

setLoading(false);

}

};

const handleOptionSelect = (
  questionIndex: number,
  option: string
) => {
  const updatedAnswers = {
    ...selectedAnswers,
    [questionIndex]: option
  };

  setSelectedAnswers(updatedAnswers);

  // Save progress while answering
  localStorage.setItem(
    `quizData_${documentId}`,
    JSON.stringify({
      quiz,
      selectedAnswers: updatedAnswers,
      score,
      submitted
    })
  );
};

const handleSubmit=async()=>{

let totalScore=0;

quiz.forEach((question,index)=>{

if(
selectedAnswers[index]===question.correctAnswer
){
totalScore++;
}

});

setScore(totalScore);

setSubmitted(true);

localStorage.setItem(
  `quizData_${documentId}`,
  JSON.stringify({
    quiz,
    selectedAnswers,
    score: totalScore,
    totalQuestions: quiz.length,
    submitted: true
  })
);


try{

await saveQuizResult({

document_id: documentId,

score: totalScore,

total_questions: quiz.length

});

}
catch(error){

console.log(
"Saving quiz result failed",
error
);

}

};

return(

<div className="
overflow-hidden
bg-slate-900/95
border
border-slate-800
rounded-2xl
p-6
sm:p-8
shadow-xl
shadow-slate-950/20
">

<div className="
flex
items-center
gap-3
border-b
border-slate-800
pb-6
">

<div className="bg-emerald-400/10 text-emerald-300 ring-1 ring-inset ring-emerald-300/20 grid h-11 w-11 place-items-center rounded-xl">
<Brain size={22}/>
</div>

<div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-300">Knowledge check</p><h2 className="mt-0.5 text-2xl font-semibold">AI Quiz</h2></div>

</div>
{error && <p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
{

quiz.length===0

?

<>

<p className="
mt-5
text-slate-400
">

Generate a focused multiple-choice quiz from your uploaded document.

</p>

<button

onClick={handleGenerate}

disabled={loading}

className="
mt-6
bg-emerald-600
hover:bg-emerald-500
px-6
py-3
rounded-xl
font-semibold
shadow-lg
shadow-emerald-950/25
"

>

{

loading ? "Generating Quiz (Please wait)..." : "Start Quiz"

}

</button>

</>

:

(

<div className="
mt-6
space-y-5
">

{

quiz.map((item,index)=>(

<div

key={index}

className="
bg-slate-800/60
border
border-slate-700/70
rounded-xl
p-5
"

>

<h3 className="
font-semibold
text-lg
">

{index+1}. {item.question}

</h3>

<div className="
mt-4
space-y-2
">

{

item.options.map((option,i)=>(

<button

key={i}

onClick={()=>handleOptionSelect(index,option)}

className={`

w-full
text-left
rounded-lg
p-3
transition

${
selectedAnswers[index]===option
?
"bg-blue-600 text-white ring-1 ring-inset ring-blue-300/50"
:
"bg-slate-900/70 border border-slate-700 hover:border-blue-400/50 hover:bg-slate-700"
}

`}

>

{option}

</button>

))

}

</div>

</div>

))

}
<div className="
flex
flex-wrap
gap-4
mt-8
">

<button

onClick={handleSubmit}

disabled={submitted}

className="
bg-emerald-600
hover:bg-emerald-500
px-6
py-3
rounded-xl
disabled:opacity-50
"

>

Submit Quiz

</button>

<button

onClick={handleGenerateMore}

disabled={loading}

className="
bg-blue-600
hover:bg-blue-700
px-6
py-3
rounded-xl
"

>

{
loading
?
"Generating..."
:
"Generate More"
}

</button>

</div>

{

submitted && (

<div className="
mt-6
bg-emerald-400/10
border
border-emerald-400/20
rounded-xl
p-5
">

<h3 className="
text-2xl
font-bold
text-emerald-300
">

🎉 Your Score: {score}/{quiz.length}

</h3>

<p className="
text-slate-300
mt-2
">

You answered {score} out of {quiz.length} questions correctly.

</p>

</div>

)

}

</div>

)

}

</div>

);

}

export default AIQuiz;
