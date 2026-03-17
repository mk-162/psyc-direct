const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, 'content', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

let invalidFiles = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const parsed = matter(content);
    if (!parsed.data || !parsed.data.title) {
      invalidFiles.push(file);
    }
  } catch (err) {
    console.error("Error parsing " + file + ":", err.message);
    invalidFiles.push(file);
  }
});

if (invalidFiles.length > 0) {
  console.log('The following files are missing a title or have malformed frontmatter:');
  console.log(invalidFiles.join(", "));
} else {
  console.log('All files have a title.');
}
