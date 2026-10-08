export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Ruan Coetzee</p>
      <p>React preview built with React 19, TypeScript, Vite and dedicated CSS. The legacy Tailwind CSS and Vanta.js site remains unchanged.</p>
    </footer>
  );
}
