/** Living Atlas WebGL2 renderer. No external runtime dependencies. */
const vertex = `#version 300 es
precision highp float;
void main(){ vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.); }`;
const fragment = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uResolution;
uniform float uTime,uYaw,uPitch,uZoom,uReduced;
uniform float uDestination;
#define PI 3.14159265359
float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.07+vec3(3.7,1.1,2.4);a*=.5;}return v;}
mat3 rotY(float a){float s=sin(a),c=cos(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotX(float a){float s=sin(a),c=cos(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
float terrain(vec2 p){
 // Each chapter occupies its own geographic environment, not a yaw offset of one height field.
 if(uDestination<.5){ // Teaching: broad stepped hills, an observatory plateau
   float hills=fbm(vec3(p*.22,2.))*1.2;
   float plateau=1.-smoothstep(2.2,3.2,length(p-vec2(0.,-5.)));
   return hills*.65+plateau*.8;
 }
 if(uDestination<1.5){ // GIS: dramatic surveyed mountain relief
   return fbm(vec3(p*.32,2.))*2.2+fbm(vec3(p*1.1,7.))*.38;
 }
 // Digital: ordered architectural grid, physically distinct from natural terrain
 vec2 cell=abs(fract(p*.33)-.5);
 float towers=pow(1.-smoothstep(.15,.32,max(cell.x,cell.y)),2.);
 return .24+ towers*(.65+.9*noise(vec3(floor(p*.33),5.)));
}
vec3 orbit(vec2 uv){
 vec2 p=uv; // uv is already scaled by screen height: no second aspect correction
 vec3 ro=vec3(0.,0.,uResolution.x/uResolution.y < .8 ? 10.5 : 6.4),rd=normalize(vec3(p,-2.));
 float b=dot(ro,rd),c=dot(ro,ro)-1.,h=b*b-c;
 float stars=step(.9983,hash(vec3(floor(uv*uResolution*.66),8.)))*(.35+.65*hash(vec3(floor(uv*uResolution*.66),3.)));
 vec3 col=mix(vec3(.003,.012,.035),vec3(.016,.072,.12),exp(-length(p)*1.8))+stars*vec3(.4,.78,1.);
 float rim=exp(-abs(sqrt(max(0.,h)))*5.)*step(0.,h);
 col+=vec3(.02,.5,.7)*rim*.4;
 if(h>0.){
 float t=-b-sqrt(h); if(t>0.){
 vec3 n=normalize(ro+rd*t);
 vec3 q=rotX(uPitch)*rotY(uYaw)*n;
 float land=fbm(q*3.8)+.25*fbm(q*12.);
 float coast=smoothstep(.52,.58,land);
 float mountain=smoothstep(.6,.83,land)*fbm(q*34.);
 vec3 ocean=mix(vec3(.012,.09,.18),vec3(.025,.25,.33),fbm(q*11.));
 vec3 ground=mix(vec3(.045,.24,.19),vec3(.23,.38,.28),fbm(q*15.));
 ground=mix(ground,vec3(.58,.66,.58),mountain*.9);
 vec3 base=mix(ocean,ground,coast);
 float ice=smoothstep(.83,.96,abs(q.y));base=mix(base,vec3(.73,.85,.88),ice);
 float light=max(dot(n,normalize(vec3(-.75,.45,1.))),0.);
 float night=.09+.91*light;
 float gridLat=1.-smoothstep(.015,.04,abs(sin(asin(clamp(q.y,-1.,1.))*12.)));
 float gridLon=1.-smoothstep(.012,.038,abs(sin(atan(q.z,q.x)*12.)));
 vec3 lit=base*night+vec3(.04,.52,.59)*(gridLat+gridLon)*.11*light;
 float edge=pow(1.-max(dot(n,-rd),0.),3.);
 col=lit+edge*vec3(.11,.6,.83)*1.5;
 }}
 return col;
}
vec3 surface(vec2 uv){
 vec2 p=uv; // aspect already accounted for
 vec3 ro=vec3(0.,2.8,5.8),rd=normalize(vec3(p.x*.9,p.y*.8-.35,-1.8));
 float angle=uYaw*.16;rd=rotY(angle)*rd;
 // Stable, deliberately distinct viewpoints for the three environments.
 if(uDestination<.5) {ro.xz+=vec2(0.,-1.5);}
 else if(uDestination>1.5) {ro.xz+=vec2(1.5,-2.);}

 vec3 col=uDestination<.5 ? vec3(.06,.075,.11) : (uDestination<1.5 ? vec3(.008,.03,.055) : vec3(.015,.012,.065));
 float t=0.;bool hit=false;vec3 pos=vec3(0.);
 for(int i=0;i<60;i++){
  pos=ro+rd*t;
  float d=pos.y-terrain(pos.xz)*.72;
  if(d<.014){hit=true;break;}
  t+=max(.025,d*.48);
  if(t>45.)break;
 }
 if(hit){
 float h=terrain(pos.xz);
 float eps=.035;
 vec3 n=normalize(vec3((terrain(pos.xz-vec2(eps,0.))-terrain(pos.xz+vec2(eps,0.)))*.72,eps*2.,(terrain(pos.xz-vec2(0.,eps))-terrain(pos.xz+vec2(0.,eps)))*.72));
 float light=max(dot(n,normalize(vec3(-.5,1.,.6))),0.);
 vec3 base;
 if(uDestination<.5){
   // Knowledge Observatory: warm stone, luminous study pathways, stepped grounds.
   base=mix(vec3(.11,.12,.17),vec3(.44,.32,.21),smoothstep(.35,1.15,h));
 }else if(uDestination<1.5){
   base=mix(vec3(.025,.14,.16),vec3(.13,.32,.26),smoothstep(.55,1.6,h));
   base=mix(base,vec3(.45,.53,.47),smoothstep(1.5,2.2,h));
 }else{
   // Innovation Hangar: deep cobalt towers and illuminated structural surfaces.
   base=mix(vec3(.025,.025,.095),vec3(.09,.14,.35),smoothstep(.3,1.4,h));
 }
 float contours=1.-smoothstep(.015,.065,abs(sin(h*20.)));
 float grid=pow(1.-smoothstep(.0,.055,abs(sin(pos.x*1.3))),2.)+pow(1.-smoothstep(.0,.055,abs(sin(pos.z*1.3))),2.);
 if(uDestination<.5){
   float paths=1.-smoothstep(.015,.07,abs(sin(pos.x*1.1)*sin(pos.z*.9)));
   col=base*(.4+light*.8)+vec3(1.,.68,.31)*paths*.3+vec3(.4,.75,.8)*contours*.055;
 }else if(uDestination<1.5){
   col=base*(.3+light*.8)+vec3(.04,.7,.76)*contours*.2+vec3(.04,.45,.48)*grid*.07;
 }else{
   float streets=1.-smoothstep(.025,.08,min(abs(sin(pos.x*2.08)),abs(sin(pos.z*2.08))));
   col=base*(.22+light*.9)+vec3(.25,.35,1.)*streets*.42+vec3(.14,.86,1.)*contours*.11;
 }
 col=mix(col,vec3(.025,.11,.17),1.-exp(-t*.025));
 }
 float horizon=exp(-abs(p.y+.1)*9.);
 col+=(uDestination<.5 ? vec3(.22,.12,.045) : uDestination<1.5 ? vec3(.015,.18,.23) : vec3(.12,.05,.36))*horizon*.5;
 return col;
}
void main(){vec2 uv=(gl_FragCoord.xy-uResolution*.5)/uResolution.y;
 float transition=0.; // Keep interactive markers attached to the globe; terrain scenes retained for future optional exploration.
 vec3 col=mix(orbit(uv),surface(uv),transition);
 float vignette=1.-.35*smoothstep(.15,1.4,length(uv));
 col*=vignette;
 col=pow(max(col,0.),vec3(.88));
 fragColor=vec4(col,1.);
}`;
export type AtlasCamera = { yaw: number; pitch: number; zoom: number; destination?: number };

function atlasPixelRatio(reducedMotion: boolean) {
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
  const constrainedDevice = (navigator.hardwareConcurrency || 4) <= 4 || (navigatorWithMemory.deviceMemory || 4) <= 4;
  const cap = reducedMotion || constrainedDevice ? 1 : window.innerWidth < 700 ? 1.15 : 1.5;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function startAtlasWebGL(canvas: HTMLCanvasElement, camera: () => AtlasCamera, reduced: () => boolean): (() => void) | null {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const compile = (type: number, source: string) => { const shader = gl.createShader(type); if (!shader) throw new Error('WebGL shader unavailable'); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed'); return shader; };
  let program: WebGLProgram;
  try {
    const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
    const p=gl.createProgram(); if (!p) return null;
    gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);
    gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)||'Shader link failed');
    program=p;
  } catch (error) { console.warn('Atlas WebGL unavailable; using canvas fallback.',error); return null; }
  const uniforms = Object.fromEntries(['uResolution','uTime','uYaw','uPitch','uZoom','uReduced','uDestination'].map(name=>[name,gl.getUniformLocation(program,name)]));
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);gl.useProgram(program);
  let raf=0,disposed=false,visible=!document.hidden,lastWidth=0,lastHeight=0;
  let lastCamera={yaw:Number.NaN,pitch:Number.NaN,zoom:Number.NaN,destination:Number.NaN};
  const visibility=()=>{visible=!document.hidden;};document.addEventListener('visibilitychange',visibility);
  const started=performance.now();
  const render=()=>{
    if(disposed)return;
    const rect=canvas.getBoundingClientRect();
    const dpr=atlasPixelRatio(reduced());
    const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
    const resized=w!==lastWidth||h!==lastHeight;
    if(resized){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);lastWidth=w;lastHeight=h;canvas.dataset.pixelRatio=dpr.toFixed(2);}
    const c=camera();
    const cameraChanged=Math.abs(c.yaw-lastCamera.yaw)>.0001||Math.abs(c.pitch-lastCamera.pitch)>.0001||Math.abs(c.zoom-lastCamera.zoom)>.0001 || (c.destination ?? 0)!==lastCamera.destination;
    if(visible&&(resized||cameraChanged)){
      gl.uniform2f(uniforms.uResolution,w,h);gl.uniform1f(uniforms.uTime,(performance.now()-started)/1000);gl.uniform1f(uniforms.uYaw,c.yaw);gl.uniform1f(uniforms.uPitch,c.pitch);gl.uniform1f(uniforms.uZoom,c.zoom);gl.uniform1f(uniforms.uReduced,reduced()?1:0);gl.uniform1f(uniforms.uDestination,c.destination ?? 1);gl.drawArrays(gl.TRIANGLES,0,3);
      lastCamera={...c,destination:c.destination ?? 1};
    }
    raf=requestAnimationFrame(render);
  };
  raf=requestAnimationFrame(render);
  return ()=>{disposed=true;cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);gl.deleteVertexArray(vao);gl.deleteProgram(program);};
}
