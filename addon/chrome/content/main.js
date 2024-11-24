Components.utils.import('resource://gre/modules/devtools/Console.jsm');

function goNoop() { }

function goClose() {
    close();
}

function goSetEnv() {
    let prefs = Components.classes['@mozilla.org/preferences-service;1'].
                getService(Components.interfaces.nsIPrefBranch);

    let homepage = prefs.getCharPref('browser.startup.homepage');

    let perm = Components.classes["@mozilla.org/permissionmanager;1"].
                createInstance(Components.interfaces.nsIPermissionManager);

    let ios = Components.classes["@mozilla.org/network/io-service;1"].
        getService(Components.interfaces.nsIIOService);

    let uri = ios.newURI(homepage, null, null);

    if (perm.testPermission(uri, 'desktop-notification') !== perm.ALLOW_ACTION) {
        perm.add(uri, 'desktop-notification', 1);

        console.log('Se autorizaron notificationes', homepage);
    }

    document.addEventListener('popupshowing', function (e) {
        if (e.target && e.target.id === 'notification-popup') { // Evita el cuadro de recordar contraseña
            e.preventDefault();
        }
    }, false);
}

function goStartup() {
    goSetEnv();
    BrowserStartup();
}
