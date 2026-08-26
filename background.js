const UNINSTALL_URL = 'https://bitek.fr';

chrome.runtime.setUninstallURL(UNINSTALL_URL, () => {
    if (chrome.runtime.lastError) {
        console.error('Unable to configure the uninstall URL:', chrome.runtime.lastError.message);
    }
});
