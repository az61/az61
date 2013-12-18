/*
 * az61.ui.user
 *
 * Created: 18.11.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */
$(function() {
	var dateHoliday = '';
	
	//Activate User Settings PW Validator
	var validator = $("#userSettings").validate({
		rules: {
			password_confirm: {
				required: true,
				equalTo: "#password"
			},
		},
		messages: {
			password_confirm: {
				required: "Passwort bitte wiederholen",
				minlength: jQuery.format("Das Passwort muss mindestens {0} Zeichen haben"),
				equalTo: "Die Passwörter müssen identisch schein"
			}
		},
		// the errorPlacement has to take the table layout into account
		errorPlacement: function(error, element) {
			error.prependTo( element.parent().next() );
		},
		// set this class to error-labels to indicate valid fields
		success: function(label) {
			// set &nbsp; as text for IE
			label.html("&nbsp;").addClass("checked");
		}
	});
		
	//Get UserId of selected User an get user Data
	$('#user').on('change', function(e){
		var userId = $('#user option:selected').val();
		if (userId != 'choose'){
			GetDBUserData(userId);
			
			if ($('.newUser').is(':visible')){
				$('.newUser').hide();
			}
			
			if ($('.enterHoliday').is(':visible')){
				$('.enterHoliday').hide();
			}
		}
		else {
			emptyAllUserFields();
		}
	});
	
	$('.setIntervallBack').click(function(){
		setIntervallFieldsToDefault();
	});
	
	$('.addUser').click(function(){
		$('#newUserDialog').dialog('open');
		resetUserSettings();
		fillInDefaultValues();
		
	});
	
	$('.close').click(function(){
		$('.newUser').toggle();
		emptyAllUserFields();
	});
	
	$('.addUserLessons').click(function(){
	    var userId = $('#user option:selected').val();
	    if (userId != 'choose'){
            GetUserLessonsFromDB(userId);            
            $("#addUserLessonsDialog").dialog("open");
        }
        else {
            $('#userMissingDialog').dialog("open");
        }
		
	});
	
	$('#holidayActive').change(function(){
		if($('input#holidayActive').is(":checked")){
			dateHoliday = parseInt(new Date().getTime()/1000,10);
			var now = new Date();
			var month = now.getMonth();
			var months = new Array("Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
			
			$('.enterHoliday p.date').html('ab ' + now.getDate() + '.' + months[month] + ' ' + now.getFullYear());
			$('.enterHoliday').show();
		}		
		else {
			dateHoliday = '';
			$('.enterHoliday date').html('');
			$('.enterHoliday').hide();
		}		
	});
	
	$('.submitUser').click(function(){
		saveUser(dateHoliday);
	});
	
});

function saveUser(dateHoliday){
    var userObject = {};
        
    userObject['password'] = $.md5($.trim($('#password').val()));      
    userObject['level6'] = parseInt($('#level6').val(),10);
    userObject['level5'] = parseInt($('#level5').val(),10);
    userObject['level4'] = parseInt($('#level4').val(),10);
    userObject['level3'] = parseInt($('#level3').val(),10);
    userObject['level2'] = parseInt($('#level2').val(),10);
    userObject['level1'] = parseInt($('#level1').val(),10);
    userObject['level0'] = parseInt($('#level0').val(),10);     
    userObject['enterHoliday'] = dateHoliday;
    
    if ($('input[name=principle]:radio[value=Leitner]').is(":checked")){
        userObject['principle'] = LEITNER_PRINCIPLE;
    }
    else if ($('input[name=principle]:radio[value=-1]').is(":checked")){
        userObject['principle'] = LAMMENETT_PRINCIPLE;
    }       
    
    if($('input#holidayActive').is(":checked")){
        userObject['holidayActive'] = 1;
    }       
    else {
        userObject['holidayActive'] = HOLIDAY_ACTIVE_DEFAULT;
    }
    
    //If New User Dialog is visible add new user to DB
    if ($('#newUserDialog').is(':visible')){          
        if ($.trim($('#newUser').val()) != '') {
            userObject['userName'] = $('#newUser').val();
            AddUserToDB(userObject);
        }
        else {
            $("#userNameMissingDialog").dialog( "open" );
        }           
    }
    //Else update user data to DB
    else {
        var userId = $('#user option:selected').val();
        userObject['userId'] = userId;
        userObject['theme'] = 'default';
        userObject['sound'] = 0;
        userObject['editOnFly'] = 0;
        userObject['language'] = 'de';
        
        if (loggedInUser == 1){
            userObject['isParent'] = 1;
        }
        else {
            userObject['isParent'] = 0;
        }
        
        if($('#user option[value="choose"]').is(':selected')){
            $("#userMissingDialog").dialog( "open" );
        }
        else {
            UpdateUserDataToDB(userObject);
        }
    }
}

function fillInDefaultValues(){
	$('input[name=principle]:radio[value=Leitner]').attr('checked', true);			      			
	$('input#holidayActive').attr('checked', false);			      			
	setIntervallFieldsToDefault();
}

function emptyAllUserFields(){
	//Uncheck Radio Buttons and Checkboxes
	$('input[type=radio]').attr('checked', false);
	$('input[type=checkbox]').attr('checked', false);
	
	//Empty Input fields			      			
	$('input[type=text]').val('');
}

function resetUserSettings(){
	emptyAllUserFields();
	$('#user option[value="choose"]').prop('selected', true);
}

function setIntervallFieldsToDefault(){
	$('#level6').val(LEVEL6_DEFAULT);
	$('#level5').val(LEVEL5_DEFAULT);
	$('#level4').val(LEVEL4_DEFAULT);
	$('#level3').val(LEVEL3_DEFAULT);
	$('#level2').val(LEVEL2_DEFAULT);
	$('#level1').val(LEVEL1_DEFAULT);
	$('#level0').val(LEVEL0_DEFAULT);
}

//Dialogs
$("#userNameMissingDialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
      $( this ).dialog( "close" );
    }
  }
});

$("#userMissingDialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
      $( this ).dialog( "close" );
    }
  }
});

$("#userExists").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
      $( this ).dialog( "close" );
    }
  }
});

$("#userAddedSuccess").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
      $( this ).dialog( "close" );
    }
  }
});

$("#userUpdateSuccess").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    Ok: function() {
      $( this ).dialog( "close" );
    }
  }
});

$("#addUserLessonsDialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    'Speichern': function() {
        var userId = $('#user option:selected').val();
        DeleteUserLessonFromDB(userId);
        var origCheckLessonsStr = $('.checkedLessons').html();
        var origCheckedLessons = origCheckLessonsStr.split(',');
        for(var i=0; i<origCheckedLessons.length;i++){
            origCheckedLessons[i] = parseInt(origCheckedLessons[i],10);            
        }
        var removeResult = false;
        $('input.userLesson').each(function() {
            //$(this).prop('checked',false);
            if($(this).is(':checked')){
                var inputId = $(this).attr('id');     
                var lessonId = parseInt(inputId.substring(9),10);        
                AddUserLessonToDB(userId,lessonId);
                if (origCheckedLessons.length > 0){
                    if ($.inArray(lessonId,origCheckedLessons) == -1) {
                        GetDBVocabulary(lessonId, removeResult);
                    }
                }
                else {
                    GetDBVocabulary(lessonId, removeResult);
                }
                
            }
            else {
                var inputId = $(this).attr('id');     
                var lessonId = parseInt(inputId.substring(9),10);                      
                if ($.inArray(lessonId,origCheckedLessons) > -1) {
                    removeResult = true; 
                    GetDBVocabulary(lessonId, removeResult);
                }
            }            
        });
            
      $( this ).dialog( "close" );
    },
    "Abbrechen": function(){
        $(this).dialog("close");
    }
  },
  close: function(){
    $('input.userLesson').each(function() {
        $(this).prop('checked',false);
    });
  }
});

$("#newUserDialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    'Speichern': function() {        
        var dateHoliday = '';
        saveUser(dateHoliday);
        $( this ).dialog( "close" );
    },
    "Abbrechen": function(){
        $(this).dialog("close");
    }
  },
  close: function(){
    emptyAllUserFields();
  }
});