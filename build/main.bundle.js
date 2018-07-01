'use strict';

self.addEventListener('load', function () {
    var isFirstTime = true;
    var openDataBase = function openDataBase() {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
        }

        return idb.open('currency', 1, function (upgradeDb) {
            var store = upgradeDb.createObjectStore('currency', {
                keyPath: 'id'
            });
        });
    };

    var dBPromise = openDataBase();
    var getCurrency = function getCurrency() {
        return fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(function (res) {
            return res.json();
        }).then(function (myJson) {
            return myJson.results;
        }).then(function (data) {
            dBPromise.then(function (db) {
                if (!db) return;
                var tx = db.transaction('currency', 'readwrite');
                var store = tx.objectStore('currency');
                for (var curr in data) {
                    store.put(data[curr]);
                }
            });
            initilizeCurrencyList(data, 'from_currency', 'USD');
            initilizeCurrencyList(data, 'to_currency', 'TZS');
        }).catch(function () {
            showCachedCurrency();
        });
    };

    var showCachedCurrency = function showCachedCurrency() {
        dBPromise.then(function (db) {
            if (!db) {
                var storedObjects = db.transaction('currency').objectStore('currency');
                return storedObjects.getAll().then(function (storedCurrency) {
                    initilizeCurrencyList(storedCurrency, 'from_currency', 'USD');
                    initilizeCurrencyList(storedCurrency, 'to_currency', 'TZS');
                });
            }
        });
    };

    var initilizeCurrencyList = function initilizeCurrencyList(currency, selectId, selectedCurrency) {

        var select = document.getElementById(selectId);
        for (var curr in currency) {
            var option = document.createElement('option');
            option.value = curr.id ? curr.id : curr;
            option.text = curr.id ? curr.id : curr;
            if (curr == selectedCurrency) option.selected = "selected";
            select.appendChild(option);
        }
    };

    var convertCurrency = function convertCurrency(rate, rateString) {
        var val = rate[rateString].val;

        var inputMoney = document.getElementById('input_money').value;
        var outPutMoney = inputMoney * val;
        document.getElementById('output_money').value = outPutMoney;
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

    var registerSw = function registerSw() {
        if (!navigator.serviceWorker) return;
        navigator.serviceWorker.register('./sw.js').then(function (reg) {
            return reg;
        }).catch(function (err) {
            return err;
        });
    };
    registerSw();
    getCurrency();
    showCachedCurrency();
});
