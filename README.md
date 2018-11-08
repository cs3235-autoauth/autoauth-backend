# AutoAuth-Backend

This project uses Express 4 for routing and Flex.Query Processor Library 2 for querying MySQL database.

## Usage

1. Install [MySQL Workbench 8.x CE](https://dev.mysql.com/downloads/workbench/)

2. Create a local MySQL instance that runs at localhost

3. Update your root user credentials at [dbConfig.json](dbConfig.json)

4. Import [autoauth table schema](schema/sys_autoauth.sql) into MySQL

5. Open a terminal in this project directory and run `npm start` to start the server, listening on port 4300

### Code

Main code logic lies [here](routes/services.js).