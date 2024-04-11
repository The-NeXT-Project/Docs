## Overview

SSPanel-UIM is a typical PHP web application that requires the following server programs to work properly

* HTTP server. For performance reasons we recommend Nginx deployment.
* A PHP script to run the program. The current version of SSPanel-UIM is developed and tested on PHP version 8.3.
* MySQL-like database. We recommend using the latest LTS version of MariaDB. The current version of SSPanel-UIM is developed and tested on MariaDB version 11.2.
* Redis key-value pair database, mainly used for storing non-persistent data to reduce MariaDB performance consumption. The current version of SSPanel-UIM was developed and tested based on Redis version 7.2.

At the code level, SSPanel-UIM uses Slim Framework 4.x as the backend framework, Smarty 5.x and Twig 3.x template engines to provide front-end template rendering, and Composer to manage third-party components.

## System Configuration Requirements

SSPanel-UIM can run on relatively low configuration Linux systems, but for performance reasons, we recommend at least 2GB of system memory for OPcache and database to reduce disk IO consumption.

Note that many of SSPanel-UIM's built-in features rely on services such as Github/Cloudflare to work properly, and deploying SSPanel-UIM in an abnormal network environment (i.e. China, Iran, Vietnam, and other dictatorships that impose strict censorship on the Internet) may result in some or all of the features being disabled, and therefore it is not recommended that SSPanel-UIM is deployed on a Linux system with a relatively low configuration. SSPanel-UIM is not recommended for deployment in these countries.
