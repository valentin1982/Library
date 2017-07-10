package library.dao.interfaces;


import library.entities.Author;
import library.entities.Book;
import library.entities.Genre;

import java.util.List;


public interface BookDAO {

    List<Book> getBooks();
    List<Book> getBooks(Author author);
    List<Book> getBooks(String bookName);
    List<Book> getBooks(Genre genre);
    Object getFieldValue(Long id, String fieldName);

}
