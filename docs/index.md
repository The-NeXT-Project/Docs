---
sidebar_position: 1
---

# Introduction

## Overview

NeXT Panel is a typical PHP web application that requires the following server programs to work properly

* HTTP server. For performance reasons we recommend Nginx as the web server.
* A PHP script runtime to run the program. The current version of NeXT Panel is developed and tested on PHP version 8.5.
* MySQL-like database. We recommend using the latest LTS version of MariaDB. The current version of NeXT Panel is developed and tested on MariaDB version 12.1.
* Redis key-value pair database, mainly used for storing non-persistent data to reduce IOPS on the main Database. The current version of NeXT Panel was developed and tested based on Redis version 8.0(Valkey, an open-source Redis fork should work as well).

At the code level, NeXT Panel uses Slim Framework 4.x as the backend framework, Eloquent as the database ORM, Smarty 5.x and Twig 3.x template engines to provide html template rendering, and Composer to manage third-party libraries and dependencies.

## Performance

NeXT Panel can run on relatively low-performance Linux systems, but for user experience reasons, we recommend at least 2GB of available system memory for OPcache and database to use, reducing disk IO consumption.

## Architecture

![Architecture](/img/system-architecture.svg)

## Where to go next

You are | Start at
---------|----------
Setting up a new site | [Installation](installation/docker.md), then [Configuration](systems/configuration.md)
Running a site | [Admin Guide](admin-guide/index.md)
Using a site someone else runs | [User Guide](user-guide/index.md)
Trying to understand why something behaves the way it does | [How It Works](systems/index.md)
Writing a node backend | [Server API V1](design-document/server-api.md)
