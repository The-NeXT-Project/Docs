---
sidebar_position: 4
---

# Release Note (OSS Edition)

## 24.5.1

Database version `2024061600`

### What's Changed

* Fixed an issue that prevents PayPal gateway popup from being displayed

## 24.5.0

Database version `2024061600`

### What's Changed

* Now the user will able to set frontend theme mode to `auto`, which means the theme will follow whatever preferred theme(dark/light) put in their browser
* Now locale value will be passed to the template to encode html content correctly
* Fixed an issue that could prevent the admin billing setting from being saved
* Refactored database config system, now it can properly support array type data(it will be converted to JSON string when saving to DB)
* Added I18n-related unit tests
* Now, the I18n service will dynamically return the locale list from what's available in the system
* Admin user edit page has been revamped, more useful information has been added, and deprecated value has been removed
* Now admin can change each user's locale setting individually

### What's New

* Added auto dark mode in the public pages(/auth/login, /password/reset etc.)
* New Resend email service

## 24.4.0

Database version `2024061600`

### What's Changed

* Simplified admin db config controller, prepare for future htmx refactor
* Now all pricing data in the database is using decimal(12,2) as its data type to avoid float number conversion issue
* More indexes have been added to the user table, improving query performance
* Speedlimit for user and node now using int as its data type, the minimal speed limit is now 1Mbps
* Added missing traffic rate checks, the node's maximum traffic rate is capped at 999.99x
* Now each invoice can only have one paylist record associated with it

### What's New

* Added Clash Nyanpasu to the client download service
* New AWS Bedrock LLM backend
* Added dev mode cookie setting

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
