import { SceneUpdate, Point3, Color, TriangleListPrimitive } from "@foxglove/schemas";
import { RegisterMessageConverterArgs } from "@foxglove/studio";
import earcut, { flatten } from "earcut";

import {
  Header,
  Point2D,
  Polygon2D,
  Polygon2DStamped,
  ComplexPolygon2D,
  ComplexPolygon2DStamped,
  Polygon2DCollection,
  ComplexPolygon2DCollection,
} from "./types";

function points_to_coordinates(points: Point2D[]): number[][] {
  return points.map(({ x, y }: Point2D) => [x, y]);
}

function vertices_to_points(vertices: number[]): Point3[] {
  return Array.from({ length: vertices.length / 2 }, (_, index) => {
    const offset = index * 2;
    return {
      x: vertices[offset]!,
      y: vertices[offset + 1]!,
      z: 0.0,
    };
  });
}

type PolygonArray = number[][][];

const DEFAULT_COLOR: Color = { r: 0.647, g: 0.737, b: 1.0, a: 0.8 };

function polygon_array_to_triangle_list(
  polygon: PolygonArray,
  color: Color | undefined = undefined,
): TriangleListPrimitive {
  const earcut_input = flatten(polygon);
  const triangles = earcut(earcut_input.vertices, earcut_input.holes, earcut_input.dimensions);
  return {
    points: vertices_to_points(earcut_input.vertices),
    indices: triangles,
    pose: {
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
    },
    color: color ?? DEFAULT_COLOR,
    colors: [],
  };
}

function polygon_to_array(polygon: Polygon2D): PolygonArray {
  return [points_to_coordinates(polygon.points)];
}

function complex_polygon_to_array(polygon: ComplexPolygon2D): PolygonArray {
  const outer_coordinates = points_to_coordinates(polygon.outer.points);
  const holes = polygon.inner.map((hole: Polygon2D) => points_to_coordinates(hole.points));
  return [outer_coordinates, ...holes];
}

function polygon_to_triangle_list(
  polygon: Polygon2D,
  color: Color | undefined = undefined,
): TriangleListPrimitive {
  const polygon_array = polygon_to_array(polygon);
  return polygon_array_to_triangle_list(polygon_array, color);
}

function complex_polygon_to_triangle_list(
  polygon: ComplexPolygon2D,
  color: Color | undefined = undefined,
): TriangleListPrimitive {
  const polygon_array = complex_polygon_to_array(polygon);
  return polygon_array_to_triangle_list(polygon_array, color);
}

const triangles_scene_update = (
  header: Header,
  triangles: TriangleListPrimitive[],
): SceneUpdate => ({
  deletions: [],
  entities: [
    {
      timestamp: header.stamp,
      frame_id: header.frame_id,
      id: "",
      lifetime: { sec: 0, nsec: 0 },
      frame_locked: true,
      metadata: [],
      arrows: [],
      cubes: [],
      spheres: [],
      cylinders: [],
      lines: [],
      triangles,
      texts: [],
      models: [],
    },
  ],
});

export const Polygon2DStampedConverter: RegisterMessageConverterArgs<Polygon2DStamped> = {
  fromSchemaName: "polygon_msgs/msg/Polygon2DStamped",
  toSchemaName: "foxglove.SceneUpdate",
  converter: (inputMessage: Polygon2DStamped): SceneUpdate => {
    return triangles_scene_update(inputMessage.header, [
      polygon_to_triangle_list(inputMessage.polygon),
    ]);
  },
};

export const ComplexPolygon2DStampedConverter: RegisterMessageConverterArgs<ComplexPolygon2DStamped> =
  {
    fromSchemaName: "polygon_msgs/msg/ComplexPolygon2DStamped",
    toSchemaName: "foxglove.SceneUpdate",
    converter: (inputMessage: ComplexPolygon2DStamped): SceneUpdate => {
      return triangles_scene_update(inputMessage.header, [
        complex_polygon_to_triangle_list(inputMessage.polygon),
      ]);
    },
  };

export const ComplexPolygon2DCollectionConverter: RegisterMessageConverterArgs<ComplexPolygon2DCollection> =
  {
    fromSchemaName: "polygon_msgs/msg/ComplexPolygon2DCollection",
    toSchemaName: "foxglove.SceneUpdate",
    converter: (inputMessage: ComplexPolygon2DCollection): SceneUpdate => {
      return triangles_scene_update(
        inputMessage.header,
        inputMessage.polygons.map((polygon, index) =>
          complex_polygon_to_triangle_list(polygon, inputMessage.colors[index]),
        ),
      );
    },
  };

export const Polygon2DCollectionConverter: RegisterMessageConverterArgs<Polygon2DCollection> = {
  fromSchemaName: "polygon_msgs/msg/Polygon2DCollection",
  toSchemaName: "foxglove.SceneUpdate",
  converter: (inputMessage: Polygon2DCollection): SceneUpdate => {
    return triangles_scene_update(
      inputMessage.header,
      inputMessage.polygons.map((polygon, index) =>
        polygon_to_triangle_list(polygon, inputMessage.colors[index]),
      ),
    );
  },
};
