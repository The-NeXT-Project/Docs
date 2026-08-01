# Database Configuration

## Data table design

```sql
CREATE TABLE `config` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `item` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(2048) NOT NULL DEFAULT '',
  `class` varchar(16) NOT NULL DEFAULT '',
  `is_public` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `type` varchar(16) NOT NULL DEFAULT '',
  `default` varchar(2048) NOT NULL DEFAULT '',
  `mark` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `item` (`item`),
  KEY `class` (`class`),
  KEY `is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Table structure

`id` Primary key

`item` Configuration item. Use underscore nomenclature

`value` Configures the item value. Can leave contents empty (not NULL)

`class` Configures the name of the category to which the item belongs, the default value is `default`. 

`is_public` Whether the parameter is public or not

`type` The type of the value, options: `string`, `int`, `bool`, `array`.

`default` The default value for the configuration item.

`mark` Remarks

> Note that if you set the value type to `array`, you need to `json_encode()` when storing and `json_decode()` when reading.

## Code examples

```php
<?php
...
use App\Models\Config;
...

$example_config = 'example';
$example_config_array = [
    'xxx' => '1000',
    'yyy' => '10'
];

// Store
$is_saved = Config::set('example_config', $example_config);
$is_saved_array = Config::set('example_config_array', $example_config_array);

// Read
$config = Config::contain('example_config');
$config_array = json_decode(Config::get('example_config_array'));

// Business logic
...

?>
```

## Methods

Importing with the ``use`` operator.

```php
use App\Models\Config.
```

### obtain

Get the configuration of a single project. Example:

```php
Config::obtain('f2f_pay_app_id');
```

### getClass

Get all values under a certain category, returning an associative array.

```php
Config::getClass('billing');
```

Call these values.

```php
$configs = Config::getClass('billing');

$f2f_pay_app_id = $configs['f2f_pay_app_id'];
$f2f_pay_pid = $configs['f2f_pay_pid'];
```

### getPublicConfig

The method provided for `/src/Services/Config.php` returns all the configuration items marked as public parameters as an associative array.
