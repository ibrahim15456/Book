import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";
import fs from "fs";

// قراءة ملف db.json الموجود في جذر المشروع
const rawData = fs.readFileSync("./db.json", "utf8");
const data = JSON.parse(rawData);

// استخراج الكتب سواء كانت في مصفوفة مباشرة أو داخل مفتاح books
const books = data.books || data; 

async function uploadData() {
  try {
    for (const book of books) {
      // تم تغيير "books" إلى "BOOKS" لتطابق تماماً ما أنشأته في Firebase
      await addDoc(collection(db, "BOOKS"), book);
      console.log(`Uploaded: ${book.title || "Book"}`);
    }
    console.log("🎉 All books uploaded successfully to Firebase BOOKS collection!");
  } catch (error) {
    console.error("Error uploading data: ", error);
  }
}

uploadData();