
var Mouse = {};

Mouse.x = 0;
Mouse.y = 0;
Mouse.down = false;

// Pan
Mouse.panX = 0;
Mouse.panY = 0;
Mouse.panStartX = 0;
Mouse.panStartY = 0;
Mouse.panStarted = false;

Mouse.onMove = function(event)
{
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
  if (Mouse.panStarted)
  {
    Mouse.panX = Mouse.x - Mouse.panStartX;
    Mouse.panY = Mouse.y - Mouse.panStartY;
  }
};

Mouse.onClic = function(event)
{
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	Mouse.down = true;

  // Pan
  Mouse.panStartX = Mouse.x - Mouse.panX;
  Mouse.panStartY = Mouse.y - Mouse.panY;
  Mouse.panStarted = true;
};

Mouse.onMouseUp = function(event)
{
	Mouse.down = false;
  Mouse.panStarted = false;
};

export default Mouse;
