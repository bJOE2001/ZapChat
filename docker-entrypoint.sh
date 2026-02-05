#!/bin/sh
set -e
cd /var/www/html
php artisan migrate --force
exec apache2-foreground
