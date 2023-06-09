import React, { useState, useContext } from "react";
import { db } from "../database/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";

export const CourseContext = React.createContext();

export function useCourse() {
  return useContext(CourseContext);
}

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const routerQuery = router.query;

  function addCourse(course) {
    db.collection("courses").add(course);
  }

  function deleteCourse(id) {
    db.collection("courses").doc(id).delete();
  }

  function updateCourse(id, course) {
    db.collection("courses").doc(id).update(course);
  }

  const getCourses = () => {
    // ---- this code listen to every changes in firebase
    // onSnapshot(
    //   collection(db, "courses"),
    //   (querySnapshot) => {
    //     console.log("Total de cursos: ", querySnapshot.size);
    //     const coursesData = [];
    //     querySnapshot.forEach((doc) => {
    //       coursesData.push({ ...doc.data(), id: doc.id });
    //       console.log(doc.data());
    //     });
    //     setCourses(coursesData);
    //     console.log(coursesData);
    //   }
    // );

    // ---- this code do not listen to every changes in firebase
    getDocs(collection(db, "courses")).then((querySnapshot) => {
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ ...doc.data(), id: doc.id });
        console.log(doc.data());
      });
      setCategories(coursesData);
      console.log(coursesData);
    });
  };

  React.useEffect(() => {
    getCourses();
  }, []);

  const value = {
    courses,
    addCourse,
    categories,
    deleteCourse,
    updateCourse,
    getCourses,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}