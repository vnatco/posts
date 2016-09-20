### Installation
1. Create new database and import a SQL file **DATABASE.sql**
2. Change the database connection configuration in **php/config.inc.php**
3. Set value of **SITE_URL** to the project full url in **php/config.inc.php**
4. If project is located in folder, change RewriteBase in **.htaccess** from **/** to **/path/to/folder/**
5. Make **/files** folder writeable

### Tips
* To **add**/**edit**/**delete** items, open **Context Menu**.
* To open **Context Menu**, press and hold mouse right button on empty space.
* You can move around articles listed in the group, press and hold mouse left button on article title.
* If groups does not fit the screen, use **left** and **right** keyboard keys to navigate between groups.
* One more way to scroll groups is to hold **CTRL** key and move **Mouse Wheel**

### Example (Read Only)
http://posts.examples.vnat.co

### To-Do
Create own authentication form in **auth.php**.

### How to Use
![Open Context Menu](images/1.gif?raw=true)  
![Drag Posts](images/2.gif?raw=true)  
![Navigate Between Groups](images/3.gif?raw=true)  
![Create Post](images/4.gif?raw=true)  

### Libraries Used
[TinyMCE](https://www.tinymce.co)  
[CodeMirro](https://codemirror.net/)  