function View() {
	var $cardarea = $( "#cardarea" ),
		$playingarea = $( "#playingarea" );
	var cardTemplate='<li class="ui-widget-content ui-corner-tr face" id="{cardName}">\
						<img src="images/{cardName}.png" alt="{cardName}" width="140" height="205" />\
						<a href="link/to/playingarea/script/when/we/have/js/off" title="Play this card" class="ui-icon ui-icon-playingarea">\
						   Play Card\
						</a>\
					</li>';
	var otherPlayerCardTemplate = '<li class="ui-widget-content ui-corner-tr" id="{playerName}">\
									<h4 class="ui-widget-header">{playerName}</h4>\
									<img src="images/back.png" alt="{playerName}" width="140" height="205" />\
								   </li>';
	var cardname = new RegExp('\{cardName\}', 'g');
	var playerName = new RegExp('\{playerName\}', 'g');
	var cardNames = ['Question',
					'eight',
					'five',
					'half',
					'hundred',
					'one',
					'thirteen',
					'three',
					'twentyone',
					'two'];
	var presenter = undefined;
	
	this.setPresenter = function (_presenter) {
		presenter = _presenter;
		$playingarea.on('drop', function (event, ui) { presenter.cardPlayed(ui.draggable) });
		$cardarea.on('drop', function (event, ui) { presenter.cardReturned(ui.draggable) });
	}


	
	//Private methods
	var clearArea = function (ui) {
		ui.empty();
	}
	
	var initializeCardarea = function () {
		$.each(cardNames, function (idx, item) {
			$cardarea.append(cardTemplate.replace(cardname, item)).fadeIn();
		})
	}
	
	//Reset the playing area - and prepare for a new round
	this.reset = function ()  {
		clearArea($cardarea);
		clearArea($playingarea.find('ul'));
		initializeCardarea();
		
		$playingarea.droppable({
			accept: "#cardarea > li",
			activeClass: "ui-state-highlight",
		
		});
		$( "li", $cardarea ).draggable({
			cancel: "a.ui-icon", // clicking an icon won't initiate dragging
			revert: "invalid", // when not dropped, the item will revert back to its initial position
			containment: "document",
			helper: "clone",
			cursor: "move"
		});
	}


	//This function add a card to the playingarea - backside up.
	this.newPlay = function (player) {
		var $list = $( "ul", $playingarea ).length ?
			$( "ul", $playingarea ) :
			$( "<ul class='cardarea ui-helper-reset'/>" ).appendTo( $playingarea );
		
		var $player = $(otherPlayerCardTemplate.replace(playerName, player));
		$player.appendTo($list).fadeIn(function() {
			$player
					.animate({ width: "70px" })
					.find( "img" )
						.animate({ height: "103px" });
		});

	}

	this.findPlayedCard = function (value) {
		var $list = $( "ul", $playingarea ).length ?
			$( "ul", $playingarea ) :
			$( "<ul class='cardarea ui-helper-reset'/>" ).appendTo( $playingarea );

		var $playedCard = $list.find('#'+value);
		return $playedCard.length?$playedCard:undefined;
	} 

	this.getCardName = function ($item) {
		return $item.attr('id');
	}

	var recycle_icon = "<a href='link/to/recycle/script/when/we/have/js/off' title='Recycle this image' class='ui-icon ui-icon-refresh'>Recycle image</a>";
	// This function moves a card from the card area to the playingarea
	this.playCard = function ( $item ) {
		$item.fadeOut(function() {
			var $list = $( "ul", $playingarea ).length ?
				$( "ul", $playingarea ) :
				$( "<ul class='cardarea ui-helper-reset'/>" ).appendTo( $playingarea );

			$item.find( "a.ui-icon-playingarea" ).remove();
			$item.append( recycle_icon ).appendTo( $list ).fadeIn(function() {
				$item
					.animate({ width: "74px" })
					.find( "img" )
						.animate({ height: "103px" });
			});
		});
	}

	// image recycle function
	var playingarea_icon = "<a href='link/to/playingarea/script/when/we/have/js/off' title='Delete this image' class='ui-icon ui-icon-playingarea'>Delete image</a>";
	
	//This function moves a played card from the playing area and back to the cardarea
	this.recycleImage = function ( $item ) {
		$item.fadeOut(function() {
			$item
				.find( "a.ui-icon-refresh" )
					.remove()
				.end()
				.css( "width", "140px")
				.append( playingarea_icon )
				.find( "img" )
					.css( "height", "206px" )
				.end()
				.appendTo( $cardarea )
				.fadeIn();
		});
	}



	var imageUrlTemplate = 'images/{cardName}.png'
	this.revealPlayerCard = function (player, cardValue) {
		var $playersCard = $playingarea.find('#'+player);
		if ($playersCard.length) {
			$('img', $playersCard).attr('src', imageUrlTemplate.replace(cardname, cardValue));
		}	 
	}

	///////////////Initializing the playing area ////////////////////////
	clearArea($cardarea);
	initializeCardarea($cardarea);
	
	//Initialize the GUI components
	// let the cardarea items be draggable
	$( "li", $cardarea ).draggable({
		cancel: "a.ui-icon", // clicking an icon won't initiate dragging
		revert: "invalid", // when not dropped, the item will revert back to its initial position
		containment: "document",
		helper: "clone",
		cursor: "move"
	});

	// let the playingarea be droppable, accepting the cardarea items
	$playingarea.droppable({
		accept: "#cardarea > li",
		activeClass: "ui-state-highlight",
		// drop: function( event, ui ) {
		// 	playCard( ui.draggable );
		// }
	});

	// let the cardarea be droppable as well, accepting items from the playingarea
	$cardarea.droppable({
		accept: "#playingarea li",
		activeClass: "custom-state-active",
		// drop: function( event, ui ) {
		// 	recycleImage( ui.draggable );
		// }
	});


	// resolve the icons behavior with event delegation
	$( "ul.cardarea > li" ).click(function( event ) {
		var $item = $( this ),
			$target = $( event.target );

		if ( $target.is( "a.ui-icon-playingarea" ) ) {
			presenter.cardPlayed( $item );
		} else if ( $target.is( "a.ui-icon-refresh" ) ) {
			presenter.cardReturned( $item );
		}

		return false;
	});

}
