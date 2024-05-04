# Database Configuration

## Data table design

```sql
CREATE TABLE `config` (
  `id` int(11) NOT NULL COMMENT '主键',
  `item` text NOT NULL COMMENT '项',
  `value` text NOT NULL COMMENT '值',
  `class` varchar(16) NOT NULL DEFAULT 'default' COMMENT '配置分类',
  `is_public` int(11) NOT NULL DEFAULT 0 COMMENT '是否为公共参数',
  `type` text NOT NULL COMMENT '值类型',
  `default` text NOT NULL COMMENT '默认值',
  `mark` text NOT NULL COMMENT '备注'
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
use App\Models\Setting;
...
$recharge_limit = array(
    'max_recharge_limit' => '1000',
    'min_recharge_limit' => '10'
);

// Store
$config = Setting::where('item', 'recharge_limit')->first();
$config->value = json_encode($recharge_limit);
$config->save();

// Read
$config = Setting::contain('recharge_limit');
$recharge_limit = json_decode($config->value, true); // array

// Business logic
...

?>
```
## Methods

Importing with the ``use`` operator.

``php
use App\Models\Setting.
```

### obtain

Get the configuration of a single project. Example:

``` php
Setting::obtain('f2f_pay_app_id');
```

### getClass

Get all values under a certain category, returning an associative array.

```php
Setting::getClass('f2f');
```

Call these values.

```php
$configs = Config::getClass('f2f');

$f2f_pay_app_id = $configs['f2f_pay_app_id'];
$f2f_pay_pid = $configs['f2f_pay_pid'];
```

### getPublicConfig

The method provided for `/src/Services/Config.php` returns all the configuration items marked as public parameters as an associative array.
