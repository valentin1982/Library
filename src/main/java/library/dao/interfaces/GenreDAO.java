package library.dao.interfaces;


import library.entities.Genre;

import java.util.List;

public interface GenreDAO {

    Genre getGenres(Long id);
    List<Genre> getAll();


}
