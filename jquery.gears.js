/**
 jquery.gear - jQuery plugint for init Gears
 @author Aleksandr Beshkenadze (http://beshkenadze.net)
 @version $Id: $Rev$ $Date$ $Author$
 **/
jQuery.gears = function(factory){
    if($.gears.init()){
        return jQuery.gears.factory(factory);
    }else{
        return false;
    }
};
jQuery.gears.factory = function(factory){
    return google.gears.factory.create(factory)
}
jQuery.gears.init = function(){
    if (window.google && google.gears) {
        // if have gears
        return true;
    }
    var factory = null;
    if (jQuery.browser.mozilla) {
        try{
			factory = new GearsFactory();
		}catch(e){
			return false;
		}
    }
	else if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
		factory = document.createElement("object");
        $(factory).css('display','none')
		.width(0)
		.height(0)
		.attr('type','application/x-googlegears');
        document.documentElement.appendChild(factory);
	}else if (jQuery.browser.msie) {
        try{
			factory = new ActiveXObject('Gears.Factory');
            // privateSetGlobalObject is only required and supported on WinCE.
            if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
                factory.privateSetGlobalObject(this);
            }
		}catch (e){
			return false;
		}
    }
    else if (jQuery.browser.safari) {
    	factory = document.createElement("object");
        $(factory).css('display','none')
		.width(0)
		.height(0)
		.attr('type','application/x-googlegears');
        document.documentElement.appendChild(factory);
    }
    else if (jQuery.browser.opera) {
        alert('Oops, Opera user :(');
        return;
    }
    else {
        return;
    }
    if (!window.google) {
        google = {};
    }
    if (!google.gears) {
        google.gears = {
            factory: factory
        };
    }
    return $(this);
};