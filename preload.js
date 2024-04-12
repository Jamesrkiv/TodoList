const { contextBridge, ipcRenderer } = require('electron/renderer');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

contextBridge.exposeInMainWorld('electronAPI', {
  test: () => ipcRenderer.invoke('testing'),
});