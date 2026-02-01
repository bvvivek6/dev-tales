export const posts = [
  {
    id: 1,
    title: "The Future of React Server Components",
    excerpt:
      "Exploring how RSCs are changing the way we build web applications and what it means for frontend developers.",
    date: "Feb 1, 2026",
    readTime: "5 min read",
    category: "Tech",
    content: `
      <p>React Server Components (RSC) represent a major shift in the React ecosystem. By allowing components to render exclusively on the server, we can reduce bundle sizes and improve initial page load performance.</p>
      
      <h3>Why RSC?</h3>
      <p>Traditionally, React components run on the client. This means all the JavaScript code for those components needs to be downloaded, parsed, and executed by the browser. With RSC, the server does the heavy lifting.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Zero Bundle Size:</strong> Server components don't add to your JS bundle.</li>
        <li><strong>Direct Backend Access:</strong> Access databases and fs directly in your components.</li>
        <li><strong>Automatic Code Splitting:</strong> The framework handles splitting client components.</li>
      </ul>
      
      <p>This is just the beginning of a new era in frontend development.</p>
    `,
  },
  {
    id: 2,
    title: "Minimalism in UI Design",
    excerpt:
      "Why less is more when it comes to user interfaces. A deep dive into negative space and typography.",
    date: "Jan 28, 2026",
    readTime: "4 min read",
    category: "UI/UX",
    content: `
      <p>Minimalism isn't just an aesthetic choice; it's a functional one. By removing clutter, we guide the user's attention to what truly matters.</p>
      
      <h3>The Power of Whitespace</h3>
      <p>Whitespace (or negative space) is not empty space. It's an active design element that provides structure and clarity.</p>
      
      <h3>Typography as UI</h3>
      <p>When you strip away heavy graphics, typography takes center stage. Choosing the right font pairing is crucial for a minimal design system.</p>
    `,
  },
  {
    id: 3,
    title: "Understanding Tailwind CSS v4",
    excerpt:
      "A look at the new engine and features in the latest version of the popular utility-first framework.",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    category: "Tech",
    content: `
      <p>Tailwind CSS v4 introduces a new high-performance engine that is significantly faster and requires no configuration.</p>
      
      <h3>Zero Config</h3>
      <p>The days of <code>tailwind.config.js</code> are largely over. The new engine detects your classes and generates CSS on the fly with incredible speed.</p>
    `,
  },
];
