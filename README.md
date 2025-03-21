# foxglove-polygon-ros

![foxglove visualization of a bunch of polygons](demo.png)

Visualize complex polygons in Foxglove Studio with messages from https://github.com/MetroRobots/polygon_ros.

Currently all polygons are drawn as triangle lists only with no outlines, because you can't control the outline width in Foxglove Studio, which could be problematic since relevant widths vary greatly by scale.

Colors passed to `Polygon2DCollection` and `ComplexPolygon2DCollection` are respected.

Note that you can still change the color of all entities from the 3D panel options.