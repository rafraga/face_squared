document.getElementById("all").style.display = "none"

alert("This is a beta version, we are currently in a temporary test server that often goes down. If the loading takes too long, please check if https://cors-anywhere.herokuapp.com servers are working in your browser. We apologize for any inconvenience. Google Chrome browser is required.")
$("#add_video_div").html("<button class='waves-effect waves-light btn-small' id='button_add_stream' style='position: center;right: 0;left: 0;margin-right: auto;margin-left: auto' value='Add stream'><h6>Add stream</h6></button>'")
$("#button_add_stream").click(function() {
	document.getElementById("all").style.display = "block"
	var nameInput = $("#streamName"),
		urlInput = $("#streamUrl"),
		screenshots = {};

	var url = window.location.search;
	//var tripId;
	//var userId;
	// Sets a flag for whether or not we're updating a post to be false initially
	//var updating = false;
	//var default_youtube_link = "https://www.youtube.com/watch?v=8HlqSrCazqo"
	//var default_youtube_link = "https://www.youtube.com/watch?v=U1it45QagN8"
	//var default_youtube_link = "https://www.youtube.com/watch?v=U1it45QagN8"
	var default_youtube_link = "https://www.youtube.com/watch?v=gjmuhIqhMt8"
	var apiKey = "AIzaSyCuYYszyFQE2cnSB8jQfDnYUhMAcH5LQyg"
	var user_input_link = prompt("Please insert a YouTube link", default_youtube_link)
	if (user_input_link === null) {
		user_input_link = default_youtube_link
	}
	var youtube_id = String(user_input_link).replace("&","=").split("=")[1]
	var youtube_thumbnail = "https://i1.ytimg.com/vi/" + youtube_id + "/default.jpg"
	document.getElementById("results-view").style.display = "none"
	var video_link
	var Youtube = {}
	var d = new Date();
	var n_number = d.getTime()

	var promise = $.ajax({
		url: 'https://you-link.herokuapp.com/?url=' + user_input_link,
		method: "GET"
	}).then(function (response) {
		for (var i in response) {
			if (String(response[i].type).split(";")[0] == "video\/mp4") {
				if (String(response[i].quality).split(";")[0] == "medium") {
					return response[i].url
				}
			}
		}
	})

	function load_youtube_image() {
		promise.done(function (myUrl) {
			Youtube.url = myUrl
			$.ajax({
				url: "https://www.googleapis.com/youtube/v3/videos?id=" + youtube_id + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
				dataType: "jsonp",
				success: function (data) {
					Youtube.title = data.items[0].snippet.title
					document.getElementById("proceed_button").disabled = false
					$('#youtube_thumb').html("<br><h5>" + Youtube.title + "</h5><br><img src='" + youtube_thumbnail + "'><br><br><br><h6>Please insert a confidence level in the field below, it must be a number <br> between 0.1 and 0.9 (from lower to higher). Then press 'Start' to begin!<br><br><input class='validate' style='width:2em;top:0;bottom:0;right:0;left:0;margin-right:auto;margin-left:auto' id='confidence' value='0.6'></h6>")
				}
			});
		})
	}

	function loadScript(script_url) {
		Youtube.confidence = $('#confidence').val()
		$('#youtube_thumb').remove()
		$('#proceed_button').remove()
		$('body').attr("style","margin:0;height: 100%;width: 100%;overflow: hidden")
		$('#spaces3').html("<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>")
		$('#loading_div').html("<input style='position: fixed;right: 0;left: 0;margin-right: auto;margin-left: auto;height:100%;width:100%;top:0;bottom:0;background-color:gray;text-align: center' value='PLEASE WAIT - LOADING VIDEO' disabled='disabled' id='startbutton'></input>")
		$('#results-view').attr("style","height:100px;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 90%;text-align: left;background-color:#eee")
		document.getElementById("results-view").style.display = "block"
		var proxy = 'https://cors-anywhere.herokuapp.com/'
		this.video_link = proxy + Youtube.url
		$('#start_button').empty()
		var head = document.getElementsByTagName('head')[0]
		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = script_url
		head.appendChild(script)
	}

	function submitStream(stream) {
		$.post("/homepage/new", stream, function () {
			window.location.href = "/homepage";
		});
	}
	$("body").on("click", "#add-stream-button", function () {
		$("#streamUrl").val(user_input_link);
	});
	/*
	function updateStream(stream) {
		$.ajax({
		method: "PUT",
		url: "/homepage",
		data: stream
		})
		.done(function() {
		window.location.href = "/homepage";
		});
	}
	*/
	function handleFormSubmit(event) {
		event.preventDefault();
		// Wont submit the post if we are missing a body, title, or author
		if (!nameInput.val().trim() || !urlInput.val().trim() || !$("#streamDuration").val().trim() || !$("#streamFaceCount").val().trim()) {
			return;
		}
		// Constructing a newPost object to hand to the database
		var newStream = {
			name: nameInput.val().trim(),
			url: urlInput.val().trim(),
			faces: $("#streamFaceCount").val().trim(),
			duration: $("#streamDuration").val().trim(),
			data: $("#streamData").text().trim()
		};
		/*
			Product.create({
				title: 'Chair',
				user: {
					first_name: 'Mick',
					last_name: 'Broadstone',
					addresses: [{
						type: 'home',
						line_1: '100 Main St.',
						city: 'Austin',
						state: 'TX',
						zip: '78704'
					}]
				}
			}, {
					include: [{
						association: Product.User,
						include: [User.Addresses]
					}]
				});
		*/
		// If we're updating a post run updatePost to update a post
		// Otherwise run submitPost to create a whole new post
		//	if (updating) {
		//	  newStream.id = tripId;
		//	  updateTrip(newTrip);
		//	}
		//	else {
		submitStream(newStream);
		console.log(newStream);
		//	}
	}

	$("#streamForm").on("click", "#streamSubmit	", handleFormSubmit);

	$(".delete-stream").on("click",function(){
		var id=$(this).attr("id");
		$.ajax({
			method: "DELETE",
			url: "/homepage/" + id
		})
			.then(function() {
				window.location.href = "/homepage";
			});
	});

	$('body').on('click','.download_txt_button',function () {
		var element = document.createElement('a');
		var local_data_location='.hidden-data-div #data-'+$(this).attr('id');
		console.log(local_data_location);
		var local_data=$(local_data_location).text();
		console.log(local_data);
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(local_data));
		element.setAttribute('download', "face-squared_" + n_number + ".txt");
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	});

	load_youtube_image()
})