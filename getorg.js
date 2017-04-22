//console.log('getorg');

var orgId = window.location.host;

if (typeof SFDCSessionVars != 'undefined') {
	orgId = SFDCSessionVars.oid;

	// insert data to body element
	var bodyElem = document.getElementsByTagName('body')[0];
	bodyElem.setAttribute('org-id', orgId);
	console.log('org-id:', orgId);

	// send event
	var evt = new Event('orginfoInjected');
	document.dispatchEvent(evt);
}

