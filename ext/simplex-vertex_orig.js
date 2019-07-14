THREE.SimplexVertex = {
  uniforms: {
  "tDiffuse": 	{ type: "t", value: null },
  'u_resolution': 	{ type: 't', value: null },
  'time': 		{ type: 'f', value: 0.0 },
  "amount":    { value: 0.0 },
  "speed":    { value: 10.5 }
  },

  vertexShader: [
    '#define PI 3.14159265359',
    '#define TWO_PI 6.28318530718',

    "uniform sampler2D tDiffuse;",
    'uniform vec2 u_resolution;',
    'uniform float time;',
    'uniform float amount;',
    'uniform float speed;',
    "varying vec2 vUv;",

    'vec3 random3(vec3 c) {',
      'float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));',
      'vec3 r;',
      'r.z = fract(512.0*j);',
      'j *= .125;',
      'r.x = fract(512.0*j);',
      'j *= .125;',
      'r.y = fract(512.0*j);',
      'return r-0.5;',
    '}',

    'const float F3 =  0.3333333;',
    'const float G3 =  0.1666667;',

    'float snoise(vec3 p) {',

      'vec3 s = floor(p + dot(p, vec3(F3)));',
      'vec3 x = p - s + dot(s, vec3(G3));',

      'vec3 e = step(vec3(0.0), x - x.yzx);',
      'vec3 i1 = e*(1.0 - e.zxy);',
      'vec3 i2 = 1.0 - e.zxy*(1.0 - e);',

      'vec3 x1 = x - i1 + G3;',
      'vec3 x2 = x - i2 + 2.0*G3;',
      'vec3 x3 = x - 1.0 + 3.0*G3;',

      'vec4 w, d;',

      'w.x = dot(x, x);',
      'w.y = dot(x1, x1);',
      'w.z = dot(x2, x2);',
      'w.w = dot(x3, x3);',

      'w = max(0.6 - w, 0.0);',

      'd.x = dot(random3(s), x);',
      'd.y = dot(random3(s + i1), x1);',
      'd.z = dot(random3(s + i2), x2);',
      'd.w = dot(random3(s + 1.0), x3);',

      'w *= w;',
      'w *= w;',
      'd *= w;',

      'return dot(d, vec4(52.0));',
    '}',

    'void main(){',
    ' vec2 st = position.xy;',
      // 'st.y *= u_resolution.y/u_resolution.x;',

      'float t = time * speed;',

      "vec2 p = vUv;",

      'float df = 0.696;',
      'df += snoise(vec3(st*75.,t*0.1))*0.03;',

      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x, position.y, position.x * position.y + step(amount,df) * 0.010, 1.0 );',
    '}'
  ].join('\n'),

  fragmentShader: [
"varying vec2 vUv;",
  'void main(){',
    'vec3 color = vec3( vUv * ( 1. - 2. ), 0.0 );',
    'gl_FragColor = vec4( color.rgb, 1. );',
  '}'

  ].join('\n')
};
