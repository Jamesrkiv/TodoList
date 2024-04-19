// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////////////////

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { contextBridge, ipcRenderer } = require('electron/renderer');
const path = require('node:path');
const windowStateKeeper = require('electron-window-state');
let win;

// SQUIRREL CODE ////////////////////////////////////////////////////////////////////////////////////////////

if (require('electron-squirrel-startup')) /*app.quit();*/return;

if (handleSquirrelEvent()) {
	return;
}

// Yoinked function from electron's documentation
function handleSquirrelEvent() {
	if (process.argv.length === 1) {
		return false;
	}

	const ChildProcess = require('child_process');
	const appFolder = path.resolve(process.execPath, '..');
	const rootAtomFolder = path.resolve(appFolder, '..');
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
	const exeName = path.basename(process.execPath);

	const spawn = function(command, args) {
		let spawnedProcess, error;

		try {
			spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
		} catch (error) {}

		return spawnedProcess;
	};

	const spawnUpdate = function(args) {
		return spawn(updateDotExe, args);
	};

	const squirrelEvent = process.argv[1];
	switch (squirrelEvent) {
		case '--squirrel-install':
		case '--squirrel-updated':
			// Optionally do things such as:
			// - Add your .exe to the PATH
			// - Write to the registry for things like file associations and
			//   explorer context menus

			// Install desktop and start menu shortcuts
			spawnUpdate(['--createShortcut', exeName]);

			setTimeout(app.quit, 1000);
			return true;

		case '--squirrel-uninstall':
			// Undo anything you did in the --squirrel-install and
			// --squirrel-updated handlers

			// Remove desktop and start menu shortcuts
			spawnUpdate(['--removeShortcut', exeName]);

			setTimeout(app.quit, 1000);
			return true;

		case '--squirrel-obsolete':
			// This is called on the outgoing version of your app before
			// we update to the new version - it's the opposite of
			// --squirrel-updated

			app.quit();
			return true;
	}
};

// DATABASE /////////////////////////////////////////////////////////////////////////////////////////////////

var Datastore = require('nedb')
	, db1 = new Datastore({ filename: './resc/todoData', autoload: true })
	, db2 = new Datastore({ filename: './resc/ordrData', autoload: true });

// APP FUNCTIONALITY ////////////////////////////////////////////////////////////////////////////////////////

// Create app window
const createWindow = () => {
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800
	});
	const win = new BrowserWindow({
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		autoHideMenuBar: true,
		icon: __dirname + '/resc/icon.ico',
		webPreferences: {
			preload: path.join(__dirname, 'resc/preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		}
	});
	mainWindowState.manage(win);
	win.loadFile('resc/todoApp.html');
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
	ipcMain.handle('loadData', loadData);
	ipcMain.handle('saveData', saveData);
	ipcMain.handle('delData', delData);
	ipcMain.handle('loadOrder', loadOrder);
	ipcMain.handle('saveOrder', saveOrder);
});

// ADDITIONAL FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////

// db1 - Todo list data

function test(event, arg) {
	console.log("Test:", arg);
}

function loadData() {
	return new Promise((resolve, reject) => {
		db1.find({}, function (err, docs) {
			if (err) {
				console.error(err);
				resolve(null);
			}
			else {
				console.log("Data loaded");
				resolve(docs);
			}
		});
	});
}

function saveData(event, arg) {
	db1.insert(arg, function(err, newDoc) {
		if (err) console.error(err);
		else console.log("Data saved");
	});
}

function delData(event, arg) {
	db1.remove({idn:arg}, {}, function (err, numRemoved) {
		if (err) console.error(err);
		else console.log("Document deleted");
	});
}

// db2 - Custom sort order data, etc.

function loadOrder() {
	return new Promise((resolve, reject) => {
		db2.find({dataCat:'order'}, function (err, docs) {
			if (err) {
				console.error(err);
				resolve(null);
			}
			else {
				console.log("Order data loaded");
				resolve(docs);
			}
		});
	});
}

function saveOrder(event, arg) {
	db2.remove({dataCat:'order'}, {}, function (err, numRemoved) {
		if (err) console.error(err);
		else {
			db2.insert(arg, function(err, newDoc) {
				if (err) console.error(err);
				else console.log("Order data overwritten");
			});
		}
	});
}