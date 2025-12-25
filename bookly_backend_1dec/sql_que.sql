show databases;
drop database booksdb;
create database booksdb;
create database teamb;
use booksdb;
use rfpdb;




show tables;
desc reviews;
select * from alembic_version;
desc users;
SHOW TABLES FROM booksdb;
select * from users;
select * from books;
select * from tags;
select * from booktag;
SET SQL_SAFE_UPDATES = 0;

UPDATE users SET role = TRIM(role);

SET SQL_SAFE_UPDATES = 1;

truncate table users;

-- truncate work so deisbale save mode and use delete--   

SET SQL_SAFE_UPDATES = 0;
DELETE FROM users;
SET SQL_SAFE_UPDATES = 1;



truncate table books;




