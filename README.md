# plmailgen
People List Mail Generator

## Preparation
Change the script "iparse" entry in **package.json** to your needs.
Espacially you can change the filter parameters. Afterwards, remove all first .tpl file 
extensions, e.g. mail.tpl.tpl to mail.tpl and open config.json afterwards.

config.json, properties:
* iparse.filter.cityName = string
* iparse.filter.cityCode = string ('code' or '>code' or '<code' or '>code, <code')
* igenphp.senderEmail = string
* igenphp.subject = string

Finally you can change the email text in the mail.tpl file. You can define further variables
for the template in imails.js inside of var output = template(...).

## Dependencies
Install command: npm install

## Run
* Parse input.txt to json, command: npm run-script iparse
* Generate E-Mail Text snippets and additional data to json, command: npm run-script imails
* Generate php-script to get a mailer script (mailall.php): npm run-script igenphp
 

(c) Martin 'yokumo' Kelm, 2015