# Light version of https://github.com/KoltesDigital/websocket-server-for-blender
# Plus export curves on save

bl_info = {
    "name": "Demoscene",
    "author": "Jonathan Giroux",
    "version": (1, 0, 0),
    "blender": (2, 70, 0),
    "location": "File > Export",
    "description": "For demo productions.",
    "warning": "",
    "wiki_url": "https://github.com/KoltesDigital/websocket-server-for-blender",
    "category": "Import-Export",
}

import bpy
from bpy.app.handlers import persistent
from bpy.props import BoolProperty, IntProperty, StringProperty
from bpy.types import AddonPreferences, Operator, Panel
from bpy_extras.io_utils import orientation_helper_factory

from json import JSONEncoder
import os
import threading

from wsgiref.simple_server import make_server
from ws4py.websocket import WebSocket as _WebSocket
from ws4py.server.wsgirefserver import WSGIServer, WebSocketWSGIRequestHandler
from ws4py.server.wsgiutils import WebSocketWSGIApplication

def stringify(data):
    return JSONEncoder(separators=(",", ":")).encode(data)

def broadcast(sockets, message):
    for socket in sockets:
        socket.send(message)

def send_refresh(sockets, filepath):
    broadcast(sockets, stringify(("refresh", filepath)))

def send_time(sockets):
    scene = bpy.context.scene
    time = scene.frame_current / scene.render.fps * scene.render.fps_base
    broadcast(sockets, stringify(("time", time)))

sockets = []

class WebSocketApp(_WebSocket):
    def opened(self):
        send_time([self])
        sockets.append(self)

    def closed(self, code, reason=None):
        sockets.remove(self)

@persistent
def frame_change_post(context):
    send_time(sockets)

@persistent
def load_post(context):
    send_time(sockets)

@persistent
def save_post(context):
    addon_prefs = bpy.context.user_preferences.addons[__name__].preferences

    filepath = bpy.path.abspath(addon_prefs.filepath)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    bpy.ops.html5_animations.export(
        filepath=filepath,
        format='JSON',
        js_json_pretty_formatting=addon_prefs.js_json_pretty_formatting,
        change_coordinate_system=addon_prefs.change_coordinate_system,
        axis_forward=addon_prefs.axis_forward,
        axis_up=addon_prefs.axis_up
    )

    send_refresh(sockets, addon_prefs.filepath)

wserver = None

def start_server(host, port):
    global wserver
    if wserver:
        return False

    wserver = make_server(host, port,
        server_class=WSGIServer,
        handler_class=WebSocketWSGIRequestHandler,
        app=WebSocketWSGIApplication(handler_cls=WebSocketApp)
    )
    wserver.initialize_websockets_manager()

    wserver_thread = threading.Thread(target=wserver.serve_forever)
    wserver_thread.daemon = True
    wserver_thread.start()

    bpy.app.handlers.frame_change_post.append(frame_change_post)
    bpy.app.handlers.load_post.append(load_post)
    bpy.app.handlers.save_post.append(save_post)

    return True

def stop_server():
    global wserver
    if not wserver:
        return False

    wserver.shutdown()
    for socket in sockets:
        socket.close()

    wserver = None

    bpy.app.handlers.frame_change_post.remove(frame_change_post)
    bpy.app.handlers.load_post.remove(load_post)
    bpy.app.handlers.save_post.remove(save_post)

    return True


OrientationHelper = orientation_helper_factory("DemosceneOrientationHelper", axis_forward='-Z', axis_up='Y')


class WebSocketServerSettings(AddonPreferences, OrientationHelper):
    bl_idname = __name__

    auto_start = BoolProperty(
        name="Start automatically",
        description="Automatically start the server when loading the add-on",
        default=True
    )

    host = StringProperty(
        name="Host",
        description="Listen on host:port",
        default="localhost"
    )

    port = IntProperty(
        name="Port",
        description="Listen on host:port",
        default=8137,
        min=0,
        max=65535,
        subtype="UNSIGNED"
    )

    filepath = StringProperty(
        name="File (JSON)",
        description="File to save into",
        default="//../animation/scene.json"
    )

    js_json_pretty_formatting = BoolProperty(
        name="Pretty Formatting",
        description="If true, format with indents and line breaks.",
        default=True,
    )

    change_coordinate_system = BoolProperty(
        name="Change coordinate system",
        description="Affected data paths: location, rotation_axis, rotation_euler, rotation_quaternion, scale + delta_",
        default=False,
    )

    def draw(self, context):
        layout = self.layout

        row = layout.row()
        split = row.split(percentage=0.3)

        col = split.column()
        col.prop(self, "host")
        col.prop(self, "port")
        col.separator()

        col.prop(self, "auto_start")

        if wserver:
            col.operator(Stop.bl_idname, icon='QUIT', text="Stop server")
        else:
            col.operator(Start.bl_idname, icon='QUIT', text="Start server")

        col = split.column()

        col.prop(self, 'filepath')
        col.prop(self, 'js_json_pretty_formatting')

        col.prop(self, "change_coordinate_system")
        if self.change_coordinate_system:
            col.prop(self, "axis_forward")
            col.prop(self, "axis_up")

class Start(Operator):
    """Start WebSocket server"""
    bl_idname = "websocket_server.start"
    bl_label = "Start WebSocket server"

    def execute(self, context):
        addon_prefs = context.user_preferences.addons[__name__].preferences
        if not start_server(str(addon_prefs.host), int(addon_prefs.port)):
            self.report({"ERROR"}, "The server is already started.")
            return {"CANCELLED"}
        return {"FINISHED"}

class Stop(Operator):
    """Stop WebSocket server"""
    bl_idname = "websocket_server.stop"
    bl_label = "Stop WebSocket server"

    def execute(self, context):
        if not stop_server():
            self.report({"ERROR"}, "The server is not started.")
            return {"CANCELLED"}
        return {"FINISHED"}

def register():
    bpy.utils.register_module(__name__)

    addon_prefs = bpy.context.user_preferences.addons[__name__].preferences
    if bool(addon_prefs.auto_start):
        start_server(str(addon_prefs.host), int(addon_prefs.port))

def unregister():
    stop_server()
    bpy.utils.unregister_module(__name__)

if __name__ == "__main__":
    register()
