
CREATE TABLE IF NOT EXISTS group_authorities(group_id BIGINT (20), authority VARCHAR(50));
INSERT INTO library_it.group_authorities (group_id, authority) VALUES (2, 'ROLE_ADMIN');
INSERT INTO library_it.group_authorities (group_id, authority) VALUES (2, 'ROLE_USER');
INSERT INTO library_it.group_authorities (group_id, authority) VALUES (1, 'ROLE_USER');
