#!/usr/bin/env node

'use strict';

var fs = require('fs');
var inputTxt = String(fs.readFileSync('input.txt')), addressesJson = { "list": [] };
var configJson = JSON.parse(fs.readFileSync('./config.json'));

var filters = {};
if (typeof configJson.iparse.filter.cityCode != "undefined") {
  filters.cityCode = configJson.iparse.filter.cityCode.split(",");
}
if (typeof configJson.iparse.filter.cityName != "undefined") {
  filters.cityName = configJson.iparse.filter.cityName.split(",");
}
inputTxt = inputTxt.split("\n");

var dataSet = {}, propsDone = {}, propName = "", secondVal = false;
for (var i = 0; i < inputTxt.length; i++) {
    if (inputTxt[i].length > 0) {
        dataSet = {};
        propsDone = { "name": false, "addr": false, "city": false, "tel": false, "fax": false, "mail": false };
        
        do {
            var prop = "";
            if (inputTxt[i].indexOf("Tel") !== -1) {
                prop = "tel";
            } else if (inputTxt[i].indexOf("Fax") !== -1) {
                prop = "fax";
            }
            if (prop !== "") {
              propsDone[prop] = true;
              var tmp = inputTxt[i].split(" "), number = "", numberActive = false;
              for (var n = 0; n < tmp.length; n++) {
                if (tmp[n].substring(0, 1) === "0") {
                    numberActive = true;
                }
                if (numberActive === true) {
                    number += tmp[n];  
                }
              }
              dataSet[prop] = number;
            } else if (inputTxt[i].indexOf("Mail") !== -1) {
              propsDone.mail = true;
              dataSet.mail = String(inputTxt[i].split(":")[1]);
              dataSet.mail = dataSet.mail.trim();
            } else if (propsDone.name === false) {
              propsDone.name = true;
              dataSet.name = inputTxt[i];
            } else if (propsDone.addr === false) {
              propsDone.addr = true;
              var tmp = inputTxt[i].split(" "), street = "";
              for (var n = 0; n < tmp.length - 1; n++) {
                if (n > 0) street += " ";
                street += tmp[n];  
              }
              dataSet.addr = { "street": street, "number": tmp[n]};
            } else if (propsDone.city === false) {
              propsDone.city = true;
              var tmp = inputTxt[i].split(" ");
              dataSet.city = { "code": tmp[0], "name": tmp[1] };
            }
            i++;
        } while (typeof inputTxt[i] != "undefined" && inputTxt[i].length > 0);
        
        var conditionMatched = "", conditionLt = false, conditionGt = false, filterMatchCount = 0;
        if (filters !== {}) {
          for (var fPropName in filters) {
            filterMatchCount = filterMatchCount + filters[fPropName].length;
            conditionLt = false;
            conditionGt = false;
            for (var m = 0; m < filters[fPropName].length; m++) {
              if (typeof dataSet.city !== "undefined") {
                if (fPropName =="cityName" && filters[fPropName][m].toLowerCase() == dataSet.city.name.toLowerCase()) {
                  conditionMatched = conditionMatched + "=";
                }
                if (fPropName =="cityCode" && filters[fPropName][m].length > 0) {
                  var str = filters[fPropName][m];
                  if (str.substring(0,1) == ">") conditionGt = true;
                  if (str.substring(0,1) == "<") conditionLt = true;
                  if (str.substring(0,1) == ">" && parseInt(dataSet.city.code) > parseInt(filters[fPropName][m].substring(1))) {
                    conditionMatched = conditionMatched + ">";
                  } else if (str.substring(0,1) == "<" && parseInt(dataSet.city.code) < parseInt(filters[fPropName][m].substring(1))) {
                    conditionMatched = conditionMatched + "<";
                  } else if (dataSet.city.code.toLowerCase() == filters[fPropName][m].toLowerCase()) {
                    conditionMatched = conditionMatched + "=";
                  }
                }
              }
            }
          }
        }
        if (conditionMatched.length == filterMatchCount) addressesJson.list.push(dataSet);
    }
}

fs.writeFileSync("addresses.json", JSON.stringify(addressesJson));