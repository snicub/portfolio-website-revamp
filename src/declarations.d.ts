// src/declarations.d.ts
declare module "*.css";
declare module "react-slick";
declare module "*.pdf";

declare module "*.gif" {
  const value: string;
  export default value;
}
