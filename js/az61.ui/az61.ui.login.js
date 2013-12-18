/*
 * az61.ui.login
 *
 * Created: 17.12.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	$('.login').on('click', function(){
		var loginData = {};
		loginData['userName'] = $.trim($('#usernameLogin').val());
		loginData['password'] = $.md5($.trim($('#passwordLogin').val()));
		
		if (loginData['userName'] != '') {
			CheckDBUserData(loginData);
		}
		else {
			$("#loginNameMissing").dialog( "open" );
		}
	});
	
	$("#loginNameMissing").dialog({
	  autoOpen: false,
	  modal: true,
	  buttons: {
	    Ok: function() {
	      $( this ).dialog( "close" );
	    }
	  }
	});
});

