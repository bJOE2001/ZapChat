#!/bin/sh
set -e
cd /var/www/html
php artisan migrate --force
php artisan storage:link --force || true
exec apache2-foreground
