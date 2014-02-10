/*
 * az61.ui.settings
 *
 * Created: 18.12..2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */
$(function() {
	$('.logout').on('click',function(){
		var logout = confirm('Willst du dich wirklich ausloggen?','Logout');
	    if (logout){
	    	window.localStorage.removeItem("loggedInUser");
	    	window.localStorage.clear();
	    	window.location.href = 'index.html';
	    }
	});
});
