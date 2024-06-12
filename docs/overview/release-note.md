---
sidebar_position: 3
---

# Release Note

## 24.3.0

Database version `2024052400`

### What's Changed
* Ticket LLM reply feature now uses whole ticket content(include title) as LLM context input
* Fixed an issue that prevents Stripe gateway trigger an HX-Redirect event in frontend
* Now gateway service will use the invoice's price value as paylist amount instead of using value input from the Ajax request
* Now gateway service will return an error when the invoice ID is invalid(invoice doesn't exist)
* Fixed an issue that will cause incorrect price data to be used in the Stripe gateway
* Now when an order price is 0, it will directly enter the activation queue instead of waiting for invoice payment

### What's New
* LLM service now supports context input
* New Webhook setup feature for PayPal gateway, and use webhook event to mark invoice's payment
* Added Hiddify Next to client download service

## 24.2.0

Database version `2024052400`

### What's Changed

* Removed deprecated WebAPI value
* LLM-related configs have been moved to DB
* Adjusted LLM default request parameters to avoid unwanted behavior
* Fixed a value error in the admin node page
* Fixed an issue that prevents the page from refreshing after the invoice is paid by balance(partial or full)

### What's New

* Custom status code has been supported in ResponseHelper's error function
* New /dc command in Telegram Bot to detect user telegram account datacenter
* More user jQurey Ajax requests have been replaced with Htmx and the related endpoints have been updated

## 24.1.0

Database version `2024052400`

### What's Changed

* Fixed an issue that could cause duplicate payments to be made and cause invoices to fail to be marked as paid via the gateway
* Now overpaid amount via the gateway will be refunded to the user's balance
* Use the new NeXT Panel OTA API endpoint to check the panel update
* Adjusted Invoice view page style to avoid user confusion
* Fixed an issue that prevented user password requests from being sent, thus failing to reset the password

## 24.0.0

Database version `2024052400`

### What's Changed

* Better handling of payment gateway exceptions
* Fixed an issue that could result in the Username not being properly displayed in the Telegram Bot
* Bump DiceBear avatar to v8
* Refactored built-in updateGeoIP2 feature, removed potentially compromised dependency
* Set Telegram Bot Webhook feature has been moved to `admin/setting/im` and Webhook Token can no longer be manually configured
* Replace default PNG format NeXT Panel Logos with SVG images to save bandwidth
* Simplified email templates and improved finance email styling
* Simplified User interface, remove several unnecessary dedicated info pages from the `/user` route
* Added spoiler effect on the frontend to hide sensitive user information
* Updated default LLM model IDs in the `config/.config.example.php`
* Fixed an issue that could result in the Stipe checkout session not being properly created

### What's New

* New SysLog service for centralized operation log management
* Added Clash Desktop client-specific headers to the Clash universal subscription service
* User balance top-up and partial payment of invoice @pplulee
* New I18n service for panel localization
* Now Telegram Bot notification messages are localized based on the site's default language setting
* New unified User Group notification feature to send group notifications to multiple channels(Telegram/Discord/Slace) at the same time
* reCAPTCHA Enterprise support has been added to the captcha service
* Now Site Announcement & Documentation can be configured with custom sort order and hide/pinned for end users

> Note the following releases are legcy versions of the panel, and they do not exist in the current github repository.

## 2024.1

Database version `2024040500`

### What's Changed

* Fixed issue with traffic multiplier page reporting error when user has no available nodes
* Fixed issue with jQuery duplicate binding elements in front-end templates.
* Updated download source for Clash Verge client.
* Fixed missing type conversions in the Stripe gateway.
* Added indexes to more tables to improve query performance.
* Fixed an issue that caused duplicate node communication keys when duplicating nodes.
* Fixed an issue where the GeoIP2 service would not return the IP city name correctly.
* Removed MD5 as a way to store user passwords.
* Use cryptographically secure random strings instead of UUIDv4 for user API Token.
* Simplified the implementation of the datasheet component, streamlining the front-end code
* Database query times will now be rounded to two decimal places.
* Cron will now skip the email queue if the EmailQueue datasheet is empty.
* Now user email verification code button will be disabled after clicking send.
* Fixed a problem with the random character generation function not being able to generate odd length random characters @pplulee
* Added more tests to avoid the random character generation function not generating odd length random characters.
* EPay will now generate a payment link and jump to it instead of transmitting the order data to the payment gateway through the frontend @pplulee
* EPay will now correctly return to the user's billing page
* Fixed an issue where coupon code types were not displayed correctly
* Simplified the default Clash configuration to reduce the amount of data sent and improve the performance of the subscription interface.

### What's New

* New installations of SSPanel-UIM will now not perform a migration to an older version of the database.
* New Gemini LLM backend.
* New Vertex AI LLM backend.
* New Anthropic LLM backend.
* Added support for database read/write separation configurations
* Refactored Alipay Payment in Person gateway
* Refactored Stripe gateway
* WebAPI will now stop sending users who exceed the online IP count limit.
* New Mailchimp mail service
* New Alibaba Cloud DM mail service.
* Added support for dual-stack nodes
* Refactored Shadowsocks 2022 user key generation now only returns user keys that match the protocol format specification.
* Added the ability to automatically remove inactive user subscriptions and invite links.
* Updated Eloquent ORM (Illuminate\Database) to v11
* A separate MariaDB driver is now used in Eloquent ORM.
* Updated Datatables to v2
* Added indication of node dual-stack network connectivity in the user panel.
* xcat now resets today's used traffic.
* Added ability to cancel pending orders and refund to user's balance
* New hCaptcha CAPTCHA service
* Updated Smarty to v5
* Refactored email suffix filtering
* Updated TinyMCE to v7
* New bill type field
* Refactored global rate limiting service, now supports independent single IP rate limiting per Endpoint.

## 2023.7

Database version `2024012700`

### What's Changed

* WebAPI now returns the msg field correctly, and the data field no longer contains an error message.
* Removed Cloudflare PHP SDK, which is no longer supported upstream, and removed features related to automated Cloudflare parsing updates; R2 client downloads are unaffected.
* Refactored the node IP address update function, now the node modification page no longer supports manually entering the node IP.
* Removed unused values from the database and optimized the table structure.
* Unified subscription system entrance, now both traditional subscription and general subscription use the subscription link starting with /sub/ to access.
* Users can now only query dynamic multipliers for nodes less than or equal to the account level.
* Users with banned/abnormal account status will now not be able to earn invitation rewards
* Simplified user front-end templates to avoid loading unnecessary JS files
* User login, registration and password reset pages have been refactored using Htmx.
* WebAPI now no longer accepts data reports from nodes in deactivated state
* Minimum PHP running version for panels is now 8.2 due to upstream dependency updates.
* sing-box universal subscriptions are now compatible with the latest 1.8 version of the kernel.
* Refactored server-side data table backend with support for data sorting and content searching.
* Refactored hourly traffic logging feature, users can now check their daily traffic usage statistics.

### What's New

* Added Cloudflare Workers AI LLM backend.
* Added PHP 8.3 unit test, now SSPanel-UIM is fully compatible with PHP 8.3 version.
* Added Twig template service in preparation for i18n integration.
* Json Universal Subscription v4
* Added Linear calculation for dynamic multiplicity.
* Universal Subscription now supports V2Ray Json V5 subscription distribution.
* Clash Meta (mihomo) for Android has been added to the client download.
* Node Edit page now supports node used traffic reset.
* xcat has added commands to reset all node traffic and reset all user login passwords.
* New rewards service, replacing the old system of invitations and signups.

## 2023.6

Database version `2023102200`

### What's Changed

* Nodes in a subscription are now sorted normally in `node level - node name`` order
* Simplified the triage settings in the default Clash configuration by removing duplicate items and sorting them.
* WebAPI added the detection of Hostname, when the Hostname does not match the webAPIUrl configuration, the request will be rejected.
* Fixed the problem that the administrator's background modification of time/traffic packages reported an error because of the existence of null values.
* Simplified the Telegram Bot implementation in the current panel in preparation for adding a new Bot.
* Refactored the site data analysis service to remove function calls and numeric calculations from the front-end template files in preparation for replacing the Twig template engine.
* Invalid user login attempts are now logged in the login log.
* Refactored the database configuration page in the administrator backend to reduce code duplication and improve maintainability.
* Fixed Trojan protocol transport configurations in the subscription system, so that subscriptions can now properly send transport plugin configurations other than gRPC.
* Removed values in WebAPI that are scheduled to be phased out in version 2023.6.
* Fixed the Stripe gateway implementation to remove unnecessary parameters.
* Replaced the native Curl implementation with GuzzleHttp, simplifying the way it is configured and reducing the amount of code needed for the feature.
* Cookies now use SHA3-256 as the default encryption method, which is much faster than SHA256 on modern hardware with instruction set acceleration support.
* Replaced jQuery ajax code in most user panels with Htmx to reduce the size of frontend templates.
* Fixed system page `check for updates` button color error caused by upstream front-end library update.
* PHP yaml extension implemented in C to replace symfony/yaml as the export tool for the Yaml format, improving the performance of the Clash generic subscription interface in case of large data volumes.
* Fixed an issue that could cause the administrator's backend node management page to report an error under certain circumstances.
* Added more path legality checks in Slim Router to avoid invalid routing data being sent to the backend.
* All Models now have full value names and their type hint, IDEs such as PHPStrom will be able to correctly detect the data in the Model and its type.
* HTTPUpgrade transport support has been added, and is now supported by sing-box and Clash.Meta(R.I.P) kernels in the latest beta.
* Universal Subscription now supports sing-box subscription distribution.
* SFA and SFM clients added to the client download feature.
* TUIC and Shadowsocks2022 node types have been added.
* New settings for jsDelivr Endpoint in the configuration file.
* Settings for traffic and subscription logs can now be managed through the database-based configuration system.
* New switch for user login logging.
* New feature to send notification messages when a user subscribes or logs in to a site with a new IP address.
* New integrated exchange rate service
* New option to encrypt user passwords with SHA3-256.
* Images can now be inserted in the usage document
* New default language setting for user registration in preparation for i18n integration
* New dynamic multiplier service
* Added unit tests for PHP 8.1 and PHP 8.3 in preparation for PHP 8.3 release.
* New authentication device option in Cookie Authentication, if turned on it will verify that the user is accessing the site from the same device as the one they used to log in.

## 2023.5

Database version `2023082000`

### What's Changed

* Refactored backend for user profile editing functionality
* Fixed a possible cache value conflict issue.
* Refactored the user subscription record function to prepare for later user account risk control related functions.
* Fixed a bug that Postal mail backend reported errors in newer PHP environments.
* Clearer separation of front-end and back-end, in preparation for the replacement of the Twig template engine.
* Refactored most of the Models to use a unified time format interface to improve code maintainability.
* Fixed the problem that the "Remember this device" option on the login page is invalid.
* Reconfigured the Multi-Factor Authentication (MFA) system, in preparation for adding more multi-factor authentication methods.
* Fixed the problem that daily traffic report cannot be sent through IM service properly.
* Fixed the problem that SendGrid mail backend does not work properly.
* Refactored Telegram Bot service in preparation for adding more Bot services.
* Servers that are running out of traffic are now hidden instead of being marked with a yellow status flag.
* User accounts will now no longer go into an expired state, but will be marked as inactive when certain conditions are met.
* Fixed an issue where the black/white list restriction feature for user account emails was not working properly under certain circumstances.
* Refactored subscription system, new subscriptions can now be added in a separate Class file, reducing the amount of code changes required to add subscription support.

### What's New

* Added Google PaLM 2 and Hugging Face Inference API as Large Language Model (LLM) backends.
* New User Documentation Center
* Automatic generation of user documentation using LLM.
* Site operators can now protect site operations from malicious users with account exceptions.
* Monthly quota for work order submission per user.
* New site status page for administrators
* Online check panel updates
* Instant Messaging (IM) Service
* Users can now bind IM accounts via OAuth instead of sending CAPTCHA.
* New Discord, Telegram, and Slack IM backends.
* New integrated notification service

## 2023.4

Database version `2023071000`

### What's Changed

* Creating an administrator account will set the account port generation based on the site's random port instead of using port 1025
* Fixed an issue where WebAPI's ETag was incorrectly formatted, causing it to be removed by the Cloudflare CDN.
* Use xxh64 instead of crc32c as the Etag generation algorithm to improve performance in arm64 environments (requires PHP 8.1+).
* Replaced sendDailyMail value with daily_mail_enable to set user's daily mail reception settings.
* The xcat ClientDownload command must now be executed by the same user as its file owner.
* Remove the node_connector value from the user table and download in WebAPI (use 0 instead), use node_iplimit to limit the number of IPs the user has online.
* Removed the mu_only value from the node table and the downstreaming in WebAPI (use 0 instead).
* Optimized the design of data tables, adjusted some value types, added indexes for some tables, removed the use of default NULL values, improved query performance and reduced database storage consumption.
* Removed the idle user cleanup function
* fixed the specific circumstances of non-administrative users to access the administrator path will not normally trigger the 302 redirection problem
* Fixed the problem that the mail style is displayed abnormally in some clients.
* Fixed the problem that the user's last login time is not properly recorded.
* Use DiceBear to replace Gravatar as the user avatar provider.
* Use Redis instead of MariaDB as storage backend for email authentication/password reset/Telegram binding keys.
* Fixed part of fuck.js implementation.
* Fixed a bug that coupon codes don't work properly when they don't have an expiration date.
* Fixed the problem that coupon codes can't be used when they don't have an expiration date.
* Coupon codes can now be set to limit the total number of times they can be used.
* Admin Coupon Code screen will show the total number of times each coupon code has been used.
* Telegram Bot can now send messages in Html and MarkdownV2 formats.
* New product types of Time Pack and Traffic Pack have been added.
* Inactive user detection has been added.
* The administrator home page now shows the inactivity of site accounts.
* Added Cloudflare R2-based client downloads.
* Added Rate Limit feature for WebAPI and user subscription system.
* Site operators can now customize the length of user subscription links.
* New ability to clear all user subscription links in xcat Tool (xcat Tool clearSubToken)
* New unit tests for code generated automatically using GPT-4 (let's be realistic, no human programmer likes writing unit tests)
* Site operators can now set separate expiration dates for email verification codes and email reset password links.

## 2023.3

Database version `2023050800`

### What's Changed

* Replaced last_day_t field with transfer_today in the user data table to more accurately count users' daily usage.
* Removed Dummy WebAPI
* Fixed an issue where the CAPTCHA module would still try to load if the user was unable to sign in.
* Fixed an issue where using a CAPTCHA with login authentication enabled would cause the frontend to report an error.
* Fixed a tabler 1.0.0-beta18+ version of the environment in the site theme display exception.
* fixed a problem that affects the display of the user's daily mail receiving settings.
* Adjusted the theme's css to replace style code that will be deprecated in Bootstrap 6.
* Fixed an issue that caused the Stripe gateway file to not load properly.
* Client download feature uses Clash Verge instead of Clash for Windows as the default Windows/MacOS/Linux client to better support the Clash.
Meta kernel. * Rewritten the traffic auto-conversion feature so that the panel now displays traffic data up to 1YB properly.
* Fixed a bug that coupon codes were not properly applied to orders when no expiration time was set.
* Rewritten the Invitation Code Registration function.
* Fixed a bug which may cause the node on/offline notification to be sent repeatedly for timed tasks.
* Fixed an issue that affects the normal distribution of generic subscription Clash types under certain circumstances.

### What's New

* Turnstile CAPTCHA theme now follows the user's darker mode setting.
* New Cron system
* Databaseization of settings related to daily task execution times and financial statement emails.
* Redone site 404/405/500 and staff pages using tabler theme.
* Users visiting the order creation page without logging in will now be redirected to the login/registration page and redirected to the previous order creation page after completing the login/registration.

## 2023.2

Database version `2023032600`

### What's Changed

* Fixed Trojan node transport configuration downgrade exception in Clash generic subscription @kleinrui
* Fixed missing exception handling and strict data types in legacy subscriptions.
* Fixed an issue where Sentry error reporting was not enabled properly.
* Fixed an issue that could cause CAPTCHA to not display properly on the front-end
* Adjusted the way CAPTCHA blocks are displayed in front-end templates
* Telegram Webhook can now be turned off by disabling the Telegram feature.
* Fixed the issue that user invitation records could not be displayed properly with logged out user records.
* The user account information page now shows the IP address of the account that is currently online.
* Preliminary support for Clash.Meta related configurations.
Meta related configurations * Fixed the problem that Telegram Bot could not be initialized properly @Irohaede
* Fixed the issue that the account password reset function does not work.
* xcat Job CheckJob is now merged into xcat Cron.
* Fixed an issue where the user invitation record page reported an error @zesai
* New PayPal payment gateway
* Alipay PayPal is now compatible with the new store system.
* Fixed a bug that some pages still try to load IP database when Maxmind key is not configured.
* Removed the site registration limit check when registering in the administrator backend.
* New work order auto-reply function based on OpenAI GPT language model.
* Fixed the problem that node offline detection does not work properly.
* New user balance record page
* Users can now recharge their account balance through gift cards.
* Fixed an issue where some buttons were not displayed properly on mobile devices.
* Fixed a problem that may cause daily tasks to get stuck and abnormally consume system resources
* reworked the system mail template, streamlined the template file size
* Fixed a text error in the administrator background @yaoyao1128
* Fixed the user edit page ajax and administrator background page part of the button event listener @yaoyao1128
* fixed the administrator background user edit page of the traffic related to the display and its description text.
* Fixed the problem that the invitation system doesn't work properly in the new store system.
* Fixed the problem that the user balance record cannot be added properly when the user balance is modified through Telegram Bot.

## 2023.1

Database version `2023032600`

### What's Changed

* Fixed the problem with the display of the cancel button for admin bills
* Gateway order number (if any) is now displayed on the admin billing details page
* Reworked revenue statistics feature, now calculated based on Paylist records instead of order records from the old store system
* New User Balance Usage Record feature
* Paylist now records the name of the gateway used to make the payment (currently only works with EPay).
* Reworked financial email functionality that also uses Paylist records to calculate revenue.
* Removed most of the legacy code from the old store system, and will completely remove the old store's renewal logic in version 2023.2.
* Fixed an issue in the activation logic of the new store system that could cause a user's order to be unavailable even after activation.
* Customized sender names are now supported in the Mailgun mail system @0xMagicCoder
* New switch for legacy subscription system to allow operators to decide if they need to be compatible with clients like v2rayN that still use protocol exclusive subscriptions
* Work order related settings are now databaseized
* More invalid value detection and front-end hints have been added to product creation, product editing, node creation, and node editing pages to avoid problems caused by some operators' pet peeve of not liking to fully populate the form
* Moved some of the values of Clash Universal Subscription to appprofile for operators to customize the distribution configuration.
* Unified IP database interface
* Use Maxmind GeoLite2 free database as default IP database, operators need to configure Maxmind API key to update properly.
* New per IP user online IP statistics @Irohaede.
* Rewritten some Models methods to improve code quality.
* The composer.lock file will now be provided in the repo to ensure the same version of dependencies for each version.
* Adjusted the cleanup time of the data table in the daily task.
* Maxmind GeoLite2 multi-language support suggestion by @lmfcc
* Fixed URL issue with password reset button on user profile edit page.
* User uuid and api_token will now be generated based on UUIDv4.
* Removed residual links from the old store system.
* Fixed missing TOS consent box check during registration
* Fixed some Telegram message sending exceptions not being handled correctly.
* Reworked Sentry error reporting and telemetry.
* Fixed 500 page returning 500 error.
* Fixed an issue where node up/down detection was not working.

## 2022.12.1

Database version `2023030500`

### What's Changed

* Adjusted the types of some data table values to optimize query performance
* New Clash type subscription in generic subscription system
* Added api_token field in user table for future admin/user RESTful API system.
* New legacy subscription system for clients still using protocol exclusive subscriptions such as v2rayN.
* Added a new node_iplimit field to the user table to replace the node_connector field, which had no meaning and was used to limit the total number of IP connections for a user.
* Optimized the node online user function to reduce unnecessary database queries and improve node page access performance.
* New administrator gift card feature
* Removed ShadowsocksR related code and improved support for Shadowsocks 2022 series encryption.
* Fixed issue with Trojan grpc Clash subscription distribution @KorenKrita.
* Added the ability to get the IPv6 address of a node @KorenKrita
* Added a new store system switch for users on the admin user settings page
* Fixed an issue that could cause SSPanel-UIM sites to be batch scanned and recognized.
* Users' passwords are encrypted with bcrypt by default.
* New store system, including product/order/billing components.
* Reset the built-in SSPanel-UIM and payment gateway icons with waifu2x.
* New SIP002 subscription distribution with Shadowsocks plugin support.
* New coupon code system, support multiple types of coupon codes, new user only, per user, and more accurate expiration time settings.
* Updated Slim framework for panels to version 4 @Irohaede.
* New database migration system @Irohaede.
* update.sh script now supports updating to a specific version.
* Fixed GA related functionality and renamed it to MFA (Multi-Factor Authentication) system.
* Fixed an issue that would cause financial emails to not be sent in PHP 8.1+ environments
* Reworked the admin database settings page, now each sub-function has its own page and backend.
* Moved some configuration items in config.php to the database, now they can be modified in the backend.
* Fixed the problem of displaying user subscription logs.
* Added a new switch to display various types of user logs
* Optimized the performance of the user profile page, and the user homepage now uses Stash as the iOS client by default.
* Added support for the Postal open source mail system @pplulee.
* Optimized the performance of user invitation page
* The sign-in button is now disabled and the captcha element is removed when a user signs in on the home page.
* New unified Cron system (currently contains only logic related to the new store system)
* Admin invitations and auditing pages are adapted to the tabler theme, simplifying the related code
* Optimized code using automation tools to improve readability and performance in OPcache environments.
* Improved cookie security by using sha256 to calculate the signature of user cookies.
* Enabled cookie-related security settings in PHP to force HTTPS access and reduce the risk of XSS attacks.
* Fixed a potential arbitrary code execution issue.

## 2022.12

### What's Changed

* Fixed a node page display issue
* Added user ban display and set ban reason.
* Fixed an issue with the header UI of a page.
* tabler theme adapts to admin home/user/node/work order/announcement/online IP/login log/subscription log/traffic log.
* Fixed an issue that caused custom_config not to be saved.
* Updating qqwry.dat is now done directly via update.sh.
* Reworked the logic of the work order system so that it now stores each work order in a single column.
* Used Bootstrap 5 theme datasheet in tabler theme.
* Reworked the ajax logic of all data tables that have been adapted to the tabler theme's interface, simplifying the code and reducing the difficulty of subsequent maintenance.
* Added node_iplimit and webapi to the user table to prepare for the new store system.
* Shadowsocks 2022 series encryption has been added to the user selectable encryption methods.
* panels now use the noindex meta tag to completely avoid being indexed by search engines (as long as search engines respect this parameter)
* Captcha system now has a new option of Extreme Verification Behavioral Authentication 4.0, replacing the old Extreme Verification Captcha feature that was removed in the previous version.
* In some of the background pages with large amount of data, a simplified version of the Server Side data table implementation has been added to improve access performance, while the rest of the page data table still adopts client-side mode to reduce the database request.
* Fixed some problems caused by historical reasons.
Note: The code for the Store Redo section of the development branch has not yet had time to be fully verified, and in order to avoid impacting site usage (especially when it comes to the financial system), this feature, along with the planned subscription system update, will be made available in a separate 2022.12.1 Release.

## 2022.11

### What's Changed

* Added user hourly traffic logging feature
* Fixed a binding error when Telegram username is empty.
* Optimized the display of daily emails.
* Added tabler theme and adapted the user center, login, and registration interfaces.
* Updated the Universal Subscription system to version 2, with clearer parameters and removal of SSR sends.
* Updated the generic subscription system to version 2, using clearer parameters and removing the SSR sends.
* Cleaned up a lot of redundant and useless JavaScript scripts in the theme to reduce unnecessary resource consumption.
* Added system level dark theme support, now it has been adapted to the tabler theme, users can switch in the drop-down menu with one click.
* Fixed the user email modification logic in tabler theme.
* General subscriptions will now use subUrl and remove hardcoded URLs from the default configuration.
* A new user/server portal has been added to the tabler theme, providing users with a clearer and more straightforward display of node status.
* A new ServerController has been added to the backend in preparation for rewriting the node configuration display and distribution.
* Used Cloudflare Turnstile instead of Google reCaptcha as the default Captcha provider, optimizing the experience and protecting user privacy.
* Reworked the logic of the Captcha system in preparation for GeeTest v4.
* Optimized ETag generation and optimized WebAPI performance @Irohaede.
* Removed issue with WebAPIs that did not require a node ID to update, now all related WebAPI requests must include a valid node_id.
* Fixed potential security risks in WebAPI and improved related functionality.
* The user password reset page now supports Captcha protection.
* Fixed an issue that caused registration to fail when the invitation code passed by the front-end was empty during registration.
* Updated panel dependencies, including many important functionality and security fixes.
* Optimized some display details in the tabler theme.

## 2022.10

### What's Changed

* Changed qqwry.dat download source, now the innocent IP library can be updated properly
* Use crc32c to calculate Etag, which reduces API performance consumption.
* Changed some php function calls to fully-qualified, which can further improve performance with OPcache.
* Reworked the node performance status function to drastically reduce the number of SQL queries generated by the user's node list page (~50% reduction)
* Added "WebAPI-ETAG" response header to solve the problem of CDNs like Cloudflare forcibly removing ETag from returned data.
* Material Design Icons are used by default in the admin panel and registration/login pages, using more logical icons.
* Fixed an issue that caused an error in the xcat Update migration configuration.
* Migrated some xcat Update functions to update.sh.
* Added a new switch to select the payment channel for the Rainbow Easy Pay gateway.
* Cleaned up the repo code that had been remoteized in preparation for adding new themes.
* Reworked the mail queue feature to send all scheduled emails using the mail queue.
* Merged daily mail delivery instructions with daily tasks and fixed their functionality.
* update.sh now cleans up useless branches and tags to reduce server space usage
* Fixed AWS SES API sender functionality, which can now be enabled with a single click in the Settings Center.
* xcat ClientDownload now reads configuration files from config/clients.json, making customization easier.
* Organized redundant code in preparation for future panel refactoring.

## 2022.9

### What's Changed

* New one-click install & update scripts
* Fixed Telegram Bot built into the panel @RoromoriYuzu
* Removed old Telegram Bot
* Updated client list in xcat ClientDownload
* Optimized ClientDownload function on User Panel homepage.
* Fixed Trojan gRPC protocol download @iamsaltedfish
* Removed broken payment gateways.
* Use Country Flags API to realize country flag display.
* Databaseized user registration settings
* Reworked panel's random character generation logic, now uses openssl_random_pseudo_bytes to generate random strings of arbitrary lengths
* Rewrote all string validation methods to avoid cases where `999.999.999.999` is determined to be a valid IPv4 address.
* Reworked the backend address of some user edit pages to use more explicit variable naming.
* Fixed a potential XSS issue
* The jsoneditor used for node customization is now in code editor mode by default, allowing you to copy the entire json for configuration with a single click.
* The icons on the admin panel home page are now implemented using Chart.js, replacing CanvasJS to avoid potential copyright issues.
* Added support for the gRPC API, and a new communication key reset function for nodes.
* Added support for gRPC API and communication key reset for nodes in xcat Tool.
* Adjusted the style of the node page to improve visibility, and added the node type display.
* User panel now uses Material Design Icons by default, using more logical icons.
* Outdated settings are now detected and deleted when importing general settings.
* Updated Smarty template engine to 4.x to support deployment in PHP 8+ environments.
* Updated version of js dependency library
