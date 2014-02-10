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
		loginData['userName'] = $.trim($('#usernameLogin').find(":selected").text());
		loginData['password'] = $.md5($.trim($('#passwordLogin').val()));
		
		if (loginData['userName'] != '') {
			CheckDBUserData(loginData);
		}
		else {
			alert('Bitte Namen eingeben.');
		}
	});
});

