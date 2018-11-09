# AutoAuth-Backend

This project uses Express 4 for routing and Flex.Query Processor Library 2 for querying MySQL database.

## Required Installs

Both MySQL Server and MySQL Workbench is required.

MySQL Server

1. Download [MySQL Installer Community 8.x](https://dev.mysql.com/downloads/windows/installer/8.0.html)

2. Select MySQL Server 8.0 to install

3. Follow on-screen instructions to install and proceed with default settings (enter your choice of root password for your MySQL instances when prompted in one of the screens)

4. Update your root user password at [dbConfig.json](dbConfig.json)

MySQL Workbench

1. Install [MySQL Workbench 8.x CE](https://dev.mysql.com/downloads/workbench/)

2. Double-click "Local instance MySQL80"

3. Go to "Server" Menu > Data Import > "Import from self-Contained File" > open [autoauth table schema](schema/sys_autoauth.sql)

## Usage

Run `npm start` to start the server, listening on port 4300

### Code

Main code logic lies [here](routes/services.js).