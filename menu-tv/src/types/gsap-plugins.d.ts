/**
 * gsap ships its bonus plugins (DrawSVGPlugin, SplitText, ...) as ESM files
 * without bundled type declarations in some setups. These shims keep `tsc`
 * happy while the runtime behaviour comes from the real plugin files.
 */
declare module 'gsap/DrawSVGPlugin' {
  const DrawSVGPlugin: any;
  export default DrawSVGPlugin;
}

declare module 'gsap/SplitText' {
  const SplitText: any;
  export default SplitText;
}

declare module 'gsap/TextPlugin' {
  const TextPlugin: any;
  export default TextPlugin;
}

declare module 'gsap/ScrambleTextPlugin' {
  const ScrambleTextPlugin: any;
  export default ScrambleTextPlugin;
}
