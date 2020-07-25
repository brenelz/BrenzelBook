const purgecss = [
  "@fullhuman/postcss-purgecss",
  {
    content: [
      "./components/**/*.js",
      "./pages/**/*.js",
      "./layouts/**/*.js",
      "./cells/**/*.js",
    ],
    defaultExtractor: (content) => content.match(/[\w-/.:]+(?<!:)/g) || [],
  },
];
module.exports = {
  plugins: [
    "postcss-import",
    "tailwindcss",
    "autoprefixer",
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
