import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { upload } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyBy3Rd06HEb-iULUdGEZBU69hAnWbt-ZxQ",
  authDomain: "portfolio-project-uploader.firebaseapp.com",
  projectId: "portfolio-project-uploader",
  storageBucket: "portfolio-project-uploader.appspot.com",
  messagingSenderId: "377612912241",
  appId: "1:377612912241:web:581e120b35e67125c0fdd0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage();

upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", ".gif", ".svg"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + "%";
          const block = blocks[index].querySelector(".preview-info-progress");
          block.textContent = percentage;
          block.style.width = percentage;
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Download URL", downloadURL);
          });
        }
      );
    });
  },
});
