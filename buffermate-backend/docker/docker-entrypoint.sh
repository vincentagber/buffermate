#!/bin/sh
set -e

# If arguments are provided (e.g. queue:work or artisan command), execute them directly
if [ "$#" -gt 0 ]; then
    exec "$@"
fi

# Web Server Mode (Nginx + PHP-FPM)
export PORT="${PORT:-8001}"
echo "==> Configuring Nginx on port: ${PORT}"

# Substitute dynamic $PORT into Nginx configuration
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf

# Ensure permissions on runtime writable storage
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

# Production optimization caching if APP_ENV is production and APP_KEY exists
if [ "$APP_ENV" = "production" ] && [ -n "$APP_KEY" ]; then
    echo "==> Caching Laravel routes and events..."
    php artisan route:cache || true
    php artisan event:cache || true
fi

echo "==> Starting PHP-FPM..."
php-fpm -D

echo "==> Starting Nginx on port ${PORT}..."
exec nginx -g "daemon off;"

