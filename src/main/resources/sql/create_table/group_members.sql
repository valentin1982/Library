CREATE TABLE IF NOT EXISTS group_members(id BIGINT(20),username VARCHAR(50),  group_id BIGINT(20));
INSERT INTO library_it.group_members (id, username, group_id) VALUES (1, 'admin', 2);
INSERT INTO library_it.group_members (id, username, group_id) VALUES (2, 'user', 1);
