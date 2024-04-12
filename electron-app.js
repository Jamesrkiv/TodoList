// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////////////////

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { contextBridge, ipcRenderer } = require('electron/renderer');
const path = require('node:path');
var Datastore = require('nedb')
  , db = new Datastore({ filename: './todoData', autoload: true });

// APP FUNCTIONALITY ////////////////////////////////////////////////////////////////////////////////////////

// Create app window
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
		}
	});
	win.loadFile('todoApp.html');
}

// Quit app if all windows closed
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// Run after process start
app.whenReady().then(() => {
	createWindow();
	// Open window if none are open
	app.on('activate', () => {
    	if (BrowserWindow.getAllWindows().length === 0) createWindow()
  	});
  	ipcMain.handle('testing', test);
});

// ADDITIONAL FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////

function test() {
	console.log("Test");
}
