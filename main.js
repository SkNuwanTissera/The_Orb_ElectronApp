const {app, BrowserWindow} = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron','public')
});

const url = require('url');
const soc = require('./public/services/request.service');
const io = require('socket.io-client');
const clientid = "OrbAppbdfjgffgdsg#RE%FGD$#dfghgfhDFfxcBBvcGfdGHT%$^#$DSFF"

var ipcMain = require('electron').ipcMain;


global.sharedObj = {url: null};


looper();


function looper(){

    soc.Request();

    global.sharedObj.url = soc.SocUri();

    if(!global.sharedObj.url){
        console.log('searching Super node Uri' )
        setTimeout(function () {
            console.log('Req : '+soc.SocUri());
            global.sharedObj.url = soc.SocUri();
            looper();
        },500);
    }else{
        console.log('loop exist : run app')
    }
}

/*
Connect to client
 */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 900, height: 600})

    // and load the dashboard.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'public/index.html'),
        protocol: 'file:'
    }))

    // Open the DevTools.
    win.webContents.openDevTools()
    win.setMenu(null)

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);




// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// app.set('port', process.env.PORT || 5555);
