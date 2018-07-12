const {app, BrowserWindow} = require('electron')
const path = require('path')

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

const url = require('url')
const io = require('socket.io-client');
const clientid = "OrbAppbdfjgffgdsg#RE%FGD$#dfghgfhDFfxcBBvcGfdGHT%$^#$DSFF"

/*
Connect to client
 */

/*
var socket = io('http://localhost:3000');

socket.on('connect',function(){
    console.log("connect to client");
    socket.on('register', function (data) {
        console.log(data)
        socket.emit('reg-req', { clientid: clientid })

    })

    socket.on('event', function(data){
        console.log(data)
    });

    socket.on('new-fun', function (data) {
        let sentObj = {
            destinationSocketId: data.destinationSocketId,
            destinationClientId: data.destinationClientId,
            id: data.id,
            name: data.name,
            fn: data.fn
        }

        let fnsList = _.unionBy([sentObj], funArr, 'id')
        funArr = fnsList
    })

    socket.on('answer-seek', function (data, callback) {
        console.log('============ Answering machine ============')
        const params = data.params
        const fnObj = data.fnobj

        for(let fn of funArr) {
            if(fn.name == fnObj.name) {
                let actualfn = fn.fn
                let res = eval("("+actualfn+")")
                let ans = res(params)
                callback(ans)
            }
        }
        console.log('============ Answering machine ended============')

    })

    socket.on('fnlist', function (data) {
        console.log(data)
    })

    socket.on('disconnect', function(){
        console.log('Disconneted')
    });

    socket.on('heartbeat', function (data) {
        console.log(data)
    })

    socket.on('answer', function (data) {
        console.log(data);
        //socket.emit('my other event', { my: 'data' });
    });

});

*/

// call_function();
// function call_function() {
//         var params = [1,32323];
//         var name = "addAll";
//         socket.emit('fcall', {clientId: clientid ,fname: name, params: params, socketId: socket.id})
// }
//
// function getFunctionList() {
//     socket.emit('flist', {socketId: socket.id}, function (data) {
//         if (data) {
//             return res.status(200).send(data)
//         }
//         return res.status(204).send()
//     })
// }

// app.get('/', (req, res) => {
//     res.status(200).send()
// })
//
// app.get('/peers', (req, res) => {
//     res.status(200).send(superNodeArr)
// })
//
//
// app.get('/:id', (req, res) => {
//
//     res.status(200).send()
// })






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
app.on('ready', createWindow)

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
