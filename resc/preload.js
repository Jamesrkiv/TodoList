const { contextBridge, ipcRenderer } = require('electron/renderer');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

contextBridge.exposeInMainWorld('electronAPI', {
  test: (exVar) => ipcRenderer.invoke('testing', exVar),
  load: () => ipcRenderer.invoke('loadData'),
  save: (doc) => ipcRenderer.invoke('saveData', doc),
  delete: (idn) => ipcRenderer.invoke('delData', idn),
  loadOrder: () => ipcRenderer.invoke('loadOrder'),
  saveOrder: (doc) => ipcRenderer.invoke('saveOrder', doc),
});