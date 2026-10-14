import Navbar from "../components/navbar";
import Menubar from "../components/MenuBar";

import { PlusCircle, Upload, BookOpen } from "lucide-react";
import { useState } from "react";
import { createStudySpace } from "../api/studySpaceApi";
import { uploadDocument } from "../api/documentApi";
import { useNavigate } from "react-router-dom";

function NewStudySpace() {

  const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [loading,setLoading] = useState(false);
const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <Menubar />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        <div className="max-w-3xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl shadow-slate-950/30 p-6 sm:p-10">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-950/30">

              <PlusCircle size={34} />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Create Study Space
              </h1>

              <p className="text-slate-400 mt-2">
                Build your own AI-powered learning workspace.
              </p>

            </div>

          </div>

          {/* Study Space Name */}

          <div className="mt-8">

            <label className="block text-lg font-semibold mb-3">
              Study Space Name
            </label>

           <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Example: Database Management System"
  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
/>

          </div>

          {/* Description */}

          <div className="mt-7">

            <label className="block text-lg font-semibold mb-3">
              Description
            </label>

            <textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Write a short description about this subject..."
  className="w-full h-36 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 resize-none focus:border-blue-500 focus:outline-none"
/>

          </div>

          {/* Upload */}

          <div className="mt-7">

            <label className="block text-lg font-semibold mb-3">
              Upload Study Material
            </label>

            <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500 transition">

              <Upload
                size={42}
                className="mx-auto text-blue-400"
              />

              <p className="mt-4 text-lg">
                Drag & Drop your files here
              </p>

              <p className="text-slate-500 mt-2">
                or click below to browse
              </p>

             <input
  type="file"
  accept=".pdf,.txt"
  onChange={(e)=>{

    const file = e.target.files?.[0];

    if(file){
      setSelectedFile(file);
    }

  }}
  className="mt-6 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg file:cursor-pointer"
/>

            </div>

          </div>

          {/* Button */}

         <button
disabled={loading}
onClick={async()=>{

try{

setLoading(true);


// 1. Create Study Space

const response = await createStudySpace({
  title,
  description
});


// 2. Get created study space id

const studySpaceId = response.studySpaceId;


// 3. Upload PDF automatically

if(selectedFile){

const formData = new FormData();

formData.append(
"pdf",
selectedFile
);

formData.append(
"study_space_id",
studySpaceId
);


await uploadDocument(formData);

}


// 4. Redirect

navigate(`/study-space/${studySpaceId}`);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

}}

className="mt-10 w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl text-lg font-semibold transition"
>

<BookOpen size={22}/>

{loading ? "Creating..." : "Create Study Space"}

</button>

           
          

        </div>

      </main>

    </div>
  );
}

export default NewStudySpace;
