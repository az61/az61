/*
 * az61.global
 * 
 * Created: 19.11.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//If set to 1 console.logs are shown
var DEBUG_MODE = 0;

var db; 
var DB_NAME = '';
var DB_NAME_PRE = 'az61.';
var DB_VERSION = '1.0';
var DB_DISPLAY_NAME = 'AZ61 Database - ';
var DB_MAX_SIZE = 65535;

//Owner is logged in User
var ownerID = window.localStorage.getItem("loggedInUser");
var loggedInUser = window.localStorage.getItem("loggedInUser");
var lessonArray = [];

//Set lesID and catID globals to access them in mainscript (and else)
var lesID = '';
var catID = '';

//Paths - do not save new values to paths
var PATHNAME = window.location.pathname;
//var PATH_ROOT = '/az61/';
var PATH_ROOT = '';
var PATH_PARTIALS = PATH_ROOT+'partials/';
var PATH_IMG = PATH_ROOT+'img/';
var PATH_IMG_DEFAULT = PATH_IMG + 'default/';

var APP_VERSION = 'Standard';

//User Defaults - do not save new values to defaults
var LEVEL6_DEFAULT = 1;
var LEVEL5_DEFAULT = 3;
var LEVEL4_DEFAULT = 6;
var LEVEL3_DEFAULT = 16;
var LEVEL2_DEFAULT = 39;
var LEVEL1_DEFAULT = 96;
var LEVEL0_DEFAULT = 365;

var LAMMENETT_PRINCIPLE = 1;
var LEITNER_PRINCIPLE = 2;

var HOLIDAY_ACTIVE_DEFAULT = 0;
