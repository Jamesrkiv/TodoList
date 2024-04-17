var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
	appDirectory: './out/Todo-win32-x64',
	outputDirectory: './out/installer64',
	authors: 'James Kent',
	exe: 'Todo.exe',
	setupIcon: './resc/icon.ico',
	noMsi: true,
	description: 'A simple todo list application',
	certificateFile: './resc/cert.pfx',
    certificatePassword: process.env.CERTIFICATE_PASSWORD,
});

resultPromise.then(() => console.log("Winstaller complete!"), (e) => console.log(`No dice: ${e.message}`));