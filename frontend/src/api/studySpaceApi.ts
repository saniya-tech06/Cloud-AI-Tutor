import api from "./axios";


interface StudySpaceData {

  title: string;

  description: string;

}


// Get all study spaces

export const getStudySpaces = async () => {

  const response = await api.get("/study-spaces");

  return response.data;

};



// Create new study space

export const createStudySpace = async (
  data: StudySpaceData
) => {

  const response = await api.post(
    "/study-spaces",
    data
  );

  console.log("Create Study Space Response:", response.data);

  return response.data;

};



// Rename / Update study space

export const renameStudySpace = async (
  id: number,
  data: StudySpaceData
) => {

  const response = await api.put(
    `/study-spaces/${id}`,
    data
  );

  return response.data;

};



// Delete study space

export const deleteStudySpace = async (
  id:number
) => {

  const response = await api.delete(
    `/study-spaces/${id}`
  );

  return response.data;

};



// Get single study space

export const getStudySpace = async (
  id:number
) => {

  const response = await api.get(
    `/study-spaces/${id}`
  );

  return response.data;

};

export const toggleFavorite = async (id:number) => {

  const token = localStorage.getItem("token");


  const response = await fetch(
    `http://localhost:5000/api/study-spaces/${id}/favorite`,
    {
      method:"PUT",

      headers:{
        "Content-Type":"application/json",

        Authorization:`Bearer ${token}`,
      },
    }
  );


  return await response.json();

};