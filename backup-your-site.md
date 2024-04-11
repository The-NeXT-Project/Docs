## Using B2 Cloud Storage

Before you can use this script you need to sign up for a [B2 Cloud Storage](https://www.backblaze.com/b2/cloud-storage.html) account and then create a Bucket and application key.

First download the script

```bash
wget https://raw.githubusercontent.com/M1Screw/Airport-toolkit/master/b2_backup.sh
chmod +x b2_backup.sh
```

Initialize the script

```bash
. /b2_backup.sh init
```

Download the default configuration file

```bash
wget https://raw.githubusercontent.com/M1Screw/Airport-toolkit/master/b2_backup_config
```

Modify the configuration in it, then change the configuration file to an appropriate name, such as sspanel_backup_config, put it in the same directory as the script, and then run the script

```bash
. /b2_backup.sh backup sspanel_backup_config
```

You can also add the backup task to a cron timer

```
1 0 * * * /usr/bin/bash /path/to/script/b2_backup.sh backup sspanel_backup_config
```
