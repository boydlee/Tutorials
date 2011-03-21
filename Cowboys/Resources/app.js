// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//create the menu window
//this will give us the 1 or 2 player options
var menuWindow = Titanium.UI.createWindow({
    url: 'menu.js',
    width: 480,
    height: 320
});

//open the window
menuWindow.open();