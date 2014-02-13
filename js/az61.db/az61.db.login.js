/*
 * az61.db.login
 *
 * Created: 17.12.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Check if User exists from DB and login
function CheckDBUserData(loginData) {
	db.transaction(function(tx) {
        doQuery(tx, 'SELECT * FROM Users WHERE UserName = "'+ loginData['userName'] +'" AND Password = "' + loginData['password'] + '";', [],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0 && result.rows.length == 1){
                	for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			window.localStorage.setItem("loggedInUser", row.UserId);
						hideLogin();						
						loadBottom();
	        		}
				}
				else {
					$('.error').addClass('inline-block');
				}
            }             
        });
    });
}