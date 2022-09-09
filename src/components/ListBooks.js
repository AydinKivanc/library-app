import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const ListBooks = (props) => {
  const [books, setBooks] = useState(null); // books statein kendisi, setBooks ise statei güncellemek için kullanacağımız fonksiyon
  const [categories, setCategories] = useState(null); // categories statein kendisi, setCategories ise statei güncellemek için kullanacağımız fonksiyon
  const [didUpdate, setDidUpdate] = useState(false); // didUpdate dependices olarak verilerek LSMetodlardaki ComponentDidMounth simule edilir.
  useEffect(() => {
    // 2 parametre alir 1. yapilacak is fonksiyon ()=> {} ,  2. si dependicies []
    axios
      .get("http://localhost:3010/books")
      .then((res) => {
        //console.log(res);
        setBooks(res.data); // setBooks fonksiyonu ile books stateini güncelledik. Kitaplar burada cekilmis oldu ve books stateine atildi.

        axios
          .get("http://localhost:3010/categories")
          .then((res) => {
            //console.log(res);
            setTimeout(() => {
              setCategories(res.data); // setCategories fonksiyonu ile categories stateini güncelledik. Kategoriler burada cekilmis oldu ve categories stateine atildi.
            }, 500); // loading i ekranda gorebilmek icin 0.5 saniye bekletiyoruz
          })
          .catch((err) => console.log("categories error", err));
      })
      .catch((err) => console.log("books error", err));
  }, [didUpdate]); // didUpdate her degistiginde useEffect tekrar calisir

  const deleteBook = (id) => {
    //console.log(id);  // silinecek kitabin id si
    //console.log(`http://localhost:3010/books/${id}`); // silinecek kitabin id si
    axios
      .delete(`http://localhost:3010/books/${id}`)
      .then((res) => {
        console.log(res);
        setDidUpdate(!didUpdate); // ! didUpdate stateini degistiriyoruz ve useEffect tekrar calisir
      })
      .catch((err) => console.log(err));
  };

  if (books === null || categories === null) {
    return <Loading />;
  }

  return (
    <div className="container my-5">
      <div className="my-3 d-flex justify-content-end">
        <Link to="/add-book" className="btn btn-primary">
          Add Book
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Book Name</th>
            <th scope="col">Author</th>
            <th scope="col">Category</th>
            <th scope="col" className="text-center">
              ISBN
            </th>
            <th scope="col" className="text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {
            books.map((book) => {
              const category = categories.find(
                (cat) => cat.id === book.categoryid
              ); // categories stateinden, books categoryId ile eşleşen id li kategoriyi bulduk. Altta ekrana bastik {category.name}.
              // Yukarida if blogunda categories state i daha cekilmediginden null mu diye kontrol koymaz isek hata aliriz. categories === null

              return (
                <tr key={book.id}>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{category.name}</td>
                  <td className="text-center">
                    {book.isbn === "" ? "-" : book.isbn}
                  </td>
                  <td>
                    <div
                      className="btn-group d-flex justify-content-center "
                      role="group"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteBook(book.id)} // silme butonuna tiklandiginda deleteBook fonksiyonununa tiklanan book.id yi gonderiyoruz
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) // books.map(book => () )     ( ) return olarak calisir ve icinde JSX dondurur   /  { } yazarsak icine return ( JSX ) doner
          }
        </tbody>
      </table>
    </div>
  );
};
export default ListBooks;
