select book.name, author.fio from library_it.book
  left join author ON book.author_id = author.id
  left join genre ON book.genre_id = genre.id
where genre.id = 23;

select book.name, author.fio, genre.name from library_it.book
  left join author ON book.author_id = author.id
  left join genre ON book.genre_id = genre.id
where genre.id = 23;