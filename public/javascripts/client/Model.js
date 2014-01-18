//requires jquery for messagepropagation


function Model(_playerName) {
	'use strict';
	var playerName = _playerName;
	var playedCard;
	var otherPlayers = {};
	var revealedCards = {};

	var xlateNames = [{'Question':NaN},
					{'eight':8},
					{'five':5},
					{'half':0.5},
					{'hundred':100},
					{'one':1},
					{'thirteen':13},
					{'three':3},
					{'twentyone':21},
					{'two':2}];
	var avg = 0;
	var min;
	var max;

	this.getPlayerName = function () { return playerName; };

	this.reset = function ()  {
		avg = 0;
		min = undefined;
		max = undefined;
		playedCard = undefined;
		otherPlayers =  {};
		$(this).trigger('reset');
	};
	this.cardIsPlayed = function () {
		return playedCard !== undefined;
	};
	this.getPlayedCard = function () {
		return playedCard;
	};
	this.setPlayedCard = function (_playedCard) {
		playedCard = _playedCard;
		//TODO: Send message to server
	};
	this.playCard = function(card) {
		playedCard = card;
		$(this).trigger('newPlay');
	};
	this.otherPlayers = function (other) {
		if (other == playerName) return; //The server sends the info to all players
		if (this.otherPlayers[other] === undefined) {
			this.otherPlayers[other] = true;
			$(this).trigger('newPlayer', other);
		} // the player has already played a card, and he has probalbly changed it, we ignore it
	};
	this.revealCards = function (playedCards) {
		revealedCards = playedCards;
		//Calculate avg, max, min;
		$.each(revealedCards, function (idx, item) {
			
			var v = xlateNames[item.card];
			avg = avg + v;
			if (min) {
				if (xlateNames[min.card] > v) {
					min = item;
				}
			} else min = item;
			if (max) {
				if (xlateNames[max.card] < v) {
					max = item;
				}
			} else max = item;
			if (otherPlayers[item.name] === undefined) { //in case we missed info from a player
				this.otherPlayers(item.name);
			}
		});
		
		$(this).trigger('cardRevaled');
	};
	this.eachRevealedCards = function (f) {
		$.each(revealedCards, function (idx, item) {
				if (item.name !== playerName) {
					f(item.name, item.card);
				}
			});
	};
}