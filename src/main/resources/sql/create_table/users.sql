CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50),
  password VARCHAR(100),
  enabled  TINYINT(4)
);
INSERT INTO library_it.users (username, password, enabled)
VALUES ('admin', '$2a$10$1ndVOB9gD0UeGZd1gVmWau4VTAsJobjYJ.dbAHSiM1tnO8ml6lX.2', 1);
INSERT INTO library_it.users (username, password, enabled)
VALUES ('user', '$2a$10$oE.JYCEnrUVnrTaxskZt3uolOGlDg/kt5xw1fzjZCA4RDZHZSYrMS', 1);
