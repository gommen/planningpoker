$( function() {
	var view = new View();
	var model = new Model();

	var presenter = new Presenter(model, view);

	$('#test').click(function (event) {
		view.newPlay('Per');
	})
});