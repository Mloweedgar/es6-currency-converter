self.addEventListener('load', () => {
    const isFirstTime = true;
    const openDataBase = () => {
        if (!navigator.serviceWorker) {
            return Promise.resolve();
          }

          return idb.open('currency', 1, (upgradeDb) => {
              let store = upgradeDb.createObjectStore('currency', {
                  keyPath: 'id'
              });
          });

    };

    const dBPromise = openDataBase();
    const getCurrency = () =>fetch('https://free.currencyconverterapi.com/api/v5/currencies')
    .then(res => res.json())
    .then(myJson => myJson.results)
    .then(data => {
        dBPromise.then((db) => {
            if (!db) return;
            let tx = db.transaction('currency', 'readwrite');
            let store = tx.objectStore('currency');
            for (let curr in data) {
                store.put(data[curr]);
            }
        });
        initilizeCurrencyList(data, 'from_currency', 'USD');
        initilizeCurrencyList(data, 'to_currency', 'TZS');

       
        
    }).catch(() => {
        showCachedCurrency();
    });

    const showCachedCurrency = () => {
        dBPromise.then((db) => {
            if(!db) {
                let storedObjects = db.transaction('currency')
                .objectStore('currency')
                return storedObjects.getAll()
                .then((storedCurrency) => {
                    initilizeCurrencyList(storedCurrency, 'from_currency', 'USD');
                    initilizeCurrencyList(storedCurrency, 'to_currency', 'TZS');
                });
            }
          
        });
    };

    const initilizeCurrencyList = (currency, selectId, selectedCurrency) => {

    let select = document.getElementById(selectId);
    for (let curr in currency) {
        let option = document.createElement('option');
        option.value = curr.id ? curr.id : curr;
        option.text = curr.id ? curr.id : curr;
        if(curr == selectedCurrency) option.selected = "selected";
        select.appendChild(option);
    }
    };

    const convertCurrency = (rate, rateString) => {
    let {val} = rate[rateString];
    let inputMoney = document.getElementById('input_money').value;
    let outPutMoney = inputMoney * val;
    document.getElementById('output_money').value = outPutMoney;
    };

    const onConvert = () =>{
    let from = document.getElementById('from_currency').value;
    let to = document.getElementById('to_currency').value;
    let rateString = `${from}_${to}`;
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${rateString}&compact=y`;
    fetch(url)
    .then(res => res.json())
    .then(data => convertCurrency(data, rateString));   
    };

    const registerSw = () => {
    if(!navigator.serviceWorker) return;
    navigator.serviceWorker.register('./sw.js')
    .then(reg => reg)
    .catch(err => err);
    }
    registerSw();
    getCurrency();
    showCachedCurrency();
});