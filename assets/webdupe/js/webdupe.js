// Using and applies policies of https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
// and Copyright (c) 2019 Akash Patel
$('body').append('<div id="final_version"></div><div class="action_block"><div id="info"><p id="info_start">Quick</p><!-- <p id="info_start">Click on the microphone icon and begin speaking.</p> --><p id="info_speak_now">Speak now.</p><p id="info_no_speech">No speech was detected. You may need to adjust your<a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.</p><p id="info_no_microphone" style="display:none">No microphone was found. Ensure that a microphone is installed and that<a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a> are configured correctly.</p><p id="info_allow">Click the "Allow" button above to enable your microphone.</p><p id="info_denied">Permission to use microphone was denied.</p><p id="info_blocked">Permission to use microphone is blocked. </p><p id="info_upgrade">Web Speech API is not supported by this browser.Upgrade to <a href="//www.google.com/chrome">Chrome</a>version 25 or later.</p></div><div class="action_block_content"><div class="right"><button id="start_button" onclick="startButton(event)"><img id="start_img" src="mic.gif" alt="Start"></button></div><div id="results" class="hide"><span id="final_span" class="final"></span><p></p></div></div></div><div id="div_language"><select id="select_language" onchange="updateCountry()"></select>&nbsp;&nbsp;<select id="select_dialect"></select></div>');
// microphone is blocked. To change,go to chrome://settings/contentExceptions#media-stream

// <!-- voice and required script -->
  // setup
    var langs =
      [['English',  ['en-CA', 'Canada'],
                    ['en-IN', 'India']],
      ];
                    // ['en-US', 'United States']],

    for (var i = 0; i < langs.length; i++) {
      select_language.options[i] = new Option(langs[i][0], i);
    }
    select_language.selectedIndex = 0;
    updateCountry();
    select_dialect.selectedIndex = 1;
    showInfo('info_start');

    function updateCountry() {
      for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
      }
      var list = langs[select_language.selectedIndex];
      for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
      }
      select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
    }
  // setup ends
  var final_transcript = '';
  var recognizing = false;
  var ignore_onend;
  var start_timestamp;
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
      showInfo('info_speak_now');
      start_img.src = 'mic-animate.gif';
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        start_img.src = 'mic.gif';
        showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        start_img.src = 'mic.gif';
        showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('info_blocked');
        } else {
          showInfo('info_denied');
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function() {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      start_img.src = 'mic.gif';
      // if (!final_transcript) {
        showInfo('info_start');
        // return;
      // }
      // showInfo('');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
        console.log('end');
      }
    };

    var current_selected_element = '';
    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      final_span.innerHTML = linebreak(final_transcript);
      if(final_span.innerHTML){
        console.log('recognized request - '+final_span.innerHTML);
      }
      if (final_transcript || interim_transcript) {
        showButtons('inline-block');
      }

      // var n = final_span.innerHTML.indexOf("stop recording");
      // var each_block = final_span.innerHTML.split(" ");
      // action_block

      let action_recognized = 0;
      // stop recording
        var n = final_span.innerHTML.indexOf("stop recording");
        // console.log(n);
        var n_caps = final_span.innerHTML.indexOf("Stop recording");
        var listen = final_span.innerHTML.indexOf("stop listening");
        var listen_caps = final_span.innerHTML.indexOf("Stop listening");
        if((n > -1) || (n_caps > -1) || (listen > -1) || (listen_caps > -1) ){
          recognition.stop();
          console.log('recognition stopped');
          action_recognized = 1;
        }

      // clear text
        var clear_signal = final_span.innerHTML.indexOf("clear");
        if(clear_signal != -1){
          final_transcript = '';
          final_span.innerHTML = '';
          console.log('cleared');
          action_recognized = 1;
        }

      // main action
        if(final_span.innerHTML){
          if(action_recognized == 0){
            var response_direct = processVoiceInput(final_span.innerHTML);
            if(response_direct){
              // console.log('perform action');
              // console.log(response_direct);
              // console.log(response_direct.action_type);
              // console.log(response_direct.action_value);
              if(response_direct.action_type == 'redirect'){
                console.log('redirecting to '+response_direct.action_value);
                window.location.href = response_direct.action_value;

              } else if(response_direct.action_type == 'call_function'){
                console.log('calling function '+response_direct.action_value);
                // speakAbout
                var method_name = response_direct.action_value;
                // Call function:
                window[method_name]();

              } else if(response_direct.action_type == 'call_previous'){
                if(history.length> 0){
                  window.history.back();
                } else {
                  alert('Unable to find previous page.');
                }
              }

              final_span.innerHTML = '';
              final_transcript = '';
            }
          }
        }
      // main action ends
    };
  }
  $('#final_version').on('change', function(){
    $('#final_version *').each(function (index) {
      alert('index' + index + ', text: ' + $(this).text());
    });
  });

  // other
    function upgrade() {
      start_button.style.visibility = 'hidden';
      showInfo('info_upgrade');
    }

    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    function startButton(event) {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.lang = select_dialect.value;
      recognition.start();
      ignore_onend = false;
      final_span.innerHTML = '';
      start_img.src = 'mic-slash.gif';
      showInfo('info_allow');
      showButtons('none');
      start_timestamp = event.timeStamp;
    }

    function showInfo(s) {
      if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
          if (child.style) {
            child.style.display = child.id == s ? 'inline' : 'none';
          }
        }
        info.style.visibility = 'visible';
      } else {
        info.style.visibility = 'hidden';
      }
    }

    var current_style;
    function showButtons(style) {
      if (style == current_style) {
        return;
      }
      current_style = style;
      // copy_button.style.display = style;
      // email_button.style.display = style;
      // copy_info.style.display = 'none';
      // email_info.style.display = 'none';
    }
  // other ends

  function processVoiceInput(final_span){
    console.log('--Processing: '+final_span);
    // processing actual array
      // console.log(action_block);
      var actual_array = {};
      var index = 0;
      $.each(action_block, function( k, v ) {
        var each_parameter = k.split(",");
        $.each(each_parameter, function( kk, kv ) {
          kv = kv.toLowerCase();
          if(actual_array[index]){
            actual_array[index][kv] = 0;
          } else {
            actual_array[index] = [];
            actual_array[index][kv] = 0;
          }
        });
        actual_array[index]['total999'] = 0;
        index++;
      });
      // console.log('final actual array');
      // console.log(actual_array);
    // processing actual array ends

    // processing request and combining with actual array
      var request_array = final_span.split(" ");
      $.each(request_array, function( k, v ) {
        v = v.toLowerCase();

        // console.log('+++++++New++++++');
        $.each(actual_array, function( kk, kv ) {
          for (x in kv) {
            // console.log(x+': '+kv[x]);
            if(x == v){
              kv[x]++;
              kv['total999']++;
            }
          }
        });
        index++;
      });
      // console.log('final request array');
      // console.log(actual_array);
    // processing request and combining with actual array ends

    // getting max total
      var winning_action = {winners:[]};
      $.each(actual_array, function( kk, kv ) {
        winning_action.winners.push({id: kk,total_val:kv['total999']});
      });
      // console.log('totals');
      // console.log(winning_action);

      let x122 = JSON.stringify(winning_action.winners.reduce(function(prev, current) { 
        return (prev.total_val > current.total_val) ? prev : current 
      })); 
      // console.log(x122);
      let oo = JSON.parse(x122);
      // console.log(oo.id);
      console.log('chances '+oo.total_val);
    // getting max total ends

    // getting actual action to perform by matching
      var win_keys;
      var win_values;
      for (var i=0; i<Object.keys(action_block).length; i++) {
        if(i == oo.id){
          win_keys = Object.keys(action_block)[i];
          win_values = Object.values(action_block)[i];
        }
      }
      // console.log('action to call');
      // console.log(win_keys);
      // console.log(win_values);
    // getting actual action to perform by matching ends
    
    return win_values;
  }
  // processVoiceInput('redirect visit about us page'); // winner - row 1
  // processVoiceInput('Visit contact us page'); // winner - row 1
// <!-- voice and required script ends -->