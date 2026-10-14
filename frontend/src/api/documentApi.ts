import api from "./axios";

// Upload PDF
export const uploadDocument = async (formData: FormData) => {
  const response = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get all documents of a study space
export const getDocuments = async (studySpaceId: number) => {
  const response = await api.get(
    `/documents/study-space/${studySpaceId}`
  );

  return response.data;
};

// Rename document
export const renameDocument = async (
  id: number,
  original_name: string
) => {
  const response = await api.put(`/documents/${id}`, {
    original_name,
  });

  return response.data;
};

// Delete document
export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`);

  return response.data;
};

// View PDF
// View PDF
export const viewDocument = async (id:number) => {

  const response = await api.get(
    `/documents/view/${id}`,
    {
      responseType:"blob",
    }
  );


  const pdfBlob = new Blob(
    [response.data],
    {
      type:"application/pdf"
    }
  );


  return URL.createObjectURL(pdfBlob);

};