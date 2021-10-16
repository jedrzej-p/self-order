## 1. Instalacja globalna composer (jeśli nie ma, sprawdzenie: composer -V):
https://getcomposer.org/doc/00-intro.md#installation-windows
Restart terminali.
## 2. Instalacja globalna laravel (jeśli nie ma, sprawdzenie: laravel -V):
composer global require "laravel/installer"
## 3. Instalacja node js
https://nodejs.org/en/download/
## 4. Ustawienie konfiguracji w pliku: .env
Pola:
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
Można też uzupełnić pozostałe ustawienia konfiguracyjne.
## 5. Instalacja zależności na podstawie composer.json. Wewnątrz folderu z projektem:
composer install
## 6. Wygenerowanie klucza aplikacji:
php artisan key:generate

Potem można wykonać polecenia:
php artisan config:cache
php artisan config: clear
## 7. Załadowanie bazy danych:
php artisan migrate
## 8. Załadowanie danych do bazy (seed):
php artisan db:seed
## 9. Instalacja wszystkich paczek za pomocą polecenia:
npm install
## 10. Instalacja kluczy autoryzacji:
php artisan passport:install
## 11. Warto przed odpaleniem strony odpalić polecenia:
php artisan config:cache
php artisan config: clear
## 12. Wykonanie polecenia:
npm run dev
## 13. Wejście na stronę:
komenda - php artisan serve
