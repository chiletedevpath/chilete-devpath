/* =========================
   CONSOLE-LINES.JS
   ========================= */

const BASE_STRUCTURE_ES = [
  `<span class="token-comment">// Chilete DevPath – Programa principal</span>`,
  `<span class="token-keyword">public</span> <span class="token-keyword">class</span> <span class="token-class">ChileteDevPath</span> {`,
  ``,
  `    <span class="token-comment">// Punto de inicio del camino</span>`,
  `    <span class="token-keyword">public</span> <span class="token-keyword">static</span> <span class="token-type">void</span> <span class="token-method">main</span>(<span class="token-type">String</span>[] args) {`,
  ``,
  `        <span class="token-comment">// Inicialización del sistema</span>`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Iniciando Chilete DevPath..."</span>);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"¿Preparado?"</span>);`,
  ``,
  `        <span class="token-comment">// Datos del autor</span>`,
  `        <span class="token-type">String</span> autor = <span class="token-string">"Adrian Pisco"</span>;`,
  `        <span class="token-type">String</span> origen = <span class="token-string">"Chilete, Cajamarca · Perú"</span>;`,
  `        <span class="token-type">String</span> enfoque = <span class="token-string">"Backend · Lógica · Arquitectura"</span>;`,
  ``,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Autor: "</span> + autor);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Origen: "</span> + origen);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Enfoque: "</span> + enfoque);`,
  ``,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"DevPath cargado correctamente"</span>);`,
  `    }`,
  `}`
];

const BASE_STRUCTURE_EN = [
  `<span class="token-comment">// Chilete DevPath – Main program</span>`,
  `<span class="token-keyword">public</span> <span class="token-keyword">class</span> <span class="token-class">ChileteDevPath</span> {`,
  ``,
  `    <span class="token-comment">// Journey entry point</span>`,
  `    <span class="token-keyword">public</span> <span class="token-keyword">static</span> <span class="token-type">void</span> <span class="token-method">main</span>(<span class="token-type">String</span>[] args) {`,
  ``,
  `        <span class="token-comment">// System initialization</span>`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Starting Chilete DevPath..."</span>);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Ready?"</span>);`,
  ``,
  `        <span class="token-comment">// Author data</span>`,
  `        <span class="token-type">String</span> author = <span class="token-string">"Adrian Pisco"</span>;`,
  `        <span class="token-type">String</span> origin = <span class="token-string">"Chilete, Cajamarca · Peru"</span>;`,
  `        <span class="token-type">String</span> focus = <span class="token-string">"Backend · Logic · Architecture"</span>;`,
  ``,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Author: "</span> + author);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Origin: "</span> + origin);`,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"Focus: "</span> + focus);`,
  ``,
  `        <span class="token-method">System.out.println</span>(<span class="token-string">"DevPath loaded successfully"</span>);`,
  `    }`,
  `}`
];

export const CONSOLE_LINES_ES = BASE_STRUCTURE_ES;
export const CONSOLE_LINES_EN = BASE_STRUCTURE_EN;
