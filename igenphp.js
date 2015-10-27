#!/usr/bin/env node

'use strict';

var fs = require('fs');
var mailsJson = JSON.parse(fs.readFileSync('./mails.json'));
var configJson = JSON.parse(fs.readFileSync('./config.json'));

var swig  = require('swig');
var template = swig.compileFile('php.tpl');

var dataList = [];
for (var i = 0; i < mailsJson.list.length; i++) {
    if (typeof mailsJson.list[i].address.mail != "undefined") {
        dataList.push(
          { "email": mailsJson.list[i].address.mail, "text": mailsJson.list[i].text }
        );
    } else {
        dataList.push(
          { 
              "address": mailsJson.list[i].address
          }
        );
    }
}
var output = template({
    senderEmail: configJson.igenphp.senderEmail,
    subject: configJson.igenphp.subject,
    dataList: dataList
});
fs.writeFileSync("mailall.php", output);