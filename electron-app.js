// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////////////////

const { app, BrowserWindow } = require('electron');

// FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////////////

// Create app window
const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600
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
  	})
});