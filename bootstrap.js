const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource:///modules/CustomizableUI.jsm');
var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
var stringBundle = Services.strings.createBundle('chrome://My-First-Addon-colors/locale/my-bootstrap.properties?' + Math.random()); // Randomize URI to work around bug 719376
var cssUri; //because the docs say to put this global why? because we use it in shutdown

function install() {}
function uninstall() {}

function startup() {
	//start - use CustomizableUI.jsm to create the widget
	CustomizableUI.createWidget({
	    id: 'rawr_hi_hi',
	    defaultArea: CustomizableUI.AREA_NAVBAR,
	    label: stringBundle.GetStringFromName('my_label'), //ok we want this localized
	    // type: 'button', //we don't need to type this, the default type is button
	    tooltiptext: stringBundle.GetStringFromName('hover-msg'), //lets localize this
	    onCommand: function(aEvent) {
	    	//on click of button lets open our html5 page
	    	//Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow('navigator:browser');
	    	//same as:
	    	//var thisDOMWindow = Services.wm.getMostRecentWindow('navigator:browser');
	    	//oh actuallyes its right here
	        var thisDOMWindow = aEvent.target.ownerDocument.defaultView; //this is the browser (xul) window
	        thisDOMWindow.gBrowser.loadOneTab('chrome://My-First-Addon-colors/content/html5app.xhtml', { inBackground: false, relatedToCurrent: true });
	    }
	});
	//end - use CustomizableUI.jsm to create the widget

	//start - use style sheet service to style our widget to give it an icon
	

	var css = '';
	css += '@-moz-document url("chrome://browser/content/browser.xul") {';
	css += '    #rawr_hi_hi {';
	css += '        list-style-image: url("chrome://My-First-Addon-colors/content/icon16.png")'; //a 16px x 16px icon for when in toolbar
	css += '    }';
	css += '    #rawr_hi_hi[cui-areatype="menu-panel"],';
	css += '        toolbarpaletteitem[place="palette"] > #rawr_hi_hi {';
	css += '        list-style-image: url("chrome://My-First-Addon-colors/content/icon32.png");'; //a 32px x 32px icon for when in toolbar
	css += '    }';
	css += '}';

	var cssEnc = encodeURIComponent(css);
	var newURIParam = {
	    aURL: 'data:text/css,' + cssEnc,
	    aOriginCharset: null,
	    aBaseURI: null
	}
	cssUri = Services.io.newURI(newURIParam.aURL, newURIParam.aOriginCharset, newURIParam.aBaseURI); //store this in a global var so you can call it when removing the widget
	sss.loadAndRegisterSheet(cssUri, sss.AUTHOR_SHEET);
}
 
function shutdown() {
	sss.unregisterSheet(cssUri, sss.AUTHOR_SHEET); //remove the style sheet we applied
	CustomizableUI.destroyWidget('rawr_hi_hi'); //remove the widget
}
