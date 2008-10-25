/**
 * @author <a href="mailto:beshkenadze@gmail.com">Александр Бешкенадзе</a>
 * @description jquery.gear - jQuery плагин для работы с Gears
 * @version $Id: $Rev$ $Date$ $Author$
 */
/**
    Старт Gears
    @constructor
    @returns {Boolean} Успешно ли стартовал Gears.
    @example
    var timer = $.gears('beta.timer');
    if(timer){
    	timer.setTimeout(function() { $('div p').html('Hello, from the future! (call from timer)'); },1000);
    }else{
    	$.gears.install();
    }
*/ 
jQuery.gears = function(factory,options){
    var vars = {
        siteName: null,
        imageUrl: null,
        extraMessage: null
    };
    var opts = $.extend(vars, options);
    jQuery.gears.vars = vars;
    if($.gears.init()){
        return jQuery.gears.factory(factory);
    }else{
        return false;
    }
};
/**
    Инициация фабрикик
    @constructor
    @returns {Object} Объект Gears.
    @param factory {String} название фабрики.
*/ 
jQuery.gears.factory = function(factory){
	switch(factory)
	{
	case 'beta.database':
    case 'beta.geolocation':
    case 'beta.localserver':
    case 'beta.workerpool':
        jQuery.gears.needPermission = true;
        break;
    case 'beta.httprequest':
    case 'beta.desktop':
    case 'beta.timer':
        jQuery.gears.needPermission = false;
        break;
	default:
        return false;
	}
    var gears_factory = google.gears.factory.create(factory);
    if(jQuery.gears.needPermission && !jQuery.gears.hasPermission(gears_factory)){
        jQuery.gears.userPermission = jQuery.gears.getPermission(gears_factory,jQuery.gears.vars);
    }else{
        jQuery.gears.userPermission = true;
    }
    return gears_factory;
}
/**
    Инициация Gears
    @constructor
    @returns {Boolean} Успешно ли инициализировался Gears.
*/ 
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
    	// Возможно скоро будет и Opera поддерживаться.
		return false;
	}
    else {
        return false;
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
/**
    Создание ссылки на установку Gears
    @constructor
    @param options {Object} объект настроек.<br/>
    <ul>
    	<li>element - html элемент куда будет помещаться текст</li>
    	<li>message - тест сообщения</li>
    	<li>html - текст ссылки</li>
    </ul>
*/ 
jQuery.gears.install = function(options){
	var vars = {
		element: 'body',
		message: 'Install Gears for multiupload support.',
		html: '<u>Click to install Gears to enable multifile upload!</u>'
	};
	var opts = $.extend(vars, options);
	var url = 'http://gears.google.com/?action=install' +
		'&message=' +
		encodeURIComponent(vars.message) +
		'&return=' +
		encodeURIComponent(window.location.href);
	if($(vars.element).attr('tagName') == "A"){
		$(vars.element).attr('href',url);
	}else{
		$(vars.element).css('cursor','pointer').bind('click',function(e){window.location.href=url});
	}
	$(vars.element).html(vars.html);
}
jQuery.gears.hasPermission = function(factory){
	return factory.hasPermission
}
jQuery.gears.getPermission = function(factory,options){
	var vars = {
		siteName: null,
		imageUrl: null,
		extraMessage: null
	};
	var opts = $.extend(vars, options);
	return factory.getPermission(vars.siteName, vars.imageUrl, vars.extraMessage);
}
jQuery.gears.needPermission = false;