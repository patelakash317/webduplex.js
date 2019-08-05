Welcome to WebDupe - Web Voice Action using Speech Plugin
Kind of Google Duplex for Web

Basic commands:
   - Stop listening: To stop listening

   - Clear: To clear existing commands


Working/Setup:
Files [in same format]:
CSS: main_voice_recogise.css
JS: jquery-3.3.1.min.js, bootstrap.min.js, main_voice_recogise.js



Variables [in same format]:
   - action_block: Config variable for setup
       - action_type: Action type: redirect, call_function OR call_previous

       - action_value: 
          If action_type = redirect 
             - enter URL here, ex: http://example.com/about.html

          If action_type = call_function 
             - enter function name, ex: speakAbout [Note: without () function braces]

          If action_type = call_previous 
             - keep this empty


   Sample
         let action_block = {
          'contact,contact us': { // keywords for redirecting to contact page
            action_type: 'redirect',
            action_value: 'http://localhost/webspeechdemo/contact.html',
          },
          'about,info,about us': { // keywords to call "speakAbout" function on about recognisation
            action_type: 'call_function', 
            action_value: 'speakAbout',
          },
          'back,previous page': { // keywords to identify to go back
            action_type: 'call_previous',
            action_value: '',
          },
        };
      

Specified functions [in same format]:
   - speakAbout: As specified in above code, used to call when about is recognised 
     [Note: define function after defining variable "action_block"]

   Sample
         function speakAbout(){
          console.log('speak about call function called');
        }
      