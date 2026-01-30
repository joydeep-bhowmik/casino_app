## ⚠️ This project is incomplete and was left midway through development. Some games are fully functional, while others may be unfinished or unstable.
# Casino App Setup Guide 

To successfully run the casino app, follow these organized steps :

## Step 1: Start a Web Server

Turn on any web server of your choice, such as XAMPP or WAMP.

## Step 2: Set Up Database

In the root folder of the project, locate the `.env` file and edit the `DB_DATABASE` variable to match the desired name for your database (e.g., `casino_app`).

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=casino_app
DB_USERNAME=root
DB_PASSWORD=
```

## Step 3: Create Database

Create a database named `casino_app` in your MySQL server. You can use a database management tool or the command line to create the database.

## Step 4: Migrate Database

Run the following command to create the necessary tables in the database:

```bash
php artisan migrate
```

## Step 5: Clear Cache

Run the following commands to clear cache:

```bash
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:clear

```

## Step 6: Serve the App

Run the following command to start serving the Laravel app:

```bash
php artisan serve
```

## Step 7: Start Node.js Server

Run the following command to serve the Node.js server:

```bash
npm run dev
```

## Step 8: Start Websocket Server

Run the following command to start webscoket server

```bash
php artisan websockets:serve
```

## Step 9: Access the App

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your web browser to access the casino website.
