import fs from 'fs';
import path from 'path';

const files = [
  'd:/Projects/SliitCareConnect/backend/routes/resource.routes.js',
  'd:/Projects/SliitCareConnect/backend/routes/feedback.routes.js',
  'd:/Projects/SliitCareConnect/backend/routes/quiz.routes.js',
  'd:/Projects/SliitCareConnect/backend/controllers/resource.controller.js',
  'd:/Projects/SliitCareConnect/backend/controllers/feedback.controller.js',
  'd:/Projects/SliitCareConnect/backend/controllers/quiz.controller.js',
  'd:/Projects/SliitCareConnect/backend/models/Resource.js',
  'd:/Projects/SliitCareConnect/backend/models/Feedback.js',
  'd:/Projects/SliitCareConnect/backend/middleware/fakeAuth.js',
  'd:/Projects/SliitCareConnect/backend/middleware/uploadResource.js',
  'd:/Projects/SliitCareConnect/backend/services/bookingService.js',
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');

  // Convert const X = require("Y") -> import X from "Y"
  content = content.replace(/const\s+\{([^}]+)\}\s*=\s*require\((['"])(.*?)\2\);?/g, 'import { $1 } from "$3.js";');
  content = content.replace(/const\s+([a-zA-Z0-9_]+)\s*=\s*require\((['"])(.*?)\2\);?/g, (match, varName, quote, modulePath) => {
    let importPath = modulePath;
    if (importPath.startsWith('.')) {
      if (!importPath.endsWith('.js') && !importPath.endsWith('.json')) {
        importPath += '.js';
      }
    }
    return `import ${varName} from "${importPath}";`;
  });

  // Convert require("Y") without assignment -> import "Y"
  content = content.replace(/^require\((['"])(.*?)\1\);?/gm, (match, quote, modulePath) => {
    let importPath = modulePath;
    if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
      importPath += '.js';
    }
    return `import "${importPath}";`;
  });

  // Convert module.exports = X -> export default X
  content = content.replace(/module\.exports\s*=\s*/g, 'export default ');

  // Convert exports.X = ... -> export const X = ...
  content = content.replace(/exports\.([a-zA-Z0-9_]+)\s*=\s*/g, 'export const $1 = ');

  // Some routes did: const router = require("express").Router();
  // which will become const router = import "express".Router(); if we don't fix it.
  content = content.replace(/import express from "express"\.Router\(\);/g, 'import express from "express";\nconst router = express.Router();');

  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Converted ${file}`);
}
