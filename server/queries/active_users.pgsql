SELECT id, first_name, last_name, username, email, created_at, last_updated
FROM users
WHERE is_verified=True AND is_banned = FALSE;