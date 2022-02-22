//console.log('getorg');

var orgIdClassic = (typeof SFDCSessionVars != 'undefined') && SFDCSessionVars.oid;
/*var orgIdLightning = window.aura && window.aura.storageService && window.aura.storageService.op && window.aura.storageService.op.substring(0,15);
if (window.aura && window.aura.storageService && window.aura.storageService.$isolationKey$) {
	orgIdLightning = window.aura.storageService.$isolationKey$.substring(0,15);
}*/
//console.log('orgIdClassic:', orgIdClassic, ', orgIdLightning:', orgIdLightning);

var orgId = orgIdClassic || extractOrgIdInLightning();
console.log('SFOrgBookmarks: orgId:', orgId);

if (orgId) {
	// insert data to body element
	var bodyElem = document.getElementsByTagName('body')[0];
	bodyElem.setAttribute('org-id', orgId);
	

	// send event
	var evt = new Event('orginfoInjected');
	document.dispatchEvent(evt);
}

function extractOrgIdInLightning() {
	if (window.aura && window.aura.storageService) {
		for (var key in window.aura.storageService) {
			var value = window.aura.storageService[key];
			var valuePrefix = value.substring && value.substring(0,3);
			if (valuePrefix && valuePrefix == '00D') {
				//console.log(key, valuePrefix);
				return value.substring(0,15);
			}
		}
	}
}

