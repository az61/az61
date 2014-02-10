/*
 * az61.global
 * 
 * Created: 19.11.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

var DEBUG_MODE = 1;

var db; 
var dbName = 'az6';
var dbNamePre = 'az61.';
var version = '1.0';
var displayName = 'AZ61 Database - ';
var maxSize = 65535;
var appVersion = 'Standard';
//Owner is logged in User
var ownerID = window.localStorage.getItem("loggedInUser");
//var ownerID = 1;
var loggedInUser = window.localStorage.getItem("loggedInUser");
//var loggedInUser = 1;
var lessonArray = [];
var isParent;

var lesID = '';
var catID = '';

var menuOpen = false;
var menuDiv = "";



//Paths - do not save new values to paths
var PATHNAME = window.location.pathname;
var pathRoot = '/az61/';
var pathRoot = '';
var imgPath = 'img/';
var pathPartials = pathRoot+'partials/';
var pathImg = pathRoot+'img/';
var PATH_IMG_DEFAULT = pathImg + 'default/';

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
