# ------------------------------------------------------------------------------
# Production Dockerfile for BufferMate Backend (Laravel 11 / PHP 8.3-FPM + Nginx)
# Tailored for Render Web Services, Background Workers & Cron Jobs
# ------------------------------------------------------------------------------

FROM php:8.3-fpm-alpine

# Set non-interactive environment
ENV DEBIAN_FRONTEND=noninteractive

# Install system utilities, web server, and build libraries
RUN apk add --no-cache \
    nginx \
    gettext \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    oniguruma-dev \
    sqlite-dev \
    postgresql-dev \
    linux-headers

# Install & configure PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pdo_sqlite \
        pdo_mysql \
        opcache \
        pcntl \
        bcmath \
        zip \
        mbstring \
        exif \
        gd

# Install Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies (leverage Docker layer caching)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-progress \
    --no-scripts

# Copy application code
COPY . .

# Run post-autoload dump
RUN composer dump-autoload --optimize --no-dev

# Setup Nginx template and entrypoint
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Ensure storage directories exist with appropriate permissions
RUN mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Default environment configurations
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV PORT=8001

EXPOSE 8001

ENTRYPOINT ["docker-entrypoint.sh"]
