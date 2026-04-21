create table users (
  id serial primary key unique,
  name text,
  phone text not null,
  email text,
  title text,
  picture text
);
