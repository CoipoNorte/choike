import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { exec } from 'child_process'

if (process.platform === 'win32') {
  app.setAppUserModelId('com.choike.app')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 850,
    title: 'Choike',
    icon: join(__dirname, '../../src/renderer/public/icon.ico'),
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      sandbox: false,
      contextIsolation: true
    },
    autoHideMenuBar: true
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    win.loadURL(devUrl)
  }
}

ipcMain.handle('open-directory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  return canceled ? null : filePaths[0]
})

ipcMain.handle('run-command', async (_event, { command, cwd }) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) reject(stderr || error.message)
      resolve(stdout)
    })
  })
})

app.whenReady().then(createWindow)