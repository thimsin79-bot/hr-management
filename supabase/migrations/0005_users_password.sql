alter table users add column if not exists password text;

-- Set default password for existing users
update users set password = 'admin123' where password is null or trim(password) = '';