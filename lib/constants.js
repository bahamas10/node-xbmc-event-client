var constants = {
  DEFAULT_PORT : 9777,
  DEFAULT_HOST : 'localhost',

  SIGNATURE : 'XBMC',
  MAJOR     : 2,
  MINOR     : 0,

  MAX_PACKET_SIZE  : 1024,
  HEADER_SIZE      : 32,

  PT_HELO         : 0x01,
  PT_BYE          : 0x02,
  PT_BUTTON       : 0x03,
  PT_MOUSE        : 0x04,
  PT_PING         : 0x05,
  PT_BROADCAST    : 0x06,
  PT_NOTIFICATION : 0x07,
  PT_BLOB         : 0x08,
  PT_LOG          : 0x09,
  PT_ACTION       : 0x0A,
  PT_DEBUG        : 0xFF,

  ICON_NONE : 0x00,
  ICON_JPEG : 0x01,
  ICON_PNG  : 0x02,
  ICON_GIF  : 0x03,

  BT_USE_NAME   : 0x01,
  BT_DOWN       : 0x02,
  BT_UP         : 0x04,
  BT_USE_AMOUNT : 0x08,
  BT_QUEUE      : 0x10,
  BT_NO_REPEAT  : 0x20,
  BT_VKEY       : 0x40,
  BT_AXIS       : 0x80,
  BT_AXISSINGLE : 0x100,

  MS_ABSOLUTE : 0x01,

  LOGDEBUG   : 0x00,
  LOGINFO    : 0x01,
  LOGNOTICE  : 0x02,
  LOGWARNING : 0x03,
  LOGERROR   : 0x04,
  LOGSEVERE  : 0x05,
  LOGFATAL   : 0x06,
  LOGNONE    : 0x07,

  ACTION_EXECBUILTIN : 0x01,
  ACTION_BUTTON      : 0x02,
};
constants.MAX_PAYLOAD_SIZE = constants.MAX_PACKET_SIZE - constants.HEADER_SIZE;

module.exports = constants;

