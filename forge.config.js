module.exports = {
  packagerConfig: {
    name: 'Todo',
    icon: './icon',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      // iconUrl: '',
      setupIcon: './icon.ico',
      config: {
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      },
    }
  ]
};