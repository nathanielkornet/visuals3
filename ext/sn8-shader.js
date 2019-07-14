THREE.Sn8Shader = {
  uniforms: {
  "tDiffuse": 	{ type: "t", value: null },
  'u_resolution': 	{ type: 't', value: null },
  'time': 		{ type: 'f', value: 0.0 },
  "scale":    { value: 10.0 },
  },

  vertexShader: [
    'varying vec2 vUv;',
    'void main() {',
    'vUv = uv;',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    '}'
  ].join('\n'),

  fragmentShader: [

    // Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

  // #ifdef GL_ES
  // precision mediump float;
  // #endif

    "uniform sampler2D tDiffuse;",
    'uniform vec2 u_resolution;',
    'uniform float time;',
    'uniform float scale;',
    "varying vec2 vUv;",

    'float random (in vec2 st) {',
      'return fract(sin(dot(st.xy,vec2(12.9898,78.233))) * 43758.5453123) + time * 0.05;',
    '}',

    // Value noise by Inigo Quilez - iq/2013
    // https://www.shadertoy.com/view/lsf3WH
    'float noise(vec2 st) {',
        'vec2 i = floor(st);',
        'vec2 f = fract(st);',
        'vec2 u = f*f*(3.0-2.0*f);',
        'return mix( mix( random( i + vec2(0.0,0.0) ),',
                         'random( i + vec2(1.0,0.0) ), u.x),',
                    'mix( random( i + vec2(0.0,1.0) ),',
                         'random( i + vec2(1.0,1.0) ), u.x), u.y);',
    '}',

    'mat2 rotate2d(float angle){',
        'return mat2(cos(angle),-sin(angle),',
                    'sin(angle),cos(angle));',
    '}',

    'float lines(in vec2 pos, float b){',
        // 'float scale = 100.0;',
      '  pos *= scale;',
        'return smoothstep(0.0,',
                        '.5+b*.5,',
                        'abs((sin(pos.x*3.1415)+b*2.0))*.5);',
    '}',

    'void main() {',
      'vec2 st = gl_FragCoord.xy/u_resolution.xy;',
      'st.y *= u_resolution.y/u_resolution.x;',

      'vec2 pos = st.yx*vec2(10.,3.);',

      "vec2 p = vUv;",

      'float pattern = pos.x + pos.y;',

      // Add noise
      'pos = rotate2d( noise(pos) ) * pos;',

      // Draw lines
      'pattern = lines(pos,.5);',

      // 'gl_FragColor = vec4(vec3(pattern),1.0);',
      "gl_FragColor = texture2D(tDiffuse, vec2(p.x + pattern + time, p.y + pattern));",
    '}'
  ].join('\n')
};
