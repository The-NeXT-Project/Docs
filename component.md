## Overview

NeXT Panel is a typical PHP web application that requires the following server programs to work properly

* HTTP server. For performance reasons we recommend Nginx deployment.
* A PHP script to run the program. The current version of NeXT Panel is developed and tested on PHP version 8.3.
* MySQL-like database. We recommend using the latest LTS version of MariaDB. The current version of NeXT Panel is developed and tested on MariaDB version 11.2.
* Redis key-value pair database, mainly used for storing non-persistent data to reduce MariaDB performance consumption. The current version of NeXT Panel was developed and tested based on Redis version 7.2.

At the code level, NeXT Panel uses Slim Framework 4.x as the backend framework, Eloquent as the database ORM, Smarty 4.x and Twig 3.x template engines to provide front-end template rendering, and Composer to manage third-party components.

## System Configuration Requirements

NeXT Panel can run on relatively low configuration Linux systems, but for performance reasons, we recommend at least 2GB of system memory for OPcache and database to reduce disk IO consumption.
