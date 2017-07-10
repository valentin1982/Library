package library.objects;


import library.dao.interfaces.BookDAO;
import library.entities.Author;
import library.enums.SearchType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import library.entities.Book;

import java.util.List;

import static library.enums.SearchType.*;

@Component("libraryFacade")
@Scope("singleton")
public class LibraryFacade {

    private static final String FIELD_CONTENT = "content";


    @Autowired
    private BookDAO bookDAO;

    @Autowired
    private SearchCriteria searchCriteria;

    private List<Book> books;


    public List<Book> getBooks() {
        if (books == null){
            books = bookDAO.getBooks();
        }
        return books;
    }

    public void searchBooksByGenre() {
        books = bookDAO.getBooks(searchCriteria.getGenre());
    }

    public void searchBooksByText() {

        switch (searchCriteria.getSearchType()){
            case TITLE:
                books = bookDAO.getBooks(searchCriteria.getText());
                break;
            case AUTHOR:
                books = bookDAO.getBooks(new Author(searchCriteria.getText()));
                break;
        }

    }

    public void searchAllBooks() {
        books = bookDAO.getBooks();
    }

    public byte[] getContent(long id){
        return (byte[])bookDAO.getFieldValue(id, FIELD_CONTENT);
    }



}
