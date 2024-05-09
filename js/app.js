/**
 * 加载 CSS Style
 */
const loadStyle = (url) => new Promise((resolve, reject) => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.src = url;
  style.onload = resolve;
  style.onerror = reject;
  document.head.appendChild(script);
})
/**
 * 加载 JavaScript Script
 */
const loadScript = (url) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.onload = resolve;
  script.onerror = reject;
  document.body.appendChild(script);
})
