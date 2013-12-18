/*
 * az61.ui.settings
 *
 * Created: 18.12..2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */
$(function() {
	$('.logout').on('click',function(){
		$("#userLogout").dialog( "open" );
	});
});

$("#userLogout").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
    	$( this ).dialog( "close" );
    	$.removeCookie('loggedInUser');
    	$.cookie("loggedInUser", null,{path: '/'});
    	window.location.href = 'login.html';
    },
    'Abbrechen': function(){
    	$( this ).dialog( "close" );
    }
  }
});
