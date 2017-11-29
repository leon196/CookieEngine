
var Key = function (code)
{
  this.down = false;
  this.code = code;
};

var Keyboard = {};

Keyboard.P = new Key(80);
Keyboard.Space = new Key(32);
Keyboard.Left = new Key(37);
Keyboard.Right = new Key(39);
Keyboard.M = new Key(77);

Keyboard.onKeyDown = function (event)
{
  for (var propertyName in Keyboard) {
    if (Keyboard.hasOwnProperty(propertyName) && Keyboard[propertyName] instanceof Key && event.keyCode == Keyboard[propertyName].code) {
      Keyboard[propertyName].down = true;
    }
  }
};

Keyboard.onKeyUp = function (event)
{
  // console.log(event.keyCode)
  for (var propertyName in Keyboard) {
    if (Keyboard.hasOwnProperty(propertyName) && Keyboard[propertyName] instanceof Key && event.keyCode == Keyboard[propertyName].code) {
      Keyboard[propertyName].down = false;
    }
  }
};

Keyboard.setup = function () {
  document.addEventListener('keydown', Keyboard.onKeyDown);
  document.addEventListener('keyup', Keyboard.onKeyUp);
};

export default Keyboard;
