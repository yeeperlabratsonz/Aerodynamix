import json
import math
import struct
from pathlib import Path

OUT = Path("mall-lowpoly.glb")
verts = []
normals = []
uvs = []
groups = [[] for _ in range(8)]


def quad(a, b, c, d, material):
    base = len(verts)
    verts.extend([a, b, c, d])
    n = [
        (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
        (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
        (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
    ]
    length = math.sqrt(sum(x * x for x in n)) or 1
    n = tuple(x / length for x in n)
    normals.extend([n] * 4)
    uvs.extend([(0, 0), (1, 0), (1, 1), (0, 1)])
    groups[material].extend([base, base + 1, base + 2, base, base + 2, base + 3])


def box(x, y, z, sx, sy, sz, material):
    x0, x1 = x - sx / 2, x + sx / 2
    y0, y1 = y - sy / 2, y + sy / 2
    z0, z1 = z - sz / 2, z + sz / 2
    quad((x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1), material)
    quad((x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0), material)
    quad((x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0), material)
    quad((x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1), material)
    quad((x0, y1, z1), (x1, y1, z1), (x1, y1, z0), (x0, y1, z0), material)
    quad((x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1), material)


def cylinder(x, y, z, radius, height, material, sides=8):
    for i in range(sides):
        a, b = 2 * math.pi * i / sides, 2 * math.pi * (i + 1) / sides
        quad(
            (x + math.cos(a) * radius, y, z + math.sin(a) * radius),
            (x + math.cos(b) * radius, y, z + math.sin(b) * radius),
            (x + math.cos(b) * radius, y + height, z + math.sin(b) * radius),
            (x + math.cos(a) * radius, y + height, z + math.sin(a) * radius),
            material,
        )


# Materials: floor, walls, shop, signs, furniture, plants, glass, accent.
materials = [
    (0.10, 0.11, 0.12, 1),
    (0.19, 0.20, 0.21, 1),
    (0.28, 0.25, 0.22, 1),
    (0.85, 0.52, 0.16, 1),
    (0.08, 0.07, 0.06, 1),
    (0.18, 0.34, 0.20, 1),
    (0.18, 0.34, 0.40, 0.55),
    (0.55, 0.12, 0.10, 1),
]

# Main atrium, floor, roof beams, and side walls.
box(0, -0.15, 0, 74, 0.3, 54, 0)
box(0, 8, -26, 74, 16, 0.4, 1)
box(-37, 8, 0, 0.4, 16, 54, 1)
box(37, 8, 0, 0.4, 16, 54, 1)
for x in range(-30, 31, 10):
    box(x, 12, 0, 0.45, 0.5, 54, 1)
for z in range(-20, 21, 10):
    box(0, 11.7, z, 74, 0.35, 0.45, 1)

# Storefronts, awnings, signs, and display windows along both sides.
for side in (-1, 1):
    for i, x in enumerate(range(-30, 31, 12)):
        z = side * 22.5
        box(x, 3.2, z, 10.5, 6.4, 3.2, 2)
        box(x, 6.8, z - side * 1.8, 9.2, 0.7, 0.35, 3)
        box(x, 4.0, z - side * 1.72, 7.4, 3.0, 0.12, 6)
        box(x, 7.7, z - side * 1.75, 5.4, 1.0, 0.25, 3)
        if i % 2 == 0:
            box(x - 3.5, 1.2, z - side * 2.0, 0.45, 2.2, 0.45, 4)
            box(x + 3.5, 1.2, z - side * 2.0, 0.45, 2.2, 0.45, 4)

# Food court tables, seats, and counters at the rear.
box(0, 1.2, -14, 22, 2.4, 2.0, 2)
box(0, 2.9, -15.2, 18, 0.35, 0.25, 3)
for x in (-12, -6, 0, 6, 12):
    cylinder(x, 0, -5, 0.7, 0.7, 4)
    box(x, 0.9, -5, 2.8, 0.25, 1.0, 4)
    box(x, 0.9, -8, 2.8, 0.25, 1.0, 4)
for x in (-8, 0, 8):
    cylinder(x, 0.02, -10, 0.32, 1.1, 4)
    box(x, 1.2, -10, 3.6, 0.2, 3.6, 4)

# Escalators/stairs made from repeated low-poly steps.
for direction in (-1, 1):
    for i in range(10):
        box(18 + i * 0.55, i * 0.22 + 0.11, direction * 5, 0.7, 0.22, 3.4, 4)
    box(20.5, 1.2, direction * 5, 6.4, 0.18, 4.2, 3)

# Benches, kiosks, planters, and trash cans.
for x, z in [(-18, -3), (-6, 4), (7, 8), (20, -8)]:
    box(x, 0.65, z, 3.5, 0.35, 0.7, 4)
    box(x, 1.15, z + 0.22, 3.5, 0.7, 0.18, 4)
for x, z in [(-24, 8), (12, 12), (28, -10)]:
    box(x, 1.0, z, 1.8, 2.0, 1.8, 4)
    cylinder(x, 2.0, z, 0.65, 1.4, 5)
    for a in range(0, 360, 60):
        box(x + math.cos(math.radians(a)) * 0.45, 3.0, z + math.sin(math.radians(a)) * 0.45, 0.16, 1.2, 0.16, 5)
for x, z in [(-28, 2), (-2, 13), (26, 2)]:
    cylinder(x, 0, z, 0.45, 1.1, 4)
    box(x, 1.1, z, 0.7, 0.12, 0.7, 3)

# Simple skylights and hanging accent signs.
for x in (-22, 0, 22):
    box(x, 7.75, 0, 8, 0.08, 4, 6)
    box(x, 5.4, 0, 2.5, 2.2, 0.15, 7)

# Pack a single interleaved vertex buffer and one primitive per material.
data = bytearray()
def align4():
    while len(data) % 4:
        data.append(0)
def append_blob(blob):
    align4()
    off = len(data)
    data.extend(blob)
    return off

pos_blob = b"".join(struct.pack("<3f", *v) for v in verts)
nrm_blob = b"".join(struct.pack("<3f", *n) for n in normals)
uv_blob = b"".join(struct.pack("<2f", *uv) for uv in uvs)
pos_off = append_blob(pos_blob)
nrm_off = append_blob(nrm_blob)
uv_off = append_blob(uv_blob)
index_offsets = []
for group in groups:
    index_offsets.append(append_blob(struct.pack("<" + "I" * len(group), *group)) if group else 0)

def accessor(offset, component, count, typ, minimum=None, maximum=None):
    item_size = {"VEC2": 2, "VEC3": 3}[typ] * {5126: 4, 5125: 4}[component]
    return {"bufferView": len(views), "componentType": component, "count": count, "type": typ, **({"min": minimum, "max": maximum} if minimum else {})}

views = []
accessors = []
def add_view(offset, length, target):
    views.append({"buffer": 0, "byteOffset": offset, "byteLength": length, "target": target})
    return len(views) - 1
pv = add_view(pos_off, len(pos_blob), 34962)
nv = add_view(nrm_off, len(nrm_blob), 34962)
uvv = add_view(uv_off, len(uv_blob), 34962)
accessors += [
    {"bufferView": pv, "componentType": 5126, "count": len(verts), "type": "VEC3",
     "min": [min(v[i] for v in verts) for i in range(3)],
     "max": [max(v[i] for v in verts) for i in range(3)]},
    {"bufferView": nv, "componentType": 5126, "count": len(normals), "type": "VEC3"},
    {"bufferView": uvv, "componentType": 5126, "count": len(uvs), "type": "VEC2"},
]
indices = []
for group, offset in zip(groups, index_offsets):
    if not group:
        indices.append(None)
        continue
    view = add_view(offset, len(group) * 4, 34963)
    indices.append(len(accessors))
    accessors.append({"bufferView": view, "componentType": 5125, "count": len(group), "type": "SCALAR"})

meshes = [{
    "primitives": [
        {"attributes": {"POSITION": 0, "NORMAL": 1, "TEXCOORD_0": 2}, "indices": idx, "material": i}
        for i, idx in enumerate(indices) if idx is not None
    ]
}]
gltf = {
    "asset": {"version": "2.0", "generator": "Aerodynamix Low-Poly Mall Builder"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "LowPolyMall"}],
    "meshes": meshes,
    "buffers": [{"byteLength": len(data)}],
    "bufferViews": views,
    "accessors": accessors,
    "materials": [
        {"name": f"Material_{i}", "pbrMetallicRoughness": {"baseColorFactor": color, "roughnessFactor": 0.86, "metallicFactor": 0.0}}
        for i, color in enumerate(materials)
    ],
}
json_blob = json.dumps(gltf, separators=(",", ":")).encode()
json_blob += b" " * ((4 - len(json_blob) % 4) % 4)
data += b""  # buffer offsets already refer to the BIN payload.
total = 12 + 8 + len(json_blob) + 8 + len(data)
with OUT.open("wb") as f:
    f.write(struct.pack("<III", 0x46546C67, 2, total))
    f.write(struct.pack("<II", len(json_blob), 0x4E4F534A))
    f.write(json_blob)
    f.write(struct.pack("<II", len(data), 0x004E4942))
    f.write(data)
print(f"wrote {OUT} with {len(verts)} vertices and {sum(len(x) for x in groups)//3} triangles")