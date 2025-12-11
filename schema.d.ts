// WIP -- schema format for defining data structures and UI


type TreeSchema = {
  definitions: Definition[];
  pages: ObjectSchema[];
}

type Definition = {
  defId: string;
  schema: Exclude<Schema, ReferenceSchema>;
}

type Schema = ObjectSchema | ArraySchema | EnumSchema | PrimitiveDefinition | ReferenceSchema;

type SchemaBase = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  icon: string;
  color: string;
  type: "object" | "array" | "enum" | "primitive" | "#ref";
}

type ObjectSchema = SchemaBase & {
  type: "object";
  properties: Definition[];
  ui: "table" | "tree"
}

type ArraySchema = SchemaBase & {
  type: "array";
  elements: Definition[];
  ui: "list" | "table" | "tree" | "select-list" | "radio-list" | "tags" | "grid" |
  "select-grid" | "multi-select-grid" | "toggle";
  defaultIndex: number;
  elementsSettings: {
    minLength: number;
    maxLength: number;
    unique: boolean;
  }
}

type EnumSchema = SchemaBase & {
  // Don't need this? Enum is really just a kind of Array
  type: "enum";
  options: Definition[];
  ui: ArraySchema["ui"];
}

type PrimitiveDefinition = SchemaBase & {
  type: "primitive";
  dataType: "string" | "number" | "boolean";
  ui:
  // string
  "input" | "input-area" | "rich-text" | "link" | "image" | "map" | "color-picker" |
  // number
  "input" | "date-picker" | "date-time-picker" | "time-picker" | "dial" | "range-slider" |
  // boolean
  "checkbox" | "switch"
  numberSettings?: {
    min: number;
    max: number;
    step: number;
    precision: number;
  }
  stringSettings?: {
    minLength: number;
    maxLength: number;
    format: "text" | "email" | "url" | "phone" | "password" | "date" | "time" | "datetime" | "color" |
    "creditcard" | "ssn" | "zip" | "countrycode" | "currencycode" | "languagecode" | "timestamp" |
    "month" | "week" | "location" | "latitude-longitude";
    allowed: RegExp[];
    disallowed: RegExp[];
  }
  allowInvalid: boolean;
}

type ReferenceSchema = SchemaBase & {
  type: "#ref";
  defId: string;
}