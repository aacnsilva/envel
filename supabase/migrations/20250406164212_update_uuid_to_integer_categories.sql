ALTER TABLE categories 
ALTER COLUMN id DROP DEFAULT;

ALTER TABLE categories 
ALTER COLUMN id TYPE INTEGER 
USING (id::text::integer);

CREATE SEQUENCE IF NOT EXISTS categories_id_seq;

ALTER TABLE categories 
ALTER COLUMN id SET DEFAULT nextval('categories_id_seq');
