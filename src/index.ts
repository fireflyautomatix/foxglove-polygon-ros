import { ExtensionContext } from "@foxglove/studio";

import {
  Polygon2DStampedConverter,
  Polygon2DCollectionConverter,
  ComplexPolygon2DStampedConverter,
  ComplexPolygon2DCollectionConverter,
} from "./PolygonRosConverters";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerMessageConverter(Polygon2DStampedConverter);
  extensionContext.registerMessageConverter(Polygon2DCollectionConverter);
  extensionContext.registerMessageConverter(ComplexPolygon2DStampedConverter);
  extensionContext.registerMessageConverter(ComplexPolygon2DCollectionConverter);
}
