package library.dao.impl;

import library.dao.interfaces.GenreDAO;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import library.entities.Genre;

import java.util.List;

@Component
public class GenreDAOImpl implements GenreDAO {

    @Autowired
    private SessionFactory sessionFactory;

    Genre genre;

    @Transactional
    @Override
    public List<Genre> getAll() {

        return sessionFactory
                .getCurrentSession()
                .createCriteria(Genre.class)
                .list();
    }

    @Transactional
    @Override
    public Genre getGenres(Long id) {

        List<Genre> genres = sessionFactory
                .getCurrentSession()
                .createQuery("from Genre where id = ?")
                .setParameter(0, id)
                .list();
        return  genres.get(0);
    }

}
