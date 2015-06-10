

$( function() {
	var socket = io.connect(window.location.origin);
	socket.on('serial_connect', function(data){
		$("#connection_status").html("Connected to " + data.name);
		$("#connection_status").removeClass("bg-danger").addClass("text-success");
		console.log("serial connected to", data);
	});


	$('#send_command').click ( function(){
		console.log("click");
		socket.emit("send_command", {command: $('#command').val() });
	});

	//rangesliders
	//on change
	$('input[type="range"]').on('input', function(){
		//console.log("change", $(this).val());
		//$('label[for="'+$(this).prop('id')+'"] .val').html($(this).val());
		$(this).siblings('span, div').children().val($(this).val());
	});
	//set initial vals
	$('input[type="range"]').trigger("input");


	$('#send_fast_move').click ( function(){
		//move to start position
		moveToPosition($('#start_x').val(), 60000, 10000);
		//do move to end position
		moveToPosition($('#end_x').val(), $('#xvm').val(), $('#xjm').val());
	});

	function moveToPosition(_position, _velocity, _jerk){
		console.log("moveToPosition ", _position, _velocity, _jerk);
		socket.emit("send_command", {command: "$xvm="+_velocity });
		socket.emit("send_command", {command: "$xjm="+_jerk });
		socket.emit("send_command", {command: "g0 x" + _position});
	}
});

