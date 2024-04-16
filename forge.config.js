module.exports = {
  packagerConfig: {
    name: 'Todo',
    icon: './resc/icon',
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      // iconUrl: '',
      setupIcon: './resc/icon.ico',
      config: {
        certificateFile: './cert.pfx',
        certificatePassword: process.env.CERTIFICATE_PASSWORD
      },
    }
  ]
};