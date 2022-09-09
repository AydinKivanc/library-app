import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const AddBookForm = () => {
  let navigate = useNavigate(); // ! eger kitap eklendiyse navigate ile anasayfaya yonlendirecegiz
  const [categories, setCategories] = useState(null);
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    // Select in icine kategorileri cekmek icin useEffect kullandik
    axios
      .get("http://localhost:3010/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log("categories error", err));
  }, []);

  if (categories === null) {
    return <Loading />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookName === "" || author === "" || categoryId === "") {
      alert("Please fill in all fields");
      return;
    } // return ile if blok undaki islemi tamamlayip cikariz
    //console.log(bookName, author, isbn, categoryId); // save button a tiklandiginda yani form submit oldugunda console da yazdiriyoruz
    const newBook = {
      id: new Date().getTime(), // Math.floor(Math.random() * 1000),  // alternatif id yi random olarak olusturmak icin
      name: bookName,
      author: author,
      isbn: isbn,
      categoryid: categoryId,
    };
    //console.log(newBook); // newBook objesini console da yazdiriyoruz
    axios
      .post("http://localhost:3010/books", newBook)
      .then((res) => {
        console.log("Add book response ", res);
        // alert("Book added successfully");
        setBookName("");
        setAuthor("");
        setIsbn("");
        setCategoryId("");
        navigate("/"); // ! navigate ile anasayfaya yonlendiriyoruz
      })
      .catch((err) => console.log("books error", err));
  };

  return (
    <div className="container my-5">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Author Name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>
        <div className="row my-5">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
          <div className="col">
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" selected disabled hidden>
                Select Category
              </option>
              {categories.map((cat, index) => {
                return (
                  <option key={index} value={cat.id}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-50">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
