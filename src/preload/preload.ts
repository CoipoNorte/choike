import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('choikeAPI', {
  openDirectory: () => ipcRenderer.invoke('open-directory'),
  runCommand: (args: { command: string, cwd: string }) => ipcRenderer.invoke('run-command', args)
})