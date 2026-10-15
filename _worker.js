// Cloudflare Pages Advanced Mode. El contenido de la carta nunca se envía sin validar el código.
const paragraphs = [
  '¡Antes que nada, muchísimas felicidades! 💛',
  'Hoy me pareció una excelente ocasión para interrumpir tu domingo con una felicitación que, por fortuna, no requiere contestación, revisión ni firma.',
  'Espero que estés teniendo un domingo precioso, que te consientan muchísimo, que te sobren motivos para reír, que comas algo delicioso y que no tengas absolutamente ninguna urgencia que no pueda esperar al lunes.',
  'No quería dejar pasar tu cumpleaños sin mandarte un mensajito especial, aunque eso implicara desarrollar todo un sistema de correspondencia privada para decirte algo bastante sencillo:',
  'Me da muchísimo gusto haberte conocido y poder coincidir contigo.',
  'Que la vida te siga sorprendiendo con cosas bonitas, que tengas un año lleno de oportunidades que te emocionen y que nunca te falten razones para celebrar.',
  'Y si alguien te pregunta qué decía esta carta, puedes decirle que es información reservada. A mí me parece una respuesta perfectamente razonable.',
  'Te mando un abrazo enorme.'
];
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'}});
async function checkCode(code, expected){
 const enc=new TextEncoder();
 const a=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(code.normalize('NFC'))));
 const b=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(expected.normalize('NFC'))));
 let diff=0;for(let i=0;i<a.length;i++) diff |= a[i]^b[i];return diff===0;
}
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname==='/api/abrir-carta'){
   if(request.method!=='POST')return json({ok:false},405);
   const expected=env.CASTLE_ACCESS_CODE;
   if(typeof expected!=='string'||expected.length<6)return json({ok:false,error:'not_configured'},503);
   let input;try{input=(await request.json()).code;}catch{return json({ok:false},400)}
   if(typeof input!=='string'||input.length>80)return json({ok:false},400);
   if(!await checkCode(input,expected))return json({ok:false},401);
   return json({ok:true,paragraphs});
 }
 return env.ASSETS.fetch(request);
}};
