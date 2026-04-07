import Script from "next/script";

export default function Head() {
  return (
    <>
      <Script id="cleanup-extension-attrs" strategy="beforeInteractive">
        {`(function(){try{const attrs=['cz-shortcut-listen','data-gramm','gramm','gr-ext-status']; if(document){const run=()=>{attrs.forEach(n=>{try{document.body&&document.body.removeAttribute(n)}catch(e){}})}; if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run)}else{run()}}}catch(e){} })()`}
      </Script>
    </>
  );
}
