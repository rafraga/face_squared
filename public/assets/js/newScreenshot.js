function submitScreenshot(screenshot) {
    $.post("/screenshots/new", screenshot, function () {
        window.location.href = "/homepage";
    });
};

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
    const ID = $(this).attr("data-id");
    const URL = $(`#screenshotUrl${ID}`).val(), DESCRIPTION = $(`#descriptions${ID}`).val();
    console.log(ID, URL, DESCRIPTION);
    if (!URL.trim() || !DESCRIPTION.trim()) {
        return;
    }
    // Constructing a newStream object to hand to the database
    var newScreenshot = {
        descriptions: DESCRIPTION.trim(),
        url: URL.trim(),
        VideoStreamId: ID.trim()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    //	if (updating) {
    //	  newStream.id = tripId;
    //	  updateTrip(newTrip);
    //	}
    //	else {
    submitScreenshot(newScreenshot);
    //	}
};

$(".submit-screenshot").on("click", handleFormSubmit);