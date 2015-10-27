#!/usr/bin/env node

'use strict';

var fs = require('fs');
var addressesJson = JSON.parse(fs.readFileSync('./addresses.json'));

var swig  = require('swig');
var template = swig.compileFile('mail.tpl');

var mailsData = { "list": [] };
for (var i = 0; i < addressesJson.list.length; i++) {
    var output = template({
        name: addressesJson.list[i].name,
        requestsCount: addressesJson.list.length
    });
    var data = {
        "text": output,
        "address": addressesJson.list[i]
    };
    mailsData.list.push(data);
}
fs.writeFileSync("mails.json", JSON.stringify(mailsData));