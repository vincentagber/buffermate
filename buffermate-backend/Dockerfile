# ------------------------------------------------------------------------------
# Production Dockerfile for BufferMate Backend (Laravel 11 PHP 8.3)
# Target Host: https://app.helicarrier.xyz/
# ------------------------------------------------------------------------------

FROM php:8.3-cli-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    curl \
    git \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite-dev \
    postgresql-dev \
    linux-headers

RUN docker-php-ext-install pdo pdo_sqlite pdo_pgsql opcache pcntl bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

COPY . .

# Ensure storage and bootstrap cache permissions
RUN chmod -R 775 storage bootstrap/cache

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8001

EXPOSE 8001

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8001"]
