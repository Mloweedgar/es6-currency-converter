'use strict';

var getCurrency = function getCurrency() {
    return fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(function (res) {
        return res.json();
    }).then(function (myJson) {
        return myJson.results;
    }).then(function (data) {
        initilizeCurrencyList(data, 'from_currency', 'TZS');
        initilizeCurrencyList(data, 'to_currency', 'USD');
    });
};

var initilizeCurrencyList = function initilizeCurrencyList(currency, selectId, selectedCurrency) {
    var select = document.getElementById(selectId);
    for (var curr in currency) {
        var option = document.createElement('option');
        option.value = curr;
        option.text = curr;
        if (curr == selectedCurrency) option.selected = "selected";
        select.appendChild(option);
    }
};

var convertCurrency = function convertCurrency(rate, rateString) {
    var val = rate[rateString].val;

    var inputMoney = document.getElementById('input_money').value;
    var outPutMoney = inputMoney * val;
    document.getElementById('output_money').value = outPutMoney;
    console.log(outPutMoney);
};

var onConvert = function onConvert() {
    var from = document.getElementById('from_currency').value;
    var to = document.getElementById('to_currency').value;
    var rateString = from + '_' + to;
    var url = 'https://free.currencyconverterapi.com/api/v5/convert?q=' + rateString + '&compact=y';
    fetch(url).then(function (res) {
        return res.json();
    }).then(function (data) {
        return convertCurrency(data, rateString);
    });
};

getCurrency();
