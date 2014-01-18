//Requires jquery for message propagation


	function PlayPresenter(_model, _view) {
		
		//private attributes
		var model = _model;
		var view = _view;
		
		view.setPresenter(this);

		this.cardPlayed = function ($item) {
			if (model.cardIsPlayed()) {
				var $previouslyPlayedCard = view.findPlayedCard(model.getPlayedCard());
				if ($previouslyPlayedCard) {
				  view.recycleImage($previouslyPlayedCard);
				}
			}
			model.setPlayedCard(view.getCardName($item))
			view.playCard($item);
		}
		this.cardReturned = function ($item) {
			view.recycleImage($item);
		}

		this.otherPlayerPlays = function (event, playerName) {
			view.newPlay(playerName);
		}

		this.reset = function ()  {
			view.reset();
		};

		this.revealCards = function (event) {
			model.eachRevealedCards(function (player, card) {
				view.revealPlayerCard(player, card);
			});
		};


		$(model).on('cardRevaled', this.revealCards);
		$(model).on('reset', this.reset);
		$(model).on('newPlayer', this.otherPlayerPlays );

	}
