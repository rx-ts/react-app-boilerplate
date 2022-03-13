/// <reference types="@welldone-software/why-did-you-render" />
/// <reference types="typed-query-selector/strict" />
/// <reference types="vite/client" />

declare module '*.svg?svgr' {
  const SvgComponent: React.ComponentType<React.SVGAttributes<SVGElement>>
  const url: string
  export { SvgComponent }
  export default url
}
