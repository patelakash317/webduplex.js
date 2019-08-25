**Welcome to Webdupe.js - Web Voice Action using Speech Plugin**
Kind of Google Duplex for Web

Demo: https://patelakash317.github.io/webdupe

For any issues or help relating to implementation: write us at https://github.com/patelakash317/webdupe.js/issues

Usage and demo:
 Watch video: https://www.youtube.com/watch?v=d9e856UzYw4
 Page redirection: https://www.youtube.com/watch?v=LzZLN99hQAw&t=1s

**Integration/Setup:**
  - **Step 1**: Add 
    
    - **CSS**: /assets/webdupe/css/**webdupe.min.css**

    - **JS**: /assets/webdupe/js/**webdupe.min.js** in your website - after jquery-3.3.1.min.js and bootstrap.min.js
  
  - **Step 2**: use "**action_block**" variable to add/map various keyword to recognise and mention appropriate actions to be carried out against it

**Basic commands:**
   - **Stop listening**: To stop listening

   - **Clear**: To clear existing commands

**Variables [in same format]:**
   - **action_block**: Config variable for setup
       - **action_type**: Action type: redirect, call_function OR call_previous

       - **action_value:** 
          - If **action_type = redirect** (Example watch video: https://www.youtube.com/watch?v=LzZLN99hQAw&t=1s)
            
            - **action_value** contains URL here, ex: http://example.com/about.html

          - If **action_type = call_function**
            
            - **action_value** enter function name here, ex: speakAbout 
            
            - Note: function must be without () braces

          - If **action_type = call_previous**
            
            - **action_value** keep this empty

**Sample**
```
action_block = {
  'show_status': false, // to show status, Quick, Speak now, Errors etc.
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
  'need,some,help': { // i need some help
    action_type: 'call_function',
    action_value: 'speakWhatHelp',
  },
};
```
      

**Specified functions [in same format]:**
   - **speakAbout**: As specified in above code, used to call when about is recognised 
        [Note: define function after defining variable "action_block"]

**Sample** (Example watch video: https://www.youtube.com/watch?v=d9e856UzYw4)
```
function speakAbout(){
  console.log('About function called. Add or do activity like speaking about this website.');
}
```

```
function speakWhatHelp(){
  console.log('Help function called. add or do activity like replying "How can I help you?"');
  startRecognizingManually(); // to start recognising again manually
}
```