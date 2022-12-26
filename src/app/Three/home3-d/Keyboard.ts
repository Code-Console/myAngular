const resetValue = {
  sx: 0,
  sy: 0,
  sz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  reset: false,
};

export const dealWithKeyboard = (e: any) => {
  if (!window?.setKey?.sx) {
    window["setKey"] = resetValue;
  }
  const keys = window["setKey"];
  const vs = 1,
    rs = 0.1;
  switch (e.keyCode) {
    case 37:
      keys.sx = keys.sx - vs;
      break;
    case 38:
      keys.sz = keys.sz + vs;
      break;
    case 39:
      keys.sx = keys.sx + vs;
      break;
    case 40:
      keys.sz = keys.sz - vs;
      break;
    case 65:
      keys.sy = keys.sy + vs;
      break;
    case 66:
    case 90:
      keys.sy = keys.sy - vs;
      break;
    case 49:
    case 97:
      keys.rx = keys.rx - rs;
      break;
    case 50:
    case 98:
      keys.rx = keys.rx + rs;
      break;
    case 52:
    case 100:
      keys.ry = keys.ry - rs;
      break;
    case 53:
    case 101:
      keys.ry = keys.ry + rs;
      break;
    case 55:
    case 103:
      keys.rz = keys.rz - rs;
      break;
    case 56:
    case 104:
      keys.rz = keys.rz + rs;
      break;
    case 57:
    case 105:
      keys.sx = keys.sy = keys.sz = 0;
      break;
    case 54:
    case 102:
      keys.rx = keys.ry = keys.rz = 0;
      break;
    case 32:
      keys.reset = true;
      break;
  }
  console.log(e.keyCode, JSON.stringify(keys));
};
