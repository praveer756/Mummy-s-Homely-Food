# -*- coding: utf-8 -*-
"""Mummy's Homely Food — procedural Blender scene generator.
Enhanced with multi-camera rendering and GLTF/GLB export for web motion animation.
"""

import bpy
import math
import os
import random
from mathutils import Vector

# -----------------------------------------------------------------------------
# USER SETTINGS
# -----------------------------------------------------------------------------
BUILDING_WIDTH = 18.0
BUILDING_DEPTH = 9.0
GROUND_FLOOR_Z = 0.25
FIRST_FLOOR_Z = 3.45
ROOF_EAVE_Z = 6.65

FRONT_ROOF_CUTAWAY = True

RENDER_ON_BUILD = True
RENDER_WIDTH = 1920
RENDER_HEIGHT = 1080
RENDER_SAMPLES = 48

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "public", "images", "3d"))
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(os.path.join(SCRIPT_DIR, "output"), exist_ok=True)

BLEND_OUTPUT = os.path.join(SCRIPT_DIR, "output", "mummys_homely_food_scene.blend")
GLB_OUTPUT = os.path.join(PUBLIC_DIR, "mummys_homely_food.glb")

HERO_RENDER_OUTPUT = os.path.join(PUBLIC_DIR, "blender-hero-exterior.png")
GROUND_RENDER_OUTPUT = os.path.join(PUBLIC_DIR, "blender-ground-entrance.png")
UPPER_RENDER_OUTPUT = os.path.join(PUBLIC_DIR, "blender-upper-deck.png")

random.seed(24)

# -----------------------------------------------------------------------------
# RESET SCENE AND GENERAL HELPERS
# -----------------------------------------------------------------------------
def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras,
                       bpy.data.lights, bpy.data.materials):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)

clear_scene()

def mat(name, color, roughness=0.72, metallic=0.0, emission_color=None, emission_strength=0.0):
    material = bpy.data.materials.get(name)
    if material is None:
        material = bpy.data.materials.new(name)
    material.diffuse_color = (color[0], color[1], color[2], 1.0)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (color[0], color[1], color[2], 1.0)
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if emission_color:
            if "Emission Color" in bsdf.inputs:
                bsdf.inputs["Emission Color"].default_value = (emission_color[0], emission_color[1], emission_color[2], 1.0)
            elif "Emission" in bsdf.inputs:
                bsdf.inputs["Emission"].default_value = (emission_color[0], emission_color[1], emission_color[2], 1.0)
            if "Emission Strength" in bsdf.inputs:
                bsdf.inputs["Emission Strength"].default_value = emission_strength
    return material


def noisy_material(material, scale=28.0, strength=0.12, distance=0.045):
    if not material.use_nodes:
        material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    if bsdf is None or nodes.get("Procedural Noise"):
        return material
    noise = nodes.new("ShaderNodeTexNoise")
    noise.name = "Procedural Noise"
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 3.0
    noise.inputs["Roughness"].default_value = 0.72
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = distance
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return material


def apply_material(obj, material):
    if material is not None and obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.clear()
        obj.data.materials.append(material)
    return obj


def box(name, location, dimensions, material=None, bevel=0.025, rotation=None):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if rotation is not None:
        obj.rotation_euler = rotation
    apply_material(obj, material)
    if bevel > 0:
        modifier = obj.modifiers.new("Small edge bevels", 'BEVEL')
        modifier.width = bevel
        modifier.segments = 2
        modifier.profile = 0.5
    return obj


def sphere(name, location, radius, material, ico=False, subdivisions=1):
    if ico:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=radius, location=location)
    else:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=radius, location=location)
    obj = bpy.context.object
    obj.name = name
    apply_material(obj, material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def cylinder_between(name, start, end, radius, material, vertices=10):
    a = Vector(start)
    b = Vector(end)
    delta = b - a
    length = delta.length
    if length <= 0.0001:
        return None
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=length,
                                        location=(a + b) / 2.0)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = delta.to_track_quat('Z', 'Y')
    apply_material(obj, material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


def beam_between(name, start, end, thickness, material, rectangular=True):
    a = Vector(start)
    b = Vector(end)
    delta = b - a
    length = delta.length
    if length <= 0.0001:
        return None
    if not rectangular:
        return cylinder_between(name, start, end, thickness * 0.5, material, vertices=8)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(a + b) / 2.0)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = (thickness, thickness, length)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = delta.to_track_quat('Z', 'Y')
    apply_material(obj, material)
    return obj


def choose_font(candidates):
    for path in candidates:
        if path and os.path.exists(path):
            try:
                return bpy.data.fonts.load(path)
            except Exception:
                pass
    return None


EN_FONT = choose_font([
    "C:/Windows/Fonts/georgiab.ttf",
    "C:/Windows/Fonts/timesbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
])
HI_FONT = choose_font([
    "C:/Windows/Fonts/Nirmala.ttf",
    "C:/Windows/Fonts/mangal.ttf",
    "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf",
])


def text_object(name, body, location, size, material, font=None, rotation=(math.pi/2, 0, 0),
                align_x='CENTER', align_y='CENTER', extrude=0.006):
    curve = bpy.data.curves.new(name + " FontCurve", type='FONT')
    curve.body = body
    curve.size = size
    curve.align_x = align_x
    curve.align_y = align_y
    curve.extrude = extrude
    curve.bevel_depth = 0.0015
    curve.bevel_resolution = 1
    if font is not None:
        curve.font = font
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation
    apply_material(obj, material)
    return obj


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def add_camera(name, location, target, lens=45):
    camera_data = bpy.data.cameras.new(name + " Data")
    camera = bpy.data.objects.new(name, camera_data)
    bpy.context.collection.objects.link(camera)
    camera.location = location
    camera.data.lens = lens
    camera.data.sensor_width = 36
    look_at(camera, target)
    return camera

# -----------------------------------------------------------------------------
# MATERIAL PALETTE
# -----------------------------------------------------------------------------
MAT_CONCRETE = noisy_material(mat("Concrete — warm grey", (0.32, 0.28, 0.25), 0.88), 35, 0.2, 0.06)
MAT_GRAVEL = noisy_material(mat("Road gravel", (0.28, 0.23, 0.19), 0.95), 44, 0.22, 0.055)
MAT_STEEL = mat("Structural steel — charcoal", (0.05, 0.06, 0.07), 0.35, 0.65)
MAT_STEEL_LIGHT = mat("Galvanized roof metal", (0.42, 0.45, 0.46), 0.42, 0.65)
MAT_GREEN = mat("Restaurant railing green", (0.04, 0.48, 0.22), 0.32, 0.2)
MAT_YELLOW = mat("Railing safety yellow", (0.98, 0.68, 0.05), 0.30, 0.1)
MAT_TEAL = mat("Teal paint", (0.04, 0.36, 0.32), 0.38, 0.15)
MAT_RED = mat("Sign red", (0.92, 0.04, 0.06), 0.25, 0.05, emission_color=(0.95, 0.06, 0.06), emission_strength=4.5)
MAT_WHITE = mat("Warm sign white", (0.99, 0.98, 0.92), 0.32, 0.0, emission_color=(1.0, 0.98, 0.92), emission_strength=1.8)
MAT_BLACK = mat("Sign frame black", (0.02, 0.02, 0.025), 0.40, 0.45)
MAT_WOOD_DARK = noisy_material(mat("Dark stained wood", (0.22, 0.10, 0.04), 0.55), 7, 0.1, 0.025)
MAT_WOOD = noisy_material(mat("Warm teak wood", (0.55, 0.30, 0.12), 0.48), 8, 0.1, 0.022)
MAT_WOOD_LIGHT = noisy_material(mat("Light wood", (0.72, 0.46, 0.22), 0.58), 9, 0.1, 0.018)
MAT_WOOD_VARIANT = mat("Alternate wooden planks", (0.42, 0.22, 0.08), 0.65)
MAT_ROPE = mat("Woven cot rope", (0.75, 0.62, 0.42), 0.92, 0.0)
MAT_FABRIC = mat("Natural canvas", (0.85, 0.76, 0.55), 0.88)
MAT_STONE = noisy_material(mat("Low stone wall", (0.28, 0.25, 0.22), 0.92), 22, 0.22, 0.05)
MAT_LEAF = mat("Leaf green", (0.08, 0.52, 0.15), 0.68)
MAT_LEAF_LIGHT = mat("Leaf highlights", (0.22, 0.65, 0.14), 0.65)
MAT_POT = mat("Terracotta pots", (0.72, 0.26, 0.10), 0.72)
MAT_LAMP = mat("Lamp woven tan", (0.58, 0.38, 0.18), 0.82)
MAT_BULB = mat("Warm lamp bulb", (1.0, 0.75, 0.30), 0.2, 0.0, emission_color=(1.0, 0.75, 0.30), emission_strength=18.0)
MAT_GLASS = mat("Smoky translucent glass", (0.15, 0.23, 0.23), 0.22, 0.25)

# -----------------------------------------------------------------------------
# GROUND AND BUILDING BASE
# -----------------------------------------------------------------------------
box("Gravel forecourt", (0, -11.8, -0.20), (46, 24, 0.35), MAT_GRAVEL, bevel=0.0)
box("Restaurant concrete foundation", (0, 0, 0.02), (18.8, 9.6, 0.44), MAT_CONCRETE, bevel=0.04)
box("Ground floor slab", (0, 0, GROUND_FLOOR_Z - 0.045),
    (BUILDING_WIDTH, BUILDING_DEPTH, 0.18), MAT_CONCRETE, bevel=0.025)

for side_x in (-8.85, 8.85):
    box("Low side wall", (side_x, 0.2, 0.67), (0.22, 8.25, 0.78), MAT_STONE, bevel=0.025)
box("Rear low stone wall", (0, 4.34, 0.70), (17.6, 0.30, 0.86), MAT_STONE, bevel=0.025)

# -----------------------------------------------------------------------------
# PRIMARY STEEL FRAME
# -----------------------------------------------------------------------------
front_y = -4.05
back_y = 4.05
column_xs = sorted(set([-8.35, -5.55, -2.75, 0.15, 4.75, 7.95, 8.35]))
for x in column_xs:
    for y in (front_y, back_y):
        cylinder_between("Main steel column", (x, y, 0.25), (x, y, 6.45), 0.075, MAT_STEEL, 12)
        box("Column base plate", (x, y, 0.34), (0.28, 0.28, 0.08), MAT_GREEN, bevel=0.015)

for z in (3.42, 6.42):
    beam_between("Front longitudinal steel beam", (-8.7, front_y, z), (8.7, front_y, z), 0.17, MAT_STEEL)
    beam_between("Rear longitudinal steel beam", (-8.7, back_y, z), (8.7, back_y, z), 0.17, MAT_STEEL)
for x in [-8.5, -5.5, -2.5, 0.5, 3.5, 6.5, 8.5]:
    beam_between("Cross-floor beam", (x, front_y, 3.42), (x, back_y, 3.42), 0.14, MAT_STEEL)
    beam_between("Roof cross member", (x, front_y, 6.42), (x, back_y, 6.42), 0.13, MAT_STEEL)

# -----------------------------------------------------------------------------
# FIRST-FLOOR DECK WITH OPENING FOR THE STAIRCASE
# -----------------------------------------------------------------------------
deck_z = FIRST_FLOOR_Z - 0.075
box("First floor deck — left wing", (-3.6, 0.0, deck_z), (10.4, 8.7, 0.18), MAT_WOOD_DARK, bevel=0.015)
box("First floor deck — right wing", (6.5, 0.0, deck_z), (4.8, 8.7, 0.18), MAT_WOOD_DARK, bevel=0.015)
box("First floor deck — rear bridge", (2.25, 3.10, deck_z), (4.2, 2.55, 0.18), MAT_WOOD_DARK, bevel=0.015)

for i in range(36):
    x = -8.55 + i * 0.48
    if x < 1.4 or x > 4.3:
        box("First-floor timber board", (x, -0.05, FIRST_FLOOR_Z + 0.022),
            (0.035, 8.45, 0.025), MAT_WOOD_VARIANT if i % 3 == 0 else MAT_WOOD, bevel=0.003)
for i in range(10):
    y = 1.95 + i * 0.25
    if y <= 4.25:
        box("Rear deck timber seam", (2.25, y, FIRST_FLOOR_Z + 0.022),
            (4.0, 0.025, 0.025), MAT_WOOD, bevel=0.002)

# -----------------------------------------------------------------------------
# EXTERIOR FACADE RAILINGS
# -----------------------------------------------------------------------------
rail_segments = [(-8.45, 1.45), (4.25, 8.55)]
for x0, x1 in rail_segments:
    beam_between("Upper front lower rail", (x0, -4.02, 3.92), (x1, -4.02, 3.92), 0.075, MAT_GREEN)
    beam_between("Upper front top rail", (x0, -4.02, 4.72), (x1, -4.02, 4.72), 0.10, MAT_GREEN)
    count = max(3, int((x1 - x0) / 0.34))
    for i in range(count + 1):
        x = x0 + (x1 - x0) * i / count
        post_mat = MAT_YELLOW if i % 4 == 0 else MAT_GREEN
        beam_between("Upper railing baluster", (x, -4.02, 3.92), (x, -4.02, 4.72), 0.045, post_mat)

for side_x in (-8.52, 8.52):
    beam_between("Side upper railing lower", (side_x, -3.7, 3.92), (side_x, 4.12, 3.92), 0.07, MAT_GREEN)
    beam_between("Side upper railing top", (side_x, -3.7, 4.72), (side_x, 4.12, 4.72), 0.09, MAT_GREEN)
    for i in range(19):
        y = -3.7 + i * 0.435
        beam_between("Side upper railing post", (side_x, y, 3.92), (side_x, y, 4.72), 0.04,
                     MAT_YELLOW if i % 5 == 0 else MAT_GREEN)

for x0, x1 in [(-8.4, -4.6), (-1.9, 1.65), (4.25, 8.4)]:
    beam_between("Ground-level green guardrail", (x0, -4.02, 1.15), (x1, -4.02, 1.15), 0.07, MAT_GREEN)
    beam_between("Ground-level yellow accent rail", (x0, -4.02, 1.47), (x1, -4.02, 1.47), 0.05, MAT_YELLOW)
    count = max(2, int((x1 - x0) / 0.42))
    for i in range(count + 1):
        x = x0 + (x1 - x0) * i / count
        beam_between("Ground-level rail post", (x, -4.02, 0.90), (x, -4.02, 1.48), 0.045,
                     MAT_GREEN if i % 3 else MAT_YELLOW)

# -----------------------------------------------------------------------------
# STAIRCASE
# -----------------------------------------------------------------------------
stair_x = 2.78
stair_front_y = -3.82
stair_back_y = 1.18
stair_base_z = GROUND_FLOOR_Z + 0.03
stair_top_z = FIRST_FLOOR_Z + 0.01
step_count = 17
rise = (stair_top_z - stair_base_z) / step_count
run = (stair_back_y - stair_front_y) / step_count
stair_width = 1.72
for i in range(step_count):
    y = stair_front_y + (i + 0.5) * run
    z_top = stair_base_z + (i + 1) * rise
    box("Individual timber stair tread %02d" % (i + 1),
        (stair_x, y, z_top - 0.055), (stair_width, run + 0.035, 0.11),
        MAT_WOOD_LIGHT if i % 2 == 0 else MAT_WOOD, bevel=0.018)
    box("Green stair tread edge", (stair_x, y - run * 0.47, z_top - 0.04),
        (stair_width, 0.035, 0.045), MAT_GREEN, bevel=0.006)

for x in (stair_x - stair_width / 2 + 0.03, stair_x + stair_width / 2 - 0.03):
    cylinder_between("Green stair stringer", (x, stair_front_y - 0.02, stair_base_z + 0.06),
                     (x, stair_back_y + 0.03, stair_top_z - 0.02), 0.065, MAT_GREEN, 10)
    cylinder_between("Sloped green handrail", (x, stair_front_y - 0.02, stair_base_z + 0.78),
                     (x, stair_back_y + 0.03, stair_top_z + 0.78), 0.055, MAT_GREEN, 10)
    for i in range(9):
        t = i / 8.0
        y = stair_front_y + t * (stair_back_y - stair_front_y)
        z = stair_base_z + t * (stair_top_z - stair_base_z) + 0.08
        beam_between("Stair handrail upright", (x, y, z), (x, y, z + 0.70), 0.045, MAT_GREEN)

box("Top stair landing", (stair_x, 1.43, FIRST_FLOOR_Z - 0.02), (2.10, 1.05, 0.14), MAT_WOOD_DARK, bevel=0.02)

# -----------------------------------------------------------------------------
# SIGNAGE
# -----------------------------------------------------------------------------
box("Ground sign outer red panel", (-4.35, -4.31, 2.22), (7.75, 0.17, 0.94), MAT_RED, bevel=0.018)
box("Ground sign inner white panel", (-4.35, -4.405, 2.22), (7.48, 0.035, 0.70), MAT_WHITE, bevel=0.006)
text_object("Ground sign — Mummy's Homely Food", "Mummy's Homely Food",
            (-4.35, -4.435, 2.22), 0.59, MAT_RED, EN_FONT, extrude=0.012)

beam_between("Upper English sign frame top", (-7.2, -4.30, 5.58), (-0.5, -4.30, 5.58), 0.055, MAT_STEEL)
beam_between("Upper English sign frame bottom", (-7.2, -4.30, 4.88), (-0.5, -4.30, 4.88), 0.055, MAT_STEEL)
for x in (-7.2, -0.5):
    beam_between("Upper English sign frame side", (x, -4.30, 4.88), (x, -4.30, 5.58), 0.055, MAT_STEEL)
text_object("Upper sign — Mummy's Homely Food", "Mummy's Homely Food",
            (-3.85, -4.365, 5.22), 0.67, MAT_RED, EN_FONT, extrude=0.016)

box("Hindi sign red border", (3.23, -4.34, 5.23), (5.42, 0.18, 1.02), MAT_RED, bevel=0.015)
box("Hindi sign white inset", (3.23, -4.44, 5.23), (5.14, 0.035, 0.78), MAT_WHITE, bevel=0.005)
text_object("Upper Hindi sign", "मम्मीज़ होमली फूड", (3.23, -4.466, 5.23), 0.58,
            MAT_RED, HI_FONT, extrude=0.009)

box("Side menu panel", (8.50, -4.12, 2.62), (0.10, 2.05, 0.92), MAT_WHITE, bevel=0.015)
for z in (2.94, 2.72, 2.50, 2.28):
    box("Menu red divider", (8.435, -4.12, z), (0.035, 1.74, 0.035), MAT_RED, bevel=0.003)

# -----------------------------------------------------------------------------
# DINING FURNITURE
# -----------------------------------------------------------------------------
def charpai_bench(name, x, y, floor_z, length=1.62, width=0.55, green_frame=True):
    frame_mat = MAT_GREEN if green_frame else MAT_STEEL
    seat_z = floor_z + 0.43
    leg_h = 0.40
    for dx in (-length * 0.43, length * 0.43):
        for dy in (-width * 0.42, width * 0.42):
            box(name + " leg", (x + dx, y + dy, floor_z + leg_h / 2),
                (0.065, 0.065, leg_h), frame_mat, bevel=0.01)
    box(name + " long frame front", (x, y - width * 0.46, seat_z - 0.035),
        (length, 0.07, 0.08), frame_mat, bevel=0.012)
    box(name + " long frame back", (x, y + width * 0.46, seat_z - 0.035),
        (length, 0.07, 0.08), frame_mat, bevel=0.012)
    box(name + " short frame left", (x - length * 0.48, y, seat_z - 0.035),
        (0.07, width, 0.08), frame_mat, bevel=0.012)
    box(name + " short frame right", (x + length * 0.48, y, seat_z - 0.035),
        (0.07, width, 0.08), frame_mat, bevel=0.012)
    for i in range(17):
        xx = x - length * 0.42 + i * (length * 0.84 / 16.0)
        cylinder_between(name + " woven seat strand", (xx, y - width * 0.40, seat_z + 0.012),
                         (xx, y + width * 0.40, seat_z + 0.012), 0.009, MAT_ROPE, 6)
    for j in range(6):
        yy = y - width * 0.36 + j * (width * 0.72 / 5.0)
        cylinder_between(name + " cross weave", (x - length * 0.42, yy, seat_z + 0.023),
                         (x + length * 0.42, yy, seat_z + 0.023), 0.008, MAT_FABRIC, 6)


def dining_table(name, x, y, floor_z, width=1.55, depth=0.82, height=0.75):
    top_z = floor_z + height
    box(name + " wooden tabletop", (x, y, top_z), (width, depth, 0.105), MAT_WOOD_DARK, bevel=0.025)
    box(name + " front table edge", (x, y - depth / 2 - 0.008, top_z),
        (width, 0.022, 0.08), MAT_WOOD_LIGHT, bevel=0.006)
    leg_bottom = floor_z + 0.06
    leg_top = top_z - 0.04
    for dx in (-width * 0.40, width * 0.40):
        for dy in (-depth * 0.36, depth * 0.36):
            box(name + " table leg", (x + dx, y + dy, (leg_bottom + leg_top) / 2),
                (0.075, 0.075, leg_top - leg_bottom), MAT_STEEL, bevel=0.009)
    beam_between(name + " under-table brace", (x - width * 0.34, y, top_z - 0.12),
                 (x + width * 0.34, y, top_z - 0.12), 0.045, MAT_STEEL)


def slatted_bench(name, x, y, floor_z, length=1.7, seat_width=0.42, back=True):
    seat_z = floor_z + 0.47
    leg_h = 0.44
    for dx in (-length * 0.40, length * 0.40):
        for dy in (-seat_width * 0.34, seat_width * 0.34):
            box(name + " leg", (x + dx, y + dy, floor_z + leg_h / 2),
                (0.055, 0.055, leg_h), MAT_STEEL, bevel=0.008)
    for i in range(5):
        yy = y - seat_width * 0.45 + i * (seat_width * 0.90 / 4)
        box(name + " seat slat", (x, yy, seat_z), (length, 0.075, 0.055),
            MAT_WOOD_LIGHT if i % 2 else MAT_WOOD, bevel=0.01)
    if back:
        for dx in (-length * 0.39, length * 0.39):
            beam_between(name + " back support", (x + dx, y + seat_width * 0.35, seat_z),
                         (x + dx, y + seat_width * 0.35, seat_z + 0.66), 0.045, MAT_STEEL)
        for j in range(3):
            z = seat_z + 0.25 + j * 0.18
            box(name + " backrest slat", (x, y + seat_width * 0.35, z),
                (length, 0.055, 0.075), MAT_WOOD_LIGHT if j == 1 else MAT_WOOD, bevel=0.01)

ground_tables = [(-6.40, -2.55), (-3.65, -2.35), (-0.30, -2.55), (6.25, -2.60)]
for idx, (x, y) in enumerate(ground_tables, 1):
    dining_table("Ground dining table %02d" % idx, x, y, GROUND_FLOOR_Z, width=1.48, depth=0.78)
    charpai_bench("Ground charpai bench %02d A" % idx, x, y - 0.78, GROUND_FLOOR_Z, length=1.48, width=0.50)
    charpai_bench("Ground charpai bench %02d B" % idx, x, y + 0.78, GROUND_FLOOR_Z, length=1.48, width=0.50)

for x in (-7.1, -5.1, -2.9, -0.9, 5.5, 7.3):
    slatted_bench("Front veranda wooden bench", x, -3.57, GROUND_FLOOR_Z, length=1.45, seat_width=0.40, back=False)

upper_floor = FIRST_FLOOR_Z
upper_tables = [(-6.15, -2.25), (-5.9, 1.70), (6.45, -2.10), (6.45, 1.70), (-5.8, 3.20)]
for idx, (x, y) in enumerate(upper_tables, 1):
    dining_table("First-floor table %02d" % idx, x, y, upper_floor, width=1.55, depth=0.82)
    slatted_bench("First-floor bench %02d A" % idx, x, y - 0.78, upper_floor, length=1.60, back=True)
    slatted_bench("First-floor bench %02d B" % idx, x, y + 0.78, upper_floor, length=1.60, back=True)

# -----------------------------------------------------------------------------
# WOODEN KITCHEN & LATTICE SCREENS
# -----------------------------------------------------------------------------
def lattice_panel(name, x_center, y, z_center, width, height, material=MAT_WOOD_DARK, spacing=0.28):
    z0 = z_center - height / 2
    z1 = z_center + height / 2
    x0 = x_center - width / 2
    x1 = x_center + width / 2
    beam_between(name + " frame top", (x0, y, z1), (x1, y, z1), 0.075, material)
    beam_between(name + " frame bottom", (x0, y, z0), (x1, y, z0), 0.075, material)
    beam_between(name + " frame left", (x0, y, z0), (x0, y, z1), 0.075, material)
    beam_between(name + " frame right", (x1, y, z0), (x1, y, z1), 0.075, material)
    count = int(width / spacing)
    for i in range(1, count):
        x = x0 + width * i / count
        beam_between(name + " vertical lattice", (x, y - 0.015, z0 + 0.04),
                     (x, y - 0.015, z1 - 0.04), 0.025, MAT_WOOD_LIGHT)
    n_diag = int((width + height) / 0.42)
    for i in range(-n_diag, n_diag + 1):
        x_start = x0 + i * 0.40
        x_end = x_start + height * 0.78
        z_start = z0 + 0.04
        z_end = z1 - 0.04
        if x_start < x0:
            z_start += (x0 - x_start) / 0.78
            x_start = x0
        if x_end > x1:
            z_end -= (x_end - x1) / 0.78
            x_end = x1
        if x_start < x1 and x_end > x0 and z_end > z_start:
            beam_between(name + " diagonal lattice", (x_start, y - 0.035, z_start),
                         (x_end, y - 0.035, z_end), 0.022, material)

box("Ground kitchen left wooden side", (-3.0, 1.82, 1.45), (0.13, 3.0, 2.25), MAT_WOOD, bevel=0.015)
box("Ground kitchen right wooden side", (0.28, 1.82, 1.45), (0.13, 3.0, 2.25), MAT_WOOD, bevel=0.015)
box("Ground kitchen rear wood panel", (-1.36, 3.27, 1.42), (3.4, 0.13, 2.20), MAT_WOOD_DARK, bevel=0.015)
box("Ground kitchen lower front counter", (-1.36, 0.31, 0.92), (3.35, 0.15, 0.95), MAT_WOOD, bevel=0.018)
lattice_panel("Ground kitchen front lattice", -1.36, 0.20, 1.86, 3.3, 0.92, MAT_WOOD_DARK, spacing=0.25)

for z in (1.38, 1.63, 1.88, 2.13, 2.38):
    box("Kitchen front horizontal slat", (-1.36, 0.12, z), (3.25, 0.05, 0.045), MAT_WOOD_LIGHT, bevel=0.004)

box("Upper floor wooden partition base", (-1.95, 3.65, 4.20), (5.05, 0.14, 1.35), MAT_WOOD, bevel=0.015)
lattice_panel("Upper floor rear lattice divider", -1.95, 3.55, 5.45, 5.05, 1.25, MAT_WOOD_DARK, spacing=0.32)
for z in (3.80, 4.05, 4.30, 4.55):
    box("Upper divider horizontal wood board", (-1.95, 3.49, z), (4.95, 0.06, 0.055), MAT_WOOD_LIGHT, bevel=0.004)

box("Ground kitchen serving counter top", (-1.35, 0.00, 1.45), (3.50, 0.42, 0.10), MAT_WOOD_DARK, bevel=0.018)
for x in (-2.45, -1.35, -0.25):
    box("Kitchen counter front trim", (x, -0.225, 1.20), (0.035, 0.025, 0.38), MAT_WOOD_LIGHT, bevel=0.003)

# -----------------------------------------------------------------------------
# ROOF STRUCTURE & TIMBER CEILING
# -----------------------------------------------------------------------------
roof_start_y = 0.45 if FRONT_ROOF_CUTAWAY else -4.15
roof_end_y = 4.43
roof_center_y = (roof_start_y + roof_end_y) / 2
roof_depth = roof_end_y - roof_start_y

for y in [roof_start_y + i * (roof_depth / 8.0) for i in range(9)]:
    z = ROOF_EAVE_Z + 0.06 * ((y - roof_start_y) / max(roof_depth, 0.01))
    beam_between("Roof steel cross rafter", (-8.75, y, z), (8.75, y, z), 0.105, MAT_STEEL)
for x in [-8.5, -6.0, -3.5, -1.0, 1.5, 4.0, 6.5, 8.5]:
    beam_between("Roof longitudinal purlin", (x, roof_start_y, ROOF_EAVE_Z + 0.02),
                 (x, roof_end_y, ROOF_EAVE_Z + 0.08), 0.075, MAT_STEEL)

y = roof_start_y + 0.07
plank_i = 0
while y < roof_end_y - 0.04:
    plank_mat = MAT_WOOD_LIGHT if plank_i % 4 == 0 else (MAT_WOOD if plank_i % 3 else MAT_WOOD_VARIANT)
    z = ROOF_EAVE_Z - 0.06 + 0.06 * ((y - roof_start_y) / max(roof_depth, 0.01))
    box("Wood ceiling plank", (0, y, z), (17.35, 0.13, 0.045), plank_mat, bevel=0.004)
    y += 0.17
    plank_i += 1

for x in [-7.7, -5.2, -2.7, -0.2, 2.3, 4.8, 7.3]:
    box("Galvanized corrugated roof panel", (x, roof_center_y, ROOF_EAVE_Z + 0.13),
        (2.45, roof_depth + 0.08, 0.07), MAT_STEEL_LIGHT, bevel=0.008,
        rotation=(math.radians(-0.8), 0, 0))

for y in [roof_start_y + 0.08 + i * 0.22 for i in range(int(roof_depth / 0.22))]:
    box("Roof corrugation rib", (0, y, ROOF_EAVE_Z + 0.178), (17.45, 0.026, 0.035), MAT_STEEL_LIGHT, bevel=0.006)

for x in (-8.8, 8.8):
    beam_between("Roof side edge", (x, roof_start_y, ROOF_EAVE_Z + 0.10),
                 (x, roof_end_y, ROOF_EAVE_Z + 0.16), 0.11, MAT_STEEL)
beam_between("Rear roof fascia", (-8.8, 4.48, ROOF_EAVE_Z + 0.14),
             (8.8, 4.48, ROOF_EAVE_Z + 0.14), 0.12, MAT_STEEL)

# -----------------------------------------------------------------------------
# HANGING PENDANT LAMPS & WARM LIGHT POOLS
# -----------------------------------------------------------------------------
def pendant_lamp(name, x, y, ceiling_z, drop=0.62):
    wire_end = ceiling_z - drop
    cylinder_between(name + " black cord", (x, y, ceiling_z), (x, y, wire_end + 0.10), 0.012, MAT_BLACK, 6)
    shade_z = wire_end - 0.02
    bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=0.32, radius2=0.10, depth=0.26,
                                    location=(x, y, shade_z))
    shade = bpy.context.object
    shade.name = name + " woven shade"
    apply_material(shade, MAT_LAMP)
    sphere(name + " glowing bulb", (x, y, shade_z - 0.17), 0.065, MAT_BULB)
    light_data = bpy.data.lights.new(name + " warm pool", 'POINT')
    light_data.energy = 220
    light_data.color = (1.0, 0.72, 0.38)
    light_data.shadow_soft_size = 0.65
    light_obj = bpy.data.objects.new(name + " warm pool", light_data)
    bpy.context.collection.objects.link(light_obj)
    light_obj.location = (x, y, shade_z - 0.23)

for idx, (x, y) in enumerate([(-7.0, 0.8), (-3.8, 1.4), (0.4, 0.7), (5.8, 1.0), (7.0, 3.1)], 1):
    pendant_lamp("First-floor pendant %02d" % idx, x, y, ROOF_EAVE_Z - 0.18, drop=0.72)
for idx, (x, y) in enumerate([(-6.0, -0.6), (-2.0, -0.8), (0.7, -0.7), (6.0, -0.5)], 1):
    pendant_lamp("Ground-floor pendant %02d" % idx, x, y, FIRST_FLOOR_Z - 0.10, drop=0.48)

# -----------------------------------------------------------------------------
# PLANTERS
# -----------------------------------------------------------------------------
def potted_plant(name, x, y, floor_z, scale=1.0):
    pot_h = 0.38 * scale
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.22 * scale, radius2=0.15 * scale,
                                    depth=pot_h, location=(x, y, floor_z + pot_h / 2))
    pot = bpy.context.object
    pot.name = name + " terracotta pot"
    apply_material(pot, MAT_POT)
    cylinder_between(name + " soil", (x, y, floor_z + pot_h * 0.78),
                     (x, y, floor_z + pot_h * 0.83), 0.15 * scale, MAT_WOOD_DARK, 12)
    stem_base = floor_z + pot_h * 0.82
    for i in range(11):
        angle = random.uniform(0, math.tau)
        h = random.uniform(0.38, 0.95) * scale
        r = random.uniform(0.12, 0.43) * scale
        start = Vector((x, y, stem_base + h * 0.15))
        end = Vector((x + math.cos(angle) * r, y + math.sin(angle) * r,
                      stem_base + h))
        cylinder_between(name + " stem", start, end, 0.012 * scale, MAT_GREEN, 6)
        leaf = sphere(name + " leaf", end, 0.12 * scale, MAT_LEAF if i % 3 else MAT_LEAF_LIGHT,
                      ico=True, subdivisions=1)
        leaf.scale = (0.65, 0.45, 1.55)
        leaf.rotation_euler[2] = angle

for i, x in enumerate([-8.0, -6.9, -4.7, -2.2, -0.5, 0.8, 4.5, 6.6, 8.1], 1):
    potted_plant("Ground facade plant %02d" % i, x, -3.86, GROUND_FLOOR_Z, scale=random.uniform(0.8, 1.12))
for i, x in enumerate([-7.9, -5.0, -1.0, 5.0, 7.9], 1):
    potted_plant("Upper balcony plant %02d" % i, x, -3.65, FIRST_FLOOR_Z, scale=0.58)

# -----------------------------------------------------------------------------
# BACKGROUND POWER TRANSMISSION TOWER
# -----------------------------------------------------------------------------
tower_x = 1.55
tower_y = 6.55
tower_h = 11.8
levels = [0.0, 2.0, 4.2, 6.5, 8.8, 10.6, 11.8]
for z0, z1 in zip(levels[:-1], levels[1:]):
    t0 = z0 / tower_h
    t1 = z1 / tower_h
    half0 = 1.22 * (1.0 - t0) + 0.18 * t0
    half1 = 1.22 * (1.0 - t1) + 0.18 * t1
    front0 = tower_y - 0.72 * (1.0 - t0)
    front1 = tower_y - 0.72 * (1.0 - t1)
    back0 = tower_y + 0.72 * (1.0 - t0)
    back1 = tower_y + 0.72 * (1.0 - t1)
    corners0 = [(tower_x - half0, front0, z0), (tower_x + half0, front0, z0),
                (tower_x - half0, back0, z0), (tower_x + half0, back0, z0)]
    corners1 = [(tower_x - half1, front1, z1), (tower_x + half1, front1, z1),
                (tower_x - half1, back1, z1), (tower_x + half1, back1, z1)]
    for j in range(4):
        cylinder_between("Transmission pylon leg", corners0[j], corners1[j], 0.033, MAT_STEEL, 8)
    for j in range(2):
        cylinder_between("Transmission pylon crossbar", corners0[j], corners0[j + 2], 0.026, MAT_STEEL, 8)
    cylinder_between("Transmission pylon diagonal brace", corners0[0], corners1[1], 0.023, MAT_STEEL, 8)
    cylinder_between("Transmission pylon diagonal brace", corners0[1], corners1[0], 0.023, MAT_STEEL, 8)
    cylinder_between("Transmission pylon rear diagonal", corners0[2], corners1[3], 0.023, MAT_STEEL, 8)
    cylinder_between("Transmission pylon rear diagonal", corners0[3], corners1[2], 0.023, MAT_STEEL, 8)

for z, span in ((8.2, 3.3), (9.4, 4.1), (10.4, 4.6)):
    beam_between("Transmission tower cross arm", (tower_x - span / 2, tower_y, z),
                 (tower_x + span / 2, tower_y, z), 0.055, MAT_STEEL)
    for x in (tower_x - span * 0.42, tower_x, tower_x + span * 0.42):
        cylinder_between("Power line insulator", (x, tower_y, z - 0.03), (x, tower_y, z + 0.23),
                         0.045, MAT_STEEL_LIGHT, 8)

for idx, z in enumerate((9.7, 10.25, 10.8), 1):
    cylinder_between("Overhead power cable %02d" % idx,
                     (-22, 7.8, z + 0.7), (22, 7.8, z - 0.6), 0.012, MAT_STEEL, 6)
for idx, z in enumerate((10.7, 11.2, 11.7), 1):
    cylinder_between("Diagonal power cable %02d" % idx,
                     (-20, -0.5, z - 0.4), (tower_x, tower_y, z + 0.45), 0.010, MAT_STEEL, 6)

# -----------------------------------------------------------------------------
# LIGHTS & CAMERAS
# -----------------------------------------------------------------------------
world = bpy.data.worlds.get("World")
if world is None:
    world = bpy.data.worlds.new("World")
bpy.context.scene.world = world
world.use_nodes = True
nodes = world.node_tree.nodes
links = world.node_tree.links
nodes.clear()
bg = nodes.new("ShaderNodeBackground")
out = nodes.new("ShaderNodeOutputWorld")
links.new(bg.outputs["Background"], out.inputs["Surface"])
# Deep evening dusk twilight sky with warm ambient bounce
bg.inputs["Color"].default_value = (0.10, 0.07, 0.09, 1.0)
bg.inputs["Strength"].default_value = 0.95

# Directional warm sunset light
sun_data = bpy.data.lights.new("Evening sun", 'SUN')
sun_data.energy = 4.2
sun_data.color = (1.0, 0.74, 0.46)
sun_data.angle = math.radians(16)
sun_obj = bpy.data.objects.new("Evening sun", sun_data)
bpy.context.collection.objects.link(sun_obj)
sun_obj.rotation_euler = (math.radians(28), math.radians(-26), math.radians(-22))

# Front warm fill lighting up the wooden facade and tables
area_data = bpy.data.lights.new("Front warm fill", 'AREA')
area_data.energy = 2800
area_data.color = (1.0, 0.72, 0.44)
area_data.shape = 'DISK'
area_data.size = 16
area_obj = bpy.data.objects.new("Front warm fill", area_data)
bpy.context.collection.objects.link(area_obj)
area_obj.location = (0, -15, 9)
look_at(area_obj, (0, 0, 3.0))

# Signboard warm red neon radiance
sign_light = bpy.data.lights.new("Signboard Glow", 'POINT')
sign_light.energy = 380
sign_light.color = (1.0, 0.22, 0.18)
sign_light.shadow_soft_size = 1.2
sign_obj = bpy.data.objects.new("Signboard Glow", sign_light)
bpy.context.collection.objects.link(sign_obj)
sign_obj.location = (-4.35, -5.2, 2.22)

# The 3 Signature Motion Cameras matching the user script
hero_camera = add_camera("CAM_Hero_Exterior", (22.0, -29.5, 12.5), (0.0, 0.0, 3.7), lens=43)
ground_camera = add_camera("CAM_GroundFloor_Interior", (0.0, -10.8, 2.5), (-0.2, 0.4, 1.55), lens=42)
upper_camera = add_camera("CAM_FirstFloor_Interior", (0.0, -10.4, 5.45), (-0.15, 0.8, 4.65), lens=42)

scene = bpy.context.scene
scene.render.resolution_x = RENDER_WIDTH
scene.render.resolution_y = RENDER_HEIGHT
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'

try:
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
except Exception:
    scene.render.engine = 'BLENDER_EEVEE'

# Save blend file
bpy.ops.wm.save_as_mainfile(filepath=BLEND_OUTPUT)
print("Saved blend file to:", BLEND_OUTPUT)

# Render all 3 camera viewpoints for hero motion animation
cameras_to_render = [
    (hero_camera, HERO_RENDER_OUTPUT, "CAM_Hero_Exterior"),
    (ground_camera, GROUND_RENDER_OUTPUT, "CAM_GroundFloor_Interior"),
    (upper_camera, UPPER_RENDER_OUTPUT, "CAM_FirstFloor_Interior"),
]

if RENDER_ON_BUILD:
    for cam, out_path, cam_name in cameras_to_render:
        scene.camera = cam
        scene.render.filepath = out_path
        print(f"Rendering {cam_name} -> {out_path} ...")
        try:
            bpy.ops.render.render(write_still=True)
            print(f"Rendered {cam_name} successfully!")
        except Exception as e:
            print(f"Render error on {cam_name}: {e}")

# Export GLB model for interactive WebGL / Three.js 3D motion
print(f"Exporting GLTF/GLB -> {GLB_OUTPUT} ...")
try:
    # Convert text curves to mesh for GLB export
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type == 'FONT':
            obj.select_set(True)
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.convert(target='MESH')
            obj.select_set(False)

    bpy.ops.export_scene.gltf(
        filepath=GLB_OUTPUT,
        export_format='GLB',
        export_cameras=True,
        export_lights=True,
        export_materials='EXPORT',
        export_apply=True
    )
    print("Exported GLB successfully:", GLB_OUTPUT)
except Exception as e:
    print(f"GLB export error: {e}")
