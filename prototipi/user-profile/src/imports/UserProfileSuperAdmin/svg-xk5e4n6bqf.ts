const svgPaths = new Proxy(
  {} as Record<string, string>,
  { get: () => "" }
);

export default svgPaths;
