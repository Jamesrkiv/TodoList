const { contextBridge, ipcRenderer } = require('electron/renderer');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

contextBridge.exposeInMainWorld('electronAPI', {
  test: (exVar) => ipcRenderer.invoke('testing', exVar),
});