import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../services/firebase";

import CheckAuthentication from "../components/CheckAuthentication";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import UploadFile from "../components/UploadFile";
import { Alert } from "../services/Alert";

export default function CreateCompany() {
  const companyNameRef = useRef();
  const [uploadedFile, setUploadedFile] = useState(null);
  const params = useParams();
  const storage = getStorage();
  const [error, setError] = useState(false);

  const createCompany = (e) => {
    e.preventDefault();

    if (uploadedFile !== null) {
      const imagePath = `${companyNameRef.current.value}/${uploadedFile.name}`;
      const storageRef = ref(storage, imagePath);
      uploadBytesResumable(storageRef, uploadedFile).then((res) => {
        getDownloadURL(res.ref).then((url) => {
          try {
            addDoc(collection(db, "companies"), {
              name: companyNameRef.current.value,
              created: Timestamp.now(),
              image: url,
            });
          } catch (err) {
            alert(err);
          }
        });
      });
      Alert("top-end", "success", "Company created successfully", 2000);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <CheckAuthentication>
      <Layout title="Admin Panel - company create">
        <Sidebar />
        <div className="create-company">
          <form onSubmit={createCompany}>
            <input
              required
              ref={companyNameRef}
              type="text"
              placeholder="Enter company name"
            />
            <UploadFile
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
            {error && <div>Picture reqired</div>}
            <button className="button">Create</button>
          </form>
        </div>
      </Layout>
    </CheckAuthentication>
  );
}
