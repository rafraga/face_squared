$('#video_div').html("<video id='videoel' crossorigin='anonymous' src='" + video_link + "' +  oncanplay='enablestart()' preload='auto' loop playsinline autoplay muted width='200'></video>")
var total_frames_processed = 0
var init_var = 0.0
var minConfidence = parseFloat(Youtube.confidence)
if (!(minConfidence < 1.0 && minConfidence > 0.0)) {
  alert("Invalid confidence number - confidence number set to default value (0.6)")
  minConfidence = 0.6
}
let net, result
var result_list = "none"
var vid = document.getElementById('videoel')
vid.setAttribute('crossorigin', 'anonymous')
var video_progress = -1
var faces = []
var count_faces = 0
var max_faces = 100
var times_list = []
var results_data = []
function enablestart() {
  if (init_var == 0.0) {
    vid.currentTime = vid.duration - (vid.duration * 0.03)
    this.init_var += 1.0
  } else {
    this.init_var += 1.0
  }
  onPlay(vid)
}
async function onPlay(videoEl) {
  if (videoEl.paused || videoEl.ended)
    return false

  if (video_progress <= vid.currentTime) {
    const input = new faceapi.NetInput(videoEl)
    const { width, height } = input
    const canvas = $('#overlay').get(0)
    canvas.width = width
    canvas.height = height

    const ts = Date.now()
    result = await net.locateFaces(input, minConfidence)
    //console.log(minConfidence)
    $('#time').val(`${(Date.now() - ts)} ms`)
    $('#fps').val(`${faceapi.round(1000 / (Date.now() - ts))}`)

    current_time_sec = vid.currentTime
    print_process = parseInt(parseFloat(((vid.duration - (((vid.duration - current_time_sec) / vid.duration) * vid.duration)) / vid.duration) * 100).toFixed(0))
    if (print_process < 100) {
      $('#faces_view').html('<center><h5>Processing video: ' + print_process + '' + '%</h5></center>')
    } else {
      $('#faces_view').html('')
    }
    total_faces_in_frame = Object.keys(result).length
    this.count_faces += total_faces_in_frame
    faces_info = JSON.stringify(result)
    const faceImages = await faceapi.extractFaces(input.canvases[0], result)

    //faceImages.setAttribute('crossorigin', 'anonymous')

    if (result_list == "none") {
      vid.currentTime = 0
      this.result_list = []
      start_time = vid.currentTime
    } else {
      this.times_list.push(parseInt(vid.currentTime))

      if (parseInt(total_faces_in_frame) == parseInt(0)) {
        this.result_list.push("<font size='2'><h6><b>Video time (sec):</b> " + current_time_sec + "<br><b>Faces in the frame:</b> " + total_faces_in_frame + "</font>")
        this.results_data.push(`timeStamp:${current_time_sec},faceCount:${total_faces_in_frame};`)
    } else {
      this.result_list.push("<font size='2'><h6><b>Video time (sec):</b> " + current_time_sec + "<br><b>Faces in the frame:</b> " + total_faces_in_frame + "<br><b>Faces info:</b> " + faces_info + "</font>")

      this.results_data.push(`timeStamp:${current_time_sec},faceCount:${total_faces_in_frame}`)
  }
  total_frames_processed += 1

  this.result_list.push("<div style='display:inline-block'><center>")
  faceImages.forEach(function (canvas) { return this.result_list.push(canvas) })
  faceImages.forEach(function (canvas) { return this.faces.push(canvas) })
  this.result_list.push("</center></div></h6><br>")
  this.video_progress = vid.currentTime

  if (document.contains(document.getElementById('startbutton'))) {
    document.getElementById('startbutton').remove()
    $('#results-view').empty()
  }

  $("#results-view").html(result_list)
  $('#results-view').scrollTop($('#results-view')[0].scrollHeight)
  setTimeout(() => onPlay(videoEl))
}
  } else {
  vid.onplaying = function () {
    vid.pause()
    vid.remove()
    $('#spaces3').remove()
    $('body').attr("style","overflow: auto")
    $('#results-view').scrollTop($('#results-view')[0].scrollHeight)
    $('#spaces').html("")
    end_time = current_time_sec
    $('#header').html("<center><h5>Results</h5><h6>" + count_faces + " total faces found in video segment (from " + start_time + " to " + end_time + " seconds).<br>Total images processed:" + total_frames_processed + "</h6><button class='btn' id='add-stream-button' data-toggle='modal' data-target='#squarespaceModal' type='button' style='position: center;right: 0;left: 0;margin-right: auto;margin-left: auto' value='Save Stream'><h6>Save Stream</h6></button>&nbsp;&nbsp;<button class='btn' id='download_image_button' style='position: center;right: 0;left: 0;margin-right: auto;margin-left: auto' value='Download Faces'><h6>Download Faces</h6></button></center>")
    $('#header').attr("style", "height:20px;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 5em;width: 100%;top: 30em;background-color:white")
    console.log(results_data) // results that will go to the database
    console.log("total_faces_in_video: " + count_faces) // results that will go to the database
    $('#spaces').html("<br>")
    $('#spaces2').html("<br><br><br>")
    $("#results-view").attr("style", "height:20px;width:700px;background-color:#eee;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;min-height: 20em;width: 90%;text-align: left")

    $('#download_image_button').click(function () {

      new Promise(function (fulfill, reject) {
        document.getElementById("results-view").style.display = "none"
        $("#faces_view").attr("style", "height:400px;width:100%;background-color:white;overflow-y:scroll;overflow-x:hidden;right: 0;left: 0;margin-right: auto;margin-left: auto;text-align: center")
        $("#faces_view").html(faces)
        fulfill(result);
      }).then(function (result) {
        return new Promise(function (fulfill, reject) {
          html2canvas($('#all').get(0)).then(function (canvas) {
            var myImage = canvas.toDataURL()
            var link = document.createElement("a");
            link.download = "face-squared_" + n_number + ".png"
            link.href = myImage
            document.body.appendChild(link)
            link.click()
          })
          fulfill(result);
        });
      }).then(function (result) {
        return new Promise(function (fulfill, reject) {
          $("#results-view").html(result_list)
          $('#results-view').scrollTop($('#results-view')[0].scrollHeight)
          document.getElementById("results-view").style.display = "block"
          fulfill(result);
        });
      }).then(function (result) {
        //do something with the result
      });

    })

    /*$('.download_txt_button').on('click',function () {
      var element = document.createElement('a');
      var local_data=$(`.hidden-data-div #${$(this).attr('id')}`).val().trim()
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(local_data)));
      element.setAttribute('download', "face-squared_" + n_number + ".txt");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    })*/

    return results_data
  };
  return false
}
}
async function run() {
  net = await initFaceDetectionNet()
}

function loadModal() {
  $("body").on("click", "#add-stream-button", function () {
    var dataHTML = '';
    $("#streamDuration").val(vid.duration);
    $("#streamFaceCount").val(count_faces);
    /*for (let i = 0; i < results_data.length; i++) {
      const element = results_data[i];
      dataHTML+=`<p>Screenshot #${i+1}: <span id=timeStamp${i+1}>Timestamp: ${element.timeStamp}</span><span id=faceCount${i+1}> Face Count: ${element.faceCount}</span></p><p id=info${i+1}> Info: ${element.info}</p>`
    }*/
    $("#streamData").text(results_data);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  // Wont submit the post if we are missing a body, title, or author
  if (!$("#streamName").val().trim() || !$("#streamUrl").val().trim() || !$("#streamDuration").val().trim() || !$("#streamFaceCount").val().trim()) {
    return;
  }
  // Constructing a newPost object to hand to the database


  for (let i = 0; i < results_data.length; i++) {
    const element = results_data[i];
    var newScreenshot = {
      streamTitle: $("#streamName").val().trim(),
      faceCount: element.faceCount,
      videoTime: element.timeStamp,
      info: element.info
    };
    $.post("/screenshots/new", newScreenshot, function () {
    });
  }
}

vid.addEventListener('canplay', enablestart, false);

$(document).ready(function () {
  run()
  loadModal()
  //$("#streamForm").on("click", "#streamSubmit	", handleFormSubmit);
})
