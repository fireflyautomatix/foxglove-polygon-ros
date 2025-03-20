import { Color } from "@foxglove/schemas";

export type Header = {
  stamp: {
    sec: number;
    nsec: number;
  };
  frame_id: string;
};

export type Point2D = {
  x: number;
  y: number;
};

export type Polygon2D = {
  points: Point2D[];
};

export type Polygon2DStamped = {
  header: Header;
  polygon: Polygon2D;
};

export type ComplexPolygon2D = {
  outer: Polygon2D;
  inner: Polygon2D[];
};

export type ComplexPolygon2DStamped = {
  header: Header;
  polygon: ComplexPolygon2D;
};

export type ComplexPolygon2DCollection = {
  header: Header;
  polygons: ComplexPolygon2D[];
  colors: Color[];
};

export type Polygon2DCollection = {
  header: Header;
  polygons: Polygon2D[];
  colors: Color[];
};
