
//Requires jquery

function DialogView(_presenter) {
	var presenter = _presenter;
	var name = $("#name");
	var tips = $(".validateTips")
	var allFields = $( [] ).add( name );

	this.setPresenter = function (_presenter) {
		presenter = _presenter;
	}

	this.updateTips = function updateTips( t ) {
      tips
        .text( t )
        .addClass( "ui-state-highlight" );
      setTimeout(function() {
        tips.removeClass( "ui-state-highlight", 1500 );
      }, 500 );
    }

    //Initialize the 
	 $( "#name-dialog" ).dialog({
      autoOpen: true,
      height: 300,
      width: 350,
      modal: true,
      buttons: {
        "Update Name": function() {
          if (presenter.validateName(name.val())) {
          	allFields.removeClass( "ui-state-error" );
 		  	presenter.setName(name.val());
          	$( this ).dialog( "close" );
          }
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        allFields.val( "" ).removeClass( "ui-state-error" );
      }
    });    



}