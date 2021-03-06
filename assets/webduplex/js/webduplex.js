// Copyright 2019 Akash Patel (@patelakash317)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
$("body").append('<div id="final_version"></div><div class="action_block"><div id="info"><p id="info_start">Quick</p>\x3c!-- <p id="info_start">Click on the microphone icon and begin speaking.</p> --\x3e<p id="info_speak_now">Speak now.</p><p id="info_no_speech">No speech was detected. You may need to adjust your<a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.</p><p id="info_no_microphone" style="display:none">No microphone was found. Ensure that a microphone is installed and that<a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a> are configured correctly.</p><p id="info_allow">Click the "Allow" button above to enable your microphone.</p><p id="info_denied">Permission to use microphone was denied.</p><p id="info_blocked">Permission to use microphone is blocked. </p><p id="info_upgrade">Web Speech API is not supported by this browser.Upgrade to <a href="//www.google.com/chrome">Chrome</a>version 25 or later.</p></div><div class="action_block_content" id="start_button" onclick="startButton(event)"><div class="right"><img id="start_img" src="mic.gif" alt="Start"></div><div id="results" class="hide"><span id="final_span" class="final"></span><p></p></div></div></div><div id="div_language"><select id="select_language" onchange="updateCountry()"></select>&nbsp;&nbsp;<select id="select_dialect"></select></div>');
let action_block;
for (var langs = [
        ["English", ["en-CA", "Canada"],
            ["en-IN", "India"],
            ['hi-IN', 'India'],
            ['gu-IN', 'India']
        ]
    ], i = 0; i < langs.length; i++) select_language.options[i] = new Option(langs[i][0], i);

function updateCountry() {
    for (var n = select_dialect.options.length - 1; n >= 0; n--) select_dialect.remove(n);
    var e = langs[select_language.selectedIndex];
    for (n = 1; n < e.length; n++) select_dialect.options.add(new Option(e[n][1], e[n][0]));
    select_dialect.style.visibility = 1 == e[1].length ? "hidden" : "visible"
}
select_language.selectedIndex = 0, updateCountry();
function setEnglishRecognisition() {
  select_dialect.selectedIndex = 1;
}
setEnglishRecognisition();
function setHindiRecognisition() {
  select_dialect.selectedIndex = 2;
}
function setGujaratiRecognisition() {
  select_dialect.selectedIndex = 3;
}
showInfo("info_start");
var ignore_onend, start_timestamp, final_transcript = "",
    recognizing = !1;
if ("webkitSpeechRecognition" in window) {
    start_button.style.display = "inline-block";
    var recognition = new webkitSpeechRecognition;
    recognition.continuous = !0, recognition.interimResults = !0, recognition.onstart = function() {
        recognizing = !0, showInfo("info_speak_now"), start_img.src = "mic-animate.gif"
    }, recognition.onerror = function(n) {
        "no-speech" == n.error && (start_img.src = "mic.gif", showInfo("info_no_speech"), ignore_onend = !0), "audio-capture" == n.error && (start_img.src = "mic.gif", showInfo("info_no_microphone"), ignore_onend = !0), "not-allowed" == n.error && (n.timeStamp - start_timestamp < 100 ? showInfo("info_blocked") : showInfo("info_denied"), ignore_onend = !0)
    }, recognition.onend = function() {
        if (recognizing = !1, !ignore_onend && (start_img.src = "mic.gif", showInfo("info_start"), window.getSelection)) {
            window.getSelection().removeAllRanges();
            var n = document.createRange();
            n.selectNode(document.getElementById("final_span")), window.getSelection().addRange(n), console.log("end")
        }
    };
    var current_selected_element = "";
    recognition.onresult = function(n) {
        for (var e = "", i = n.resultIndex; i < n.results.length; ++i) n.results[i].isFinal ? final_transcript += n.results[i][0].transcript : e += n.results[i][0].transcript;
        final_span.innerHTML = linebreak(final_transcript), final_span.innerHTML && console.log("recognized request - " + final_span.innerHTML), (final_transcript || e) && showButtons("inline-block");
        let o = 0;
        var t = final_span.innerHTML.indexOf("stop recording"),
            a = final_span.innerHTML.indexOf("Stop recording"),
            s = final_span.innerHTML.indexOf("stop listening"),
            r = final_span.innerHTML.indexOf("Stop listening");
        if ((t > -1 || a > -1 || s > -1 || r > -1) && (recognition.stop(), console.log("recognition stopped"), o = 1), -1 != final_span.innerHTML.indexOf("clear") && (final_transcript = "", final_span.innerHTML = "", console.log("cleared"), o = 1), final_span.innerHTML && 0 == o) {
            var l = processVoiceInput(final_span.innerHTML);
            if (l) {
                if ("redirect" == l.action_type) console.log("redirecting to " + l.action_value), window.location.href = l.action_value;
                else if ("call_function" == l.action_type) {
                    console.log("calling function " + l.action_value);
                    var c = l.action_value;
                    window[c]()
                } else "call_previous" == l.action_type && (history.length > 0 ? window.history.back() : alert("Unable to find previous page."));
                final_span.innerHTML = "", final_transcript = ""
            }
        }
    }
} else upgrade();

function upgrade() {
    start_button.style.visibility = "hidden", showInfo("info_upgrade")
}
$("#final_version").on("change", function() {
    $("#final_version *").each(function(n) {
        alert("index" + n + ", text: " + $(this).text())
    })
});
var current_style, two_line = /\n\n/g,
    one_line = /\n/g;

function linebreak(n) {
    return n.replace(two_line, "<p></p>").replace(one_line, "<br>")
}

function startButton(n) {
    recognizing ? recognition.stop() : (final_transcript = "", recognition.lang = select_dialect.value, recognition.start(), ignore_onend = !1, final_span.innerHTML = "", start_img.src = "mic-slash.gif", showInfo("info_allow"), showButtons("none"), start_timestamp = n.timeStamp)
}

function showInfo(n) {
    if (n) {
        for (var e = info.firstChild; e; e = e.nextSibling) e.style && (e.style.display = e.id == n ? "inline" : "none");
        info.style.visibility = "visible"
    } else info.style.visibility = "hidden"
}

function showButtons(n) {
    n != current_style && (current_style = n)
}

function processVoiceInput(n) {
    console.log("--Processing: " + n);
    var e = {},
        i = 0;
    $.each(action_block, function(n, o) {
        var t = n.split(",");
        $.each(t, function(n, o) {
            o = o.toLowerCase(), e[i] ? e[i][o] = 0 : (e[i] = [], e[i][o] = 0)
        }), e[i].total999 = 0, i++
    });
    var o = n.split(" ");
    $.each(o, function(n, o) {
        o = o.toLowerCase(), $.each(e, function(n, e) {
            for (x in e) x == o && (e[x]++, e.total999++)
        }), i++
    });
    var t = {
        winners: []
    };
    $.each(e, function(n, e) {
        t.winners.push({
            id: n,
            total_val: e.total999
        })
    });
    let a = JSON.stringify(t.winners.reduce(function(n, e) {
            return n.total_val > e.total_val ? n : e
        })),
        s = JSON.parse(a);
    var r;
    console.log("chances " + s.total_val);
    for (var l = 0; l < Object.keys(action_block).length; l++) l == s.id && (Object.keys(action_block)[l], r = Object.values(action_block)[l]);
    return r
}
$('html').bind('keypress', function(e) {
    if ((e.shiftKey) && (e.charCode == 83)) {
        startButton(event);
    }
});
setTimeout(function() {
    if (!action_block.show_status) {
        $('#info').addClass('hide');
    }
}, 0);

function startRecognizingManually() {
    $('#start_button').click();
}