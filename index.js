'use strict';

const client = require('rotonde-client/node/rotonde-client')('ws://rotonde:4224');

const manualSettings = {
  ArmTime: '1000',
  ArmTimeoutAutonomous: 'DISABLED',
  ArmedTimeout: 0,
  Arming: 'Switch+Throttle',
  ChannelGroups: {
    Accessory0: 'S.Bus',
    Accessory1: 'None',
    Accessory2: 'None',
    Arming: 'S.Bus',
    Collective: 'None',
    FlightMode: 'S.Bus',
    Pitch: 'S.Bus',
    Roll: 'S.Bus',
    Throttle: 'S.Bus',
    Yaw: 'S.Bus'
  },
  ChannelMax: {
    Accessory0: 800,
    Accessory1: 0,
    Accessory2: 0,
    Arming: 1696,
    Collective: 0,
    FlightMode: 1696,
    Pitch: 1696,
    Roll: 1696,
    Throttle: 352,
    Yaw: 1696
  },
  ChannelMin: {
    Accessory0: 800,
    Accessory1: 0,
    Accessory2: 0,
    Arming: 352,
    Collective: 0,
    FlightMode: 352,
    Pitch: 352,
    Roll: 352,
    Throttle: 1696,
    Yaw: 352
  },
  ChannelNeutral: {
    Accessory0: 800,
    Accessory1: 65535,
    Accessory2: 65535,
    Arming: 1024,
    Collective: 65535,
    FlightMode: 1024,
    Pitch: 1040,
    Roll: 1025,
    Throttle: 1669,
    Yaw: 1029
  },
  ChannelNumber: {
    Accessory0: 8,
    Accessory1: 0,
    Accessory2: 0,
    Arming: 7,
    Collective: 0,
    FlightMode: 6,
    Pitch: 2,
    Roll: 1,
    Throttle: 3,
    Yaw: 4
  },
  Deadband: 0,
  DisarmTime: '2000',
  FlightModeNumber: 2,
  FlightModePosition: ['Stabilized1',
    'AltitudeHold',
    'Stabilized1',
    'Stabilized1',
    'Stabilized1',
    'Stabilized1'
  ],
  RssiChannelNumber: 0,
  RssiMax: 2000,
  RssiMin: 1000,
  RssiType: 'None',
  Stabilization1Settings: {
    Pitch: 'Attitude',
    Roll: 'Attitude',
    Yaw: 'Rate'
  },
  Stabilization2Settings: {
    Pitch: 'Attitude',
    Roll: 'Attitude',
    Yaw: 'Rate'
  },
  Stabilization3Settings: {
    Pitch: 'Attitude',
    Roll: 'Attitude',
    Yaw: 'Rate'
  }
};

let currentArmSwitch = false;
client.eventHandlers.attach('MANUALCONTROLCOMMAND', (e) => {
  let armSwitch = e.data.Channel.Arming > 800;
  if (currentArmSwitch == armSwitch) {
    return;
  }
  currentArmSwitch = armSwitch;
  if (currentArmSwitch == true) {
    console.log('Sending settings !');
    client.sendAction('SET_MANUALCONTROLSETTINGS', manualSettings);
  }
});

client.onReady(() => {
  const WATCHED_UAVO = ['MANUALCONTROLCOMMAND'];
  console.log('Connected');
  client.bootstrap({
    'SET_MANUALCONTROLCOMMANDMETA': 
      {"modes": 16, "periodFlight": 300, "periodGCS": 0, "periodLog": 0},
    'GET_MANUALCONTROLSETTINGS': {}
  }, ['MANUALCONTROLSETTINGS'], ['MANUALCONTROLCOMMAND']).then((e) => {
    console.log(e[0]);
  });
});

client.connect();
