const getCurrency = () =>fetch('https://free.currencyconverterapi.com/api/v5/currencies')
.then(res => res.json())
.then(myJson => myJson.results)
.then(data => {
    initilizeCurrencyList(data, 'from_currency', 'USD');
    initilizeCurrencyList(data, 'to_currency', 'TZS');
});

const initilizeCurrencyList = (currency, selectId, selectedCurrency) => {
    let select = document.getElementById(selectId);
    for (let curr in currency) {
        let option = document.createElement('option');
        option.value = curr;
        option.text = curr;
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