//console.log('contentscript');
//console.log(window.umps_config);
var orgId = null;

// add script to the page to send org id from local js
function injectScript(file, node) {
      var th = document.getElementsByTagName(node)[0];
      var s = document.createElement('script');
      s.setAttribute('type', 'text/javascript');
      s.setAttribute('src', file);
      th.appendChild(s);
 }
injectScript( chrome.extension.getURL('getorg.js'), 'body');

// listen to event of org id
document.addEventListener('orginfoInjected', function(e){
	var bodyElem = document.getElementsByTagName('body')[0];
	orgId = bodyElem.getAttribute('org-id');
	//console.log('SFOrgBookamrks: orgId:', orgId);
}, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	//console.log('content: got message:', request);
  	if (request == 'getOrgId' && orgId) {
		sendResponse(orgId);
  	}
});