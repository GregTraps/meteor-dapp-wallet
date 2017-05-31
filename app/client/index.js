Meteor.startup(function() {

    // SET default language
    if(Cookie.get('TAPi18next')) {
        TAPi18n.setLanguage(Cookie.get('TAPi18next'));
    } else {
        var userLang = navigator.language || navigator.userLanguage,
        availLang = TAPi18n.getLanguages();

        // set default language
        if (_.isObject(availLang) && availLang[userLang]) {
            TAPi18n.setLanguage(userLang);
        } else if (_.isObject(availLang) && availLang[userLang.substr(0,2)]) {
            TAPi18n.setLanguage(userLang.substr(0,2));
        } else {
            TAPi18n.setLanguage('en');
        }
    }
    //检查Tokens中是否有UGT,没有则添加
    //记得修改下面Tracker中unicornToken的address
    Meteor.setTimeout(function () {
        var address = '0x9dc1838935e919159259b5ce11df869069e493cd';
            address.toLowerCase().trim();
        var tokenId = Helpers.makeId('token', address);
        // var tips = Tokens.findOne(tokenId) == undefined?'no':'yes';
        // console.log('tokens中是否有UGT'+tips);
        if (Tokens.findOne(tokenId) == undefined){
            Tokens.upsert(tokenId, {$set: {
                address: address,
                name: 'UGT',
                symbol: '🦄',
                balances: {},
                decimals: 4
            }});
        }
    },2000);
});



    // change moment and numeral language, when language changes
    Tracker.autorun(function(){
        if(_.isString(TAPi18n.getLanguage())) {
            var lang = TAPi18n.getLanguage().substr(0,2);
            moment.locale(lang);
            try {
                numeral.language(lang);
            } catch (err) {
                console.warn(`numeral.js couldn't set number formating: ${err.message}`);
            }
            EthTools.setLocale(lang);
        }

        // If on the mainnet, this will add the unicorn token by default, only once.
        if (!localStorage['dapp_hasUnicornToken'] && Session.get('network') === 'main'){
            localStorage.setItem('dapp_hasUnicornToken', true);

            // wait 5s, to allow the tokens to be loaded from the localstorage first
            Meteor.setTimeout(function(){
                var unicornToken = '0x9dc1838935e919159259b5ce11df869069e493cd';
                tokenId = Helpers.makeId('token', unicornToken);
                Tokens.upsert(tokenId, {$set: {
                    address: unicornToken,
                    name: 'UGT',
                    symbol: '🦄',
                    balances: {},
                    decimals: 0
                }});    
            }, 5000);
        }
});