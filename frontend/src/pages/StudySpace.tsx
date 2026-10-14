import Navbar from "../components/navbar";
import Menubar from "../components/MenuBar";

import { useParams } from "react-router-dom";

import {
  getDocuments,
  uploadDocument,
  viewDocument,
  deleteDocument,
  renameDocument
} from "../api/documentApi";

import { getStudySpace } from "../api/studySpaceApi";

import AISummary from "../components/AISummary";
import AIChat from "../components/AIChat";
import AIQuiz from "../components/AIQuiz";
import AIKeyPoints from "../components/AIKeyPoints";
import AIImportantQuestions from "../components/AIQuestions";

import {
  Upload,
  FileText,
  MessageSquare,
  Sparkles,
  Brain,
  HelpCircle,
  BookOpen,
  Pencil,
  MoreVertical,
  Trash2,
  Eye,
} from "lucide-react";

import { useEffect, useState } from "react";


type Document = {

  id:number;

  original_name:string;

  file_size:number;

  upload_date:string;

};

type StudySpaceRecord = { id: number; title: string; description: string; favorite?: boolean };



function StudySpace(){


const { id } = useParams();



const [studySpace,setStudySpace] =
useState<StudySpaceRecord | null>(null);



const [documents,setDocuments] =
useState<Document[]>([]);

const [documentsLoading,setDocumentsLoading] = useState(true);
const [documentsError,setDocumentsError] = useState("");



const [,setSelectedFile] =
useState<File | null>(null);


const [uploading,setUploading] =
useState(false);



const [pdfUrl,setPdfUrl] =
useState("");



const [selectedDocumentId,setSelectedDocumentId] =
useState<number | null>(() => {

const saved =
localStorage.getItem(
`selectedDocument_${id}`
);

return saved ? Number(saved) : null;

});


const [activeTab,setActiveTab] =
useState("document");



const [newName,setNewName] =
useState("");



const [showRename,setShowRename] =
useState(false);



// LOAD STUDY SPACE

useEffect(()=>{


const loadStudySpace = async()=>{


try{


const response =
await getStudySpace(Number(id));


setStudySpace(
response.studySpace
);


}
catch(error){

console.log(
"Study space loading failed",
error
);

}


};



if(id){

loadStudySpace();

}


},[id]);




// LOAD DOCUMENTS

useEffect(()=>{


const loadDocuments = async()=>{


try{

setDocumentsLoading(true);
setDocumentsError("");


const response =
await getDocuments(Number(id));


setDocuments(
response.documents
);

const savedId = Number(localStorage.getItem(`selectedDocument_${id}`));
if (savedId && response.documents.some((document: Document) => document.id === savedId)) {
  setSelectedDocumentId(savedId);
} else if (savedId) {
  localStorage.removeItem(`selectedDocument_${id}`);
  setSelectedDocumentId(null);
}


}
catch(error){

setDocumentsError(error instanceof Error ? error.message : "Documents could not be loaded.");

} finally {

setDocumentsLoading(false);

}


};



if(id){

loadDocuments();

}


},[id]);

// UPLOAD PDF

const handleUpload = async(file:File)=>{


if(!id) return;



try{


setUploading(true);



const formData =
new FormData();



formData.append(
"pdf",
file
);



formData.append(
"study_space_id",
id
);



await uploadDocument(formData);



const response =
await getDocuments(Number(id));



setDocuments(
response.documents
);



setSelectedFile(null);



}
catch(error){

console.log(
"Upload failed",
error
);


}
finally{


setUploading(false);


}


};



// DELETE DOCUMENT

const handleDeleteDocument = async(documentId:number)=>{

try{

await deleteDocument(documentId);


const response =
await getDocuments(Number(id));


setDocuments(
response.documents
);


}
catch(error){

console.log(
"Delete failed",
error
);

}

};



// RENAME DOCUMENT

const handleRenameDocument = async(
documentId:number,
name:string
)=>{


try{


await renameDocument(
documentId,
name
);



const response =
await getDocuments(Number(id));



setDocuments(
response.documents
);



}
catch(error){

console.log(
"Rename failed",
error
);

}


};



// VIEW PDF

const handleViewPDF = async(documentId:number)=>{


try{


setSelectedDocumentId(documentId);

localStorage.setItem(
`selectedDocument_${id}`,
documentId.toString()
);



const url =
await viewDocument(documentId);



setPdfUrl(url);



}
catch(error){


console.log(
"PDF view failed",
error
);


}


};

useEffect(()=>{
const savedDocument = localStorage.getItem(`selectedDocument_${id}`);
if (!savedDocument) return;
let mounted = true;
viewDocument(Number(savedDocument))
  .then((url) => { if (mounted) setPdfUrl(url); })
  .catch((error) => console.log("PDF view failed", error));
return () => { mounted = false; };
},[id]);
return(

<div className="min-h-screen bg-slate-950 text-white">

<Navbar />

<Menubar />


<main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

{documentsError && <div role="alert" className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-sm text-red-200">Could not load documents: {documentsError}</div>}


{/* Header */}

<div className="
bg-gradient-to-r
from-blue-700/90
via-indigo-600/90
to-violet-700/90
rounded-3xl border border-blue-300/20
p-6 lg:p-8 shadow-2xl shadow-blue-950/30
">


<div className="
flex
flex-col
lg:flex-row
lg:items-center
lg:justify-between
gap-6
">


<div>


<h1 className="
text-3xl
lg:text-4xl
font-bold
">

📘 {studySpace?.title} Study Space

</h1>



<p className="
mt-3
text-blue-100
text-base
lg:text-lg
">

{studySpace?.description}

</p>


</div>




<div className="
flex
flex-wrap
gap-3
">



<button

onClick={()=>setShowRename(true)}

className="
bg-white
text-blue-700
font-semibold
px-5
py-3
rounded-xl
flex
items-center
gap-2
hover:scale-105
transition
"

>

<Pencil size={18}/>

Rename

</button>





<label

className="
bg-white
text-blue-700
font-semibold
px-5
py-3
rounded-xl
flex
items-center
gap-2
hover:scale-105
transition
cursor-pointer
"

>


<Upload size={18}/>


{uploading ? "Uploading..." : "Upload PDF"}



<input

type="file"

accept=".pdf"

hidden


onChange={(e)=>{


const file =
e.target.files?.[0];


if(file){

setSelectedFile(file);

handleUpload(file);

}


}}


/>


</label>





<button

className="
bg-white
text-blue-700
p-3
rounded-xl
hover:scale-105
transition
"

>

<MoreVertical size={20}/>

</button>



</div>


</div>


</div>




{/* Rename Modal */}


{showRename && (


<div className="
fixed
inset-0
bg-black/60
flex
items-center
justify-center
z-50
p-5
">


<div className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
w-full
max-w-md
">


<h2 className="
text-2xl
font-semibold
mb-5
">

Rename Study Space

</h2>



<input

value={newName}

onChange={(e)=>setNewName(e.target.value)}

placeholder="Enter new name"

className="
w-full
bg-slate-800
border
border-slate-700
rounded-xl
px-4
py-3
outline-none
"

/>



<div className="
flex
justify-end
gap-3
mt-6
">


<button

onClick={()=>setShowRename(false)}

className="
px-5
py-3
rounded-xl
bg-slate-700
"

>

Cancel

</button>




<button

onClick={()=>{

if(newName.trim() && studySpace){

setStudySpace({

...studySpace,

title:newName

});

}


setNewName("");

setShowRename(false);


}}

className="
px-5
py-3
rounded-xl
bg-blue-600
hover:bg-blue-700
"

>

Save

</button>


</div>


</div>


</div>


)}
{/* Navigation Tabs */}

<div className="
bg-slate-900
border
border-slate-800
rounded-2xl
mt-8
p-3
overflow-x-auto
">


<div className="
flex
gap-3
min-w-max
">


{[

{id:"document",name:"Document",icon:FileText},

{id:"summary",name:"Summary",icon:Sparkles},

{id:"chat",name:"AI Chat",icon:MessageSquare},

{id:"quiz",name:"Quiz",icon:Brain},

{id:"points",name:"Key Points",icon:BookOpen},

{id:"questions",name:"Questions",icon:HelpCircle}

].map((tab)=>{


const Icon = tab.icon;



return(

<button

key={tab.id}

onClick={()=>setActiveTab(tab.id)}

className={`

px-5
py-3
rounded-xl
flex
items-center
gap-2
transition

${
activeTab===tab.id

?

"bg-blue-600"

:

"hover:bg-slate-800"

}

`}

>


<Icon size={18}/>

{tab.name}


</button>


);


})}



</div>


</div>





{/* Document Tab */}


{activeTab==="document" && (


<div className="
grid
grid-cols-1
xl:grid-cols-3
gap-6
mt-8
">



<div className="
xl:col-span-2
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
">



<div className="
flex
justify-between
items-center
mb-5
">


<h2 className="
text-2xl
font-semibold
">

Uploaded Documents

</h2>


<Upload

className="text-blue-400"

size={25}

/>


</div>




{

documents.length===0 ?


<div className="
h-[400px]
border-2
border-dashed
border-slate-700
rounded-xl
flex
flex-col
items-center
justify-center
">


<FileText

size={70}

className="text-slate-600"

/>


<p className="
mt-5
text-xl
text-slate-400
">

{documentsLoading ? "Loading documents…" : "No documents uploaded"}

</p>


</div>



:


documents.map((doc)=>(


<div

key={doc.id}

className="
bg-slate-800
border
border-slate-700
rounded-xl
p-4
flex
justify-between
items-center
mb-4
"

>


<div className="
flex
items-center
gap-4
">


<FileText

size={30}

className="text-blue-400"

/>



<div>


<h3

className="
font-semibold
cursor-pointer
"

onClick={()=>{


const newName =
prompt(
"Enter new document name",
doc.original_name
);



if(newName){

handleRenameDocument(
doc.id,
newName
);

}


}}

>


{doc.original_name}


</h3>



<p className="
text-sm
text-slate-400
">

{doc.file_size} bytes • {doc.upload_date}

</p>



</div>


</div>




<div className="
flex
gap-3
">



<button
onClick={()=>{
  setSelectedDocumentId(doc.id);
  handleViewPDF(doc.id);
}}

className="
bg-blue-600
hover:bg-blue-700
p-3
rounded-xl
"

>

<Eye size={18}/>


</button>




<button

onClick={()=>handleDeleteDocument(doc.id)}

className="
bg-red-600
p-3
rounded-xl
"

>

<Trash2 size={18}/>


</button>



</div>



</div>



))


}
{/* PDF Viewer */}

<div className="
h-[500px]
lg:h-[600px]
mt-6
rounded-xl
border-2
border-dashed
border-slate-700
overflow-hidden
">


{

pdfUrl ?


<iframe

src={pdfUrl}

className="
w-full
h-full
"

title="PDF Preview"

/>



:


<div className="
h-full
flex
flex-col
justify-center
items-center
">


<FileText

size={70}

className="text-slate-600"

/>



<p className="
mt-5
text-xl
text-slate-400
">

PDF Viewer

</p>



<p className="
text-slate-500
mt-2
">

Click eye button to preview PDF

</p>



</div>


}


</div>


</div>





{/* Document Info */}


<div className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
h-fit
">


<h2 className="
text-2xl
font-semibold
mb-5
">

Document Info

</h2>



<div className="
space-y-4
text-slate-400
">


<p>

📄 Total Documents:

<span className="text-white ml-2">

{documents.length}

</span>

</p>



<p>

🤖 AI Ready:

<span className="text-green-400 ml-2">

Yes

</span>

</p>



<p>

🧠 Processing:

<span className="text-yellow-400 ml-2">

Waiting

</span>

</p>



</div>


</div>



</div>


)}





{/* AI Summary */}

{activeTab !== "document" && !selectedDocumentId && (
  <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 px-6 py-10 text-center">
    <FileText size={34} className="mx-auto text-blue-300" />
    <h2 className="mt-4 text-xl font-semibold">Select a document to use the study tools</h2>
    <p className="mx-auto mt-2 max-w-lg text-slate-400">Upload a PDF or choose one from the Document tab before opening AI features.</p>
    <button onClick={() => setActiveTab("document")} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500">Open documents</button>
  </div>
)}

{/* Summary */}

{selectedDocumentId && (

<div className={
activeTab==="summary"
?
"block mt-8"
:
"hidden"
}>

<AISummary
key={selectedDocumentId}
documentId={selectedDocumentId}
/>

</div>

)}






{/* AI Chat */}


{selectedDocumentId && (

<div className={activeTab==="chat" ? "block" : "hidden"}>
    
    <AIChat
        key={selectedDocumentId}
        documentId={selectedDocumentId}
    />

</div>


)}






{/* AI Quiz */}


{selectedDocumentId && (

<div className={
activeTab==="quiz"
?
"block mt-8"
:
"hidden"
}>

<AIQuiz
key={selectedDocumentId}
documentId={selectedDocumentId}
/>

</div>

)}
{/* AI Key Points */}


{selectedDocumentId && (

<div
className={
activeTab==="points"
?
"block mt-8"
:
"hidden"
}
>

<AIKeyPoints
key={selectedDocumentId}
documentId={selectedDocumentId}
/>

</div>

)}






{/* AI Important Questions */}


{selectedDocumentId && (

<div
className={
activeTab==="questions"
?
"block mt-8"
:
"hidden"
}
>

<AIImportantQuestions
key={selectedDocumentId}
documentId={selectedDocumentId}
/>

</div>

)}




</main>

</div>

);


}


export default StudySpace;
