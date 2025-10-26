// Jest setup file for testing configuration

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    reload: jest.fn(),
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: "div",
    span: "span",
    button: "button",
    img: "img",
    section: "section",
    article: "article",
    header: "header",
    footer: "footer",
    nav: "nav",
    main: "main",
    aside: "aside",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    p: "p",
    a: "a",
    ul: "ul",
    ol: "ol",
    li: "li",
    form: "form",
    input: "input",
    textarea: "textarea",
    select: "select",
    option: "option",
    label: "label",
    fieldset: "fieldset",
    legend: "legend",
    table: "table",
    thead: "thead",
    tbody: "tbody",
    tfoot: "tfoot",
    tr: "tr",
    th: "th",
    td: "td",
    canvas: "canvas",
    svg: "svg",
    path: "path",
    circle: "circle",
    rect: "rect",
    line: "line",
    polyline: "polyline",
    polygon: "polygon",
    ellipse: "ellipse",
    g: "g",
    defs: "defs",
    use: "use",
    symbol: "symbol",
    marker: "marker",
    pattern: "pattern",
    clipPath: "clipPath",
    mask: "mask",
    linearGradient: "linearGradient",
    radialGradient: "radialGradient",
    stop: "stop",
    animate: "animate",
    animateTransform: "animateTransform",
    animateMotion: "animateMotion",
    mpath: "mpath",
    set: "set",
    text: "text",
    tspan: "tspan",
    tref: "tref",
    textPath: "textPath",
    altGlyph: "altGlyph",
    altGlyphDef: "altGlyphDef",
    altGlyphItem: "altGlyphItem",
    glyphRef: "glyphRef",
    font: "font",
    fontFace: "fontFace",
    missingGlyph: "missingGlyph",
    hkern: "hkern",
    vkern: "vkern",
    foreignObject: "foreignObject",
    desc: "desc",
    title: "title",
    metadata: "metadata",
    style: "style",
    script: "script",
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    onChange: jest.fn(),
  })),
  useTransform: jest.fn(() => jest.fn()),
  useSpring: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
  useInView: jest.fn(() => [jest.fn(), false]),
  useScroll: jest.fn(() => ({
    scrollX: { get: jest.fn() },
    scrollY: { get: jest.fn() },
    scrollXProgress: { get: jest.fn() },
    scrollYProgress: { get: jest.fn() },
  })),
  useDrag: jest.fn(() => ({
    x: { get: jest.fn() },
    y: { get: jest.fn() },
  })),
  useGesture: jest.fn(() => ({})),
  useCycle: jest.fn(() => [jest.fn(), jest.fn()]),
  usePresence: jest.fn(() => [true, jest.fn()]),
  useReducedMotion: jest.fn(() => false),
  useIsPresent: jest.fn(() => true),
  useWillChange: jest.fn(() => "auto"),
  useAnimationFrame: jest.fn(),
  useMotionValueEvent: jest.fn(),
  useTime: jest.fn(() => ({ get: jest.fn() })),
  useVelocity: jest.fn(() => ({ get: jest.fn() })),
  useAcceleration: jest.fn(() => ({ get: jest.fn() })),
  useSpringValue: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    stop: jest.fn(),
  })),
  useTransform: jest.fn(() => jest.fn()),
  useMotionTemplate: jest.fn(() => jest.fn()),
  useMotionValue: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    onChange: jest.fn(),
  })),
  useMotionValueEvent: jest.fn(),
  useWillChange: jest.fn(() => "auto"),
  useReducedMotion: jest.fn(() => false),
  useIsPresent: jest.fn(() => true),
  usePresence: jest.fn(() => [true, jest.fn()]),
  useCycle: jest.fn(() => [jest.fn(), jest.fn()]),
  useAnimationFrame: jest.fn(),
  useTime: jest.fn(() => ({ get: jest.fn() })),
  useVelocity: jest.fn(() => ({ get: jest.fn() })),
  useAcceleration: jest.fn(() => ({ get: jest.fn() })),
  useSpringValue: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    stop: jest.fn(),
  })),
  useTransform: jest.fn(() => jest.fn()),
  useMotionTemplate: jest.fn(() => jest.fn()),
}));

// Mock Three.js
jest.mock("three", () => ({
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement("canvas"),
  })),
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  BoxGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  Mesh: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  Color: jest.fn(),
  Vector3: jest.fn(),
  Euler: jest.fn(),
  Quaternion: jest.fn(),
  Matrix4: jest.fn(),
  BufferGeometry: jest.fn(),
  BufferAttribute: jest.fn(),
  Float32Array: jest.fn(),
  Uint16Array: jest.fn(),
  Uint32Array: jest.fn(),
  Int16Array: jest.fn(),
  Int32Array: jest.fn(),
  Float64Array: jest.fn(),
  Uint8Array: jest.fn(),
  Int8Array: jest.fn(),
  Uint8ClampedArray: jest.fn(),
  DataTexture: jest.fn(),
  CanvasTexture: jest.fn(),
  VideoTexture: jest.fn(),
  CompressedTexture: jest.fn(),
  CubeTexture: jest.fn(),
  DepthTexture: jest.fn(),
  Texture: jest.fn(),
  TextureLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  ImageLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  AudioLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  FontLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  CubeTextureLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  CompressedTextureLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  DataTextureLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  FileLoader: jest.fn(() => ({
    load: jest.fn(),
  })),
  Loader: jest.fn(),
  LoadingManager: jest.fn(),
  Cache: {
    enabled: false,
    files: {},
    add: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
    clear: jest.fn(),
  },
  REVISION: "1.0.0",
}));

// Mock React Three Fiber
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }) => children,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: {},
    gl: {},
    scene: {},
    raycaster: {},
    pointer: {},
    viewport: {},
    size: {},
    clock: {},
  })),
  useLoader: jest.fn(),
  useGraph: jest.fn(),
  useTexture: jest.fn(),
  useCubeTexture: jest.fn(),
  useFBX: jest.fn(),
  useGLTF: jest.fn(),
  useKTX2: jest.fn(),
  useDraco: jest.fn(),
  useProgress: jest.fn(() => ({
    active: false,
    progress: 100,
    item: "",
    loaded: 0,
    total: 0,
  })),
  Html: ({ children }) => children,
  Text: ({ children }) => children,
  Mesh: ({ children }) => children,
  Box: ({ children }) => children,
  Sphere: ({ children }) => children,
  Plane: ({ children }) => children,
  Cylinder: ({ children }) => children,
  Cone: ({ children }) => children,
  Torus: ({ children }) => children,
  Ring: ({ children }) => children,
  Tetrahedron: ({ children }) => children,
  Octahedron: ({ children }) => children,
  Dodecahedron: ({ children }) => children,
  Icosahedron: ({ children }) => children,
  Tube: ({ children }) => children,
  TorusKnot: ({ children }) => children,
  Lathe: ({ children }) => children,
  Extrude: ({ children }) => children,
  Shape: ({ children }) => children,
  Line: ({ children }) => children,
  QuadraticBezierLine: ({ children }) => children,
  CubicBezierLine: ({ children }) => children,
  CatmullRomLine: ({ children }) => children,
  Line2: ({ children }) => children,
  LineSegments: ({ children }) => children,
  Edges: ({ children }) => children,
  Wireframe: ({ children }) => children,
  Point: ({ children }) => children,
  Points: ({ children }) => children,
  InstancedPoints: ({ children }) => children,
  Sprite: ({ children }) => children,
  Billboard: ({ children }) => children,
  ScreenSpace: ({ children }) => children,
  ScreenQuad: ({ children }) => children,
  Backdrop: ({ children }) => children,
  Shadow: ({ children }) => children,
  ContactShadows: ({ children }) => children,
  AccumulativeShadows: ({ children }) => children,
  SpotLight: ({ children }) => children,
  PointLight: ({ children }) => children,
  DirectionalLight: ({ children }) => children,
  RectAreaLight: ({ children }) => children,
  HemisphereLight: ({ children }) => children,
  AmbientLight: ({ children }) => children,
  Lightformer: ({ children }) => children,
  Environment: ({ children }) => children,
  Sky: ({ children }) => children,
  Stars: ({ children }) => children,
  Cloud: ({ children }) => children,
  Sparkles: ({ children }) => children,
  Float: ({ children }) => children,
  Stage: ({ children }) => children,
  PresentationControls: ({ children }) => children,
  TransformControls: ({ children }) => children,
  PivotControls: ({ children }) => children,
  DragControls: ({ children }) => children,
  MapControls: ({ children }) => children,
  OrbitControls: ({ children }) => children,
  TrackballControls: ({ children }) => children,
  ArcballControls: ({ children }) => children,
  FlyControls: ({ children }) => children,
  FirstPersonControls: ({ children }) => children,
  PointerLockControls: ({ children }) => children,
  DeviceOrientationControls: ({ children }) => children,
  VRButton: ({ children }) => children,
  ARButton: ({ children }) => children,
  XR: ({ children }) => children,
  Controllers: ({ children }) => children,
  Hands: ({ children }) => children,
  DefaultXRControllers: ({ children }) => children,
  useXR: jest.fn(() => ({
    isPresenting: false,
    isHandTracking: false,
    player: {},
    controllers: [],
    gl: {},
    session: null,
    foveation: 0,
    referenceSpace: null,
  })),
  useController: jest.fn(() => ({})),
  useHand: jest.fn(() => ({})),
  useInteraction: jest.fn(() => ({})),
  useHitTest: jest.fn(() => ({})),
  usePlane: jest.fn(() => ({})),
  useAnchor: jest.fn(() => ({})),
  useCamera: jest.fn(() => ({})),
  useFBO: jest.fn(() => ({})),
  useDetectGPU: jest.fn(() => ({})),
  useAspect: jest.fn(() => 1),
  useCamera: jest.fn(() => ({})),
  useHelper: jest.fn(),
  useBVH: jest.fn(),
  useBounds: jest.fn(() => ({
    getSize: jest.fn(() => ({ x: 1, y: 1, z: 1 })),
    getCenter: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
    to: jest.fn(),
    fit: jest.fn(),
    clip: jest.fn(),
    refresh: jest.fn(),
  })),
  useCamera: jest.fn(() => ({})),
  useFBO: jest.fn(() => ({})),
  useDetectGPU: jest.fn(() => ({})),
  useAspect: jest.fn(() => 1),
  useCamera: jest.fn(() => ({})),
  useHelper: jest.fn(),
  useBVH: jest.fn(),
  useBounds: jest.fn(() => ({
    getSize: jest.fn(() => ({ x: 1, y: 1, z: 1 })),
    getCenter: jest.fn(() => ({ x: 0, y: 0, z: 0 })),
    to: jest.fn(),
    fit: jest.fn(),
    clip: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mock WebSocket
global.WebSocket = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
  send: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock crypto
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: jest.fn(() => "mock-uuid"),
    getRandomValues: jest.fn((arr) => arr),
  },
});

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Warning: componentWillReceiveProps") ||
        args[0].includes("Warning: componentWillMount"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Warning: ReactDOM.render") ||
        args[0].includes("Warning: componentWillReceiveProps") ||
        args[0].includes("Warning: componentWillMount"))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});
