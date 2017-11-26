//console.log('getorg');

var orgIdClassic = (typeof SFDCSessionVars != 'undefined') && SFDCSessionVars.oid;
var lightningDataJson = JSON.stringify()
var orgIdLightning = window.aura && window.aura.storageService && window.aura.storageService.op && window.aura.storageService.op.substring(0,15);
if (window.aura && window.aura.storageService && window.aura.storageService.$isolationKey$) {
	orgIdLightning = window.aura.storageService.$isolationKey$.substring(0,15);
}
//console.log('orgIdClassic:', orgIdClassic, ', orgIdLightning:', orgIdLightning);

var orgId = orgIdClassic || orgIdLightning;

if (orgId) {
	// insert data to body element
	var bodyElem = document.getElementsByTagName('body')[0];
	bodyElem.setAttribute('org-id', orgId);
	//console.log('SFOrgBookmarks: org-id:', orgId);

	// send event
	var evt = new Event('orginfoInjected');
	document.dispatchEvent(evt);
}

