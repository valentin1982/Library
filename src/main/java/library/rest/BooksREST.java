package library.rest;

import library.dao.interfaces.BookDAO;
import library.entities.Author;
import library.entities.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BooksREST {

    @Autowired
    private BookDAO bookDAO;

    @RequestMapping(value = "/books/all",
            method = RequestMethod.GET,
            headers = "Accept=application/json")
    public List<Book> getAll() {
        return bookDAO.getBooks();
    }

    @RequestMapping(value = "/books/name/{name}",
            method = RequestMethod.GET,
            headers = "Accept=application/json")
    public List<Book> getBooksByName(@PathVariable("name") final String name) {
        return bookDAO.getBooks(name);
    }

    @RequestMapping(value = "/books/author/{name}",
            method = RequestMethod.GET,
            headers = "Accept=application/json")
    public List<Book> getBooksByAuthor(@PathVariable("name")
                                           final String name) {
        return bookDAO.getBooks(new Author(name));
    }

}
