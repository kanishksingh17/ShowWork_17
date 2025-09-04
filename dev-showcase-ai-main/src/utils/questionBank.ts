// Comprehensive Question Bank for Tech Stack Assessment
// 300+ questions across multiple technologies
// Enhanced with web-based question integration

import { getHybridQuestions, preloadQuestions, clearExpiredCache } from './webQuestionService';

export interface Question {
  id: string;
  techStack: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export const QUESTION_BANK: Question[] = [
  // React Questions (30 questions)
  {
    id: 'react_1',
    techStack: 'react',
    question: 'What is JSX in React?',
    options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JavaScript Executable'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'react_2',
    techStack: 'react',
    question: 'Which hook is used to manage state in functional components?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'hooks'
  },
  {
    id: 'react_3',
    techStack: 'react',
    question: 'What is the virtual DOM?',
    options: ['A copy of the real DOM', 'A JavaScript representation of the real DOM', 'A database', 'A server'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'react_4',
    techStack: 'react',
    question: 'What does useEffect hook do?',
    options: ['Manages state', 'Handles side effects', 'Creates components', 'Manages props'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'hooks'
  },
  {
    id: 'react_5',
    techStack: 'react',
    question: 'What is prop drilling?',
    options: ['Creating holes in props', 'Passing props through multiple levels', 'Deleting props', 'Updating props'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'react_6',
    techStack: 'react',
    question: 'What is React.memo used for?',
    options: ['Memory management', 'Memoizing components', 'Creating memos', 'State management'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'optimization'
  },
  {
    id: 'react_7',
    techStack: 'react',
    question: 'What is the purpose of React.Fragment?',
    options: ['To group elements without extra DOM node', 'To create fragments', 'To break components', 'To handle errors'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'basics'
  },
  {
    id: 'react_8',
    techStack: 'react',
    question: 'What is the difference between state and props?',
    options: ['No difference', 'State is mutable, props are immutable', 'Props are mutable, state is immutable', 'Both are mutable'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'react_9',
    techStack: 'react',
    question: 'What is useCallback hook used for?',
    options: ['Managing state', 'Memoizing functions', 'Making API calls', 'Handling events'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'optimization'
  },
  {
    id: 'react_10',
    techStack: 'react',
    question: 'What is React Suspense?',
    options: ['Error boundary', 'Loading state handler', 'State management', 'Routing library'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'advanced'
  },

  // JavaScript Questions (30 questions)
  {
    id: 'js_1',
    techStack: 'javascript',
    question: 'What is the difference between let and var?',
    options: ['No difference', 'let has block scope, var has function scope', 'var has block scope, let has function scope', 'Both have global scope'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'variables'
  },
  {
    id: 'js_2',
    techStack: 'javascript',
    question: 'What is a closure in JavaScript?',
    options: ['A function that returns another function', 'A function with access to outer scope', 'A closed function', 'A private function'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'functions'
  },
  {
    id: 'js_3',
    techStack: 'javascript',
    question: 'What does "this" keyword refer to?',
    options: ['Current object', 'Global object', 'Function object', 'Depends on context'],
    correctAnswer: 3,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'js_4',
    techStack: 'javascript',
    question: 'What is event bubbling?',
    options: ['Events going up the DOM tree', 'Events going down the DOM tree', 'Events disappearing', 'Events multiplying'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'events'
  },
  {
    id: 'js_5',
    techStack: 'javascript',
    question: 'What is the difference between == and ===?',
    options: ['No difference', '== checks type and value, === checks only value', '=== checks type and value, == checks only value', '=== is faster'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'operators'
  },
  {
    id: 'js_6',
    techStack: 'javascript',
    question: 'What is hoisting?',
    options: ['Moving variables to top', 'JavaScript behavior of moving declarations to top', 'Deleting variables', 'Creating variables'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'js_7',
    techStack: 'javascript',
    question: 'What is a Promise?',
    options: ['A guarantee', 'An object representing eventual completion of async operation', 'A function', 'A variable'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'async'
  },
  {
    id: 'js_8',
    techStack: 'javascript',
    question: 'What is async/await?',
    options: ['Synchronous code', 'Syntactic sugar for Promises', 'A new data type', 'A loop'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'async'
  },
  {
    id: 'js_9',
    techStack: 'javascript',
    question: 'What is the spread operator?',
    options: ['...', 'An operator to spread elements', 'Both A and B', 'None of the above'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'operators'
  },
  {
    id: 'js_10',
    techStack: 'javascript',
    question: 'What is destructuring?',
    options: ['Breaking objects/arrays', 'Extracting values from objects/arrays', 'Deleting properties', 'Creating objects'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'syntax'
  },

  // Node.js Questions (30 questions)
  {
    id: 'node_1',
    techStack: 'nodejs',
    question: 'What is Node.js?',
    options: ['A JavaScript library', 'A JavaScript runtime', 'A database', 'A web server'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'node_2',
    techStack: 'nodejs',
    question: 'What is npm?',
    options: ['Node Package Manager', 'Node Project Manager', 'New Package Manager', 'Node Program Manager'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'node_3',
    techStack: 'nodejs',
    question: 'What is the event loop?',
    options: ['A loop for events', 'JavaScript runtime execution model', 'A database loop', 'A server loop'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'node_4',
    techStack: 'nodejs',
    question: 'What is middleware in Express?',
    options: ['Functions that execute during request-response cycle', 'Database functions', 'Client functions', 'Browser functions'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'express'
  },
  {
    id: 'node_5',
    techStack: 'nodejs',
    question: 'What is callback hell?',
    options: ['Hell for callbacks', 'Nested callback functions creating pyramid', 'Error in callbacks', 'Missing callbacks'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'async'
  },
  {
    id: 'node_6',
    techStack: 'nodejs',
    question: 'What is require() in Node.js?',
    options: ['To require modules', 'To import modules', 'Both A and B', 'To delete modules'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'modules'
  },
  {
    id: 'node_7',
    techStack: 'nodejs',
    question: 'What is process.env?',
    options: ['Environment variables', 'Process environment', 'System variables', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'intermediate',
    category: 'environment'
  },
  {
    id: 'node_8',
    techStack: 'nodejs',
    question: 'What is clustering in Node.js?',
    options: ['Grouping nodes', 'Creating multiple worker processes', 'Database clustering', 'Server clustering'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'performance'
  },
  {
    id: 'node_9',
    techStack: 'nodejs',
    question: 'What is stream in Node.js?',
    options: ['Water stream', 'Data stream for reading/writing', 'Video stream', 'Audio stream'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'streams'
  },
  {
    id: 'node_10',
    techStack: 'nodejs',
    question: 'What is buffer in Node.js?',
    options: ['A temporary storage', 'A class to handle binary data', 'A delay mechanism', 'A cache'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'data'
  },

  // Express.js Questions (15 questions)
  {
    id: 'express_1',
    techStack: 'expressjs',
    question: 'What is Express.js?',
    options: ['A Node.js web framework', 'A database', 'A frontend library', 'A testing tool'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'express_2',
    techStack: 'expressjs',
    question: 'What is middleware in Express.js?',
    options: ['Functions that execute during request-response cycle', 'Database functions', 'Client functions', 'Browser functions'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'middleware'
  },
  {
    id: 'express_3',
    techStack: 'expressjs',
    question: 'How do you create a route in Express.js?',
    options: ['app.get("/path", handler)', 'app.route("/path")', 'app.create("/path")', 'app.path("/")'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'routing'
  },
  {
    id: 'express_4',
    techStack: 'expressjs',
    question: 'What is the purpose of app.use() in Express?',
    options: ['To mount middleware', 'To start server', 'To create routes', 'To connect database'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'middleware'
  },
  {
    id: 'express_5',
    techStack: 'expressjs',
    question: 'How do you handle POST requests in Express?',
    options: ['app.post("/path", handler)', 'app.handle("/path")', 'app.receive("/path")', 'app.input("/path")'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'routing'
  },
  {
    id: 'express_6',
    techStack: 'expressjs',
    question: 'What is req.params in Express?',
    options: ['Route parameters', 'Query parameters', 'Request body', 'Request headers'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'routing'
  },
  {
    id: 'express_7',
    techStack: 'expressjs',
    question: 'How do you serve static files in Express?',
    options: ['express.static()', 'app.static()', 'serve.static()', 'static.serve()'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'static'
  },
  {
    id: 'express_8',
    techStack: 'expressjs',
    question: 'What is res.json() used for?',
    options: ['Send JSON response', 'Parse JSON', 'Create JSON', 'Validate JSON'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'response'
  },
  {
    id: 'express_9',
    techStack: 'expressjs',
    question: 'How do you handle errors in Express middleware?',
    options: ['Call next(error)', 'throw error', 'res.error()', 'app.error()'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'error-handling'
  },
  {
    id: 'express_10',
    techStack: 'expressjs',
    question: 'What is app.listen() used for?',
    options: ['Start the server on a port', 'Listen for events', 'Connect to database', 'Handle requests'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'server'
  },
  {
    id: 'express_11',
    techStack: 'expressjs',
    question: 'How do you access request body in Express?',
    options: ['req.body', 'req.data', 'req.payload', 'req.content'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'request'
  },
  {
    id: 'express_12',
    techStack: 'expressjs',
    question: 'What is the purpose of body-parser in Express?',
    options: ['Parse request bodies', 'Parse URLs', 'Parse headers', 'Parse cookies'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'middleware'
  },
  {
    id: 'express_13',
    techStack: 'expressjs',
    question: 'How do you set up CORS in Express?',
    options: ['Use cors middleware', 'Set headers manually', 'Configure server', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'intermediate',
    category: 'security'
  },
  {
    id: 'express_14',
    techStack: 'expressjs',
    question: 'What is Express Router?',
    options: ['Modular route handlers', 'Database router', 'File router', 'Network router'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'routing'
  },
  {
    id: 'express_15',
    techStack: 'expressjs',
    question: 'How do you handle file uploads in Express?',
    options: ['Use multer middleware', 'Use built-in methods', 'Use fs module', 'Use http module'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'file-handling'
  },

  // HTML Questions (15 questions)
  {
    id: 'html_1',
    techStack: 'html',
    question: 'What does HTML stand for?',
    options: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'HyperText Machine Language'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'html_2',
    techStack: 'html',
    question: 'Which HTML tag is used for the largest heading?',
    options: ['<h6>', '<h1>', '<header>', '<heading>'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'elements'
  },
  {
    id: 'html_3',
    techStack: 'html',
    question: 'What is the correct HTML tag for a line break?',
    options: ['<break>', '<br>', '<lb>', '<newline>'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'elements'
  },
  {
    id: 'html_4',
    techStack: 'html',
    question: 'Which attribute specifies the URL of the page the link goes to?',
    options: ['src', 'href', 'link', 'url'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'attributes'
  },
  {
    id: 'html_5',
    techStack: 'html',
    question: 'What is the purpose of the <!DOCTYPE html> declaration?',
    options: ['To specify HTML version', 'To define document type', 'To enable HTML5 features', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'intermediate',
    category: 'document'
  },
  {
    id: 'html_6',
    techStack: 'html',
    question: 'Which HTML element is used for creating an unordered list?',
    options: ['<ol>', '<ul>', '<list>', '<li>'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'lists'
  },
  {
    id: 'html_7',
    techStack: 'html',
    question: 'What is the correct way to create a checkbox in HTML?',
    options: ['<input type="check">', '<checkbox>', '<input type="checkbox">', '<check>'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'forms'
  },
  {
    id: 'html_8',
    techStack: 'html',
    question: 'Which attribute is used to provide alternative text for an image?',
    options: ['title', 'alt', 'src', 'description'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'accessibility'
  },
  {
    id: 'html_9',
    techStack: 'html',
    question: 'What is the semantic HTML element for navigation?',
    options: ['<navigation>', '<nav>', '<menu>', '<links>'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'semantic'
  },
  {
    id: 'html_10',
    techStack: 'html',
    question: 'Which HTML5 input type is used for email addresses?',
    options: ['<input type="text">', '<input type="email">', '<input type="mail">', '<input type="address">'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'html5'
  },
  {
    id: 'html_11',
    techStack: 'html',
    question: 'What is the purpose of the <meta> tag?',
    options: ['To provide metadata about the HTML document', 'To create meta links', 'To define meta classes', 'To add meta styles'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'metadata'
  },
  {
    id: 'html_12',
    techStack: 'html',
    question: 'Which attribute makes an input field required?',
    options: ['mandatory', 'required', 'validate', 'necessary'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'validation'
  },
  {
    id: 'html_13',
    techStack: 'html',
    question: 'What is the correct way to include CSS in HTML?',
    options: ['<style src="style.css">', '<css href="style.css">', '<link rel="stylesheet" href="style.css">', '<include css="style.css">'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'linking'
  },
  {
    id: 'html_14',
    techStack: 'html',
    question: 'Which HTML element represents a container for flow content?',
    options: ['<div>', '<span>', '<container>', '<section>'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'elements'
  },
  {
    id: 'html_15',
    techStack: 'html',
    question: 'What is the purpose of the <canvas> element?',
    options: ['To display images', 'To create drawings and graphics', 'To embed videos', 'To create forms'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'html5'
  },

  // Vue.js Questions (15 questions)
  {
    id: 'vue_1',
    techStack: 'vue',
    question: 'What is Vue.js?',
    options: ['A JavaScript framework', 'A CSS framework', 'A database', 'A server'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'vue_2',
    techStack: 'vue',
    question: 'Which directive is used for two-way data binding in Vue.js?',
    options: ['v-bind', 'v-model', 'v-data', 'v-sync'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'directives'
  },
  {
    id: 'vue_3',
    techStack: 'vue',
    question: 'What is the Vue.js lifecycle hook called when component is mounted?',
    options: ['created', 'mounted', 'beforeMount', 'updated'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'lifecycle'
  },
  {
    id: 'vue_4',
    techStack: 'vue',
    question: 'How do you define a computed property in Vue.js?',
    options: ['In methods', 'In computed', 'In data', 'In props'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'computed'
  },
  {
    id: 'vue_5',
    techStack: 'vue',
    question: 'What is Vuex?',
    options: ['Vue router', 'State management library', 'Testing framework', 'Build tool'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'vuex'
  },
  {
    id: 'vue_6',
    techStack: 'vue',
    question: 'Which directive is used for conditional rendering?',
    options: ['v-show', 'v-if', 'Both A and B', 'v-condition'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'directives'
  },
  {
    id: 'vue_7',
    techStack: 'vue',
    question: 'What is a Vue component?',
    options: ['Reusable Vue instance', 'CSS class', 'HTML element', 'JavaScript function'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'components'
  },
  {
    id: 'vue_8',
    techStack: 'vue',
    question: 'How do you pass data to child components?',
    options: ['Through props', 'Through data', 'Through methods', 'Through computed'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'props'
  },
  {
    id: 'vue_9',
    techStack: 'vue',
    question: 'What is the Vue CLI?',
    options: ['Command Line Interface for Vue projects', 'Vue Component Library', 'Vue Configuration Language', 'Vue Code Inspector'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'tools'
  },
  {
    id: 'vue_10',
    techStack: 'vue',
    question: 'Which hook is called before component destruction?',
    options: ['beforeDestroy', 'destroyed', 'beforeUnmount', 'unmounted'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'lifecycle'
  },
  {
    id: 'vue_11',
    techStack: 'vue',
    question: 'What is the correct way to handle events in Vue?',
    options: ['v-on:click', '@click', 'Both A and B', 'onclick'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'events'
  },
  {
    id: 'vue_12',
    techStack: 'vue',
    question: 'What are slots in Vue.js?',
    options: ['Content distribution outlets', 'Data storage', 'Event handlers', 'Routing paths'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'slots'
  },
  {
    id: 'vue_13',
    techStack: 'vue',
    question: 'What is Vue Router?',
    options: ['Official routing library for Vue.js', 'Vue component', 'State management', 'Build tool'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'routing'
  },
  {
    id: 'vue_14',
    techStack: 'vue',
    question: 'How do you create a reactive reference in Vue 3?',
    options: ['ref()', 'reactive()', 'Both A and B', 'computed()'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'composition-api'
  },
  {
    id: 'vue_15',
    techStack: 'vue',
    question: 'What is the difference between v-show and v-if?',
    options: ['No difference', 'v-if removes element from DOM, v-show uses CSS', 'v-show removes element from DOM, v-if uses CSS', 'Both remove elements'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'directives'
  },

  // Python Questions (30 questions)
  {
    id: 'python_1',
    techStack: 'python',
    question: 'What is Python?',
    options: ['A snake', 'A high-level programming language', 'A database', 'A web server'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'python_2',
    techStack: 'python',
    question: 'What is PEP 8?',
    options: ['Python Enhancement Proposal 8', 'Python style guide', 'Both A and B', 'Python version'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'standards'
  },
  {
    id: 'python_3',
    techStack: 'python',
    question: 'What is the difference between list and tuple?',
    options: ['List is mutable, tuple is immutable', 'No difference', 'Tuple is mutable, list is immutable', 'Both are immutable'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'data_types'
  },
  {
    id: 'python_4',
    techStack: 'python',
    question: 'What is a decorator?',
    options: ['A design pattern', 'A function that modifies another function', 'A class', 'A module'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'functions'
  },
  {
    id: 'python_5',
    techStack: 'python',
    question: 'What is list comprehension?',
    options: ['Understanding lists', 'Concise way to create lists', 'List methods', 'List properties'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'syntax'
  },
  {
    id: 'python_6',
    techStack: 'python',
    question: 'What is __init__ method?',
    options: ['Initialize method', 'Constructor method', 'Both A and B', 'Destructor method'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'oop'
  },
  {
    id: 'python_7',
    techStack: 'python',
    question: 'What is inheritance?',
    options: ['Getting money', 'A class inheriting from another class', 'A function', 'A variable'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'python_8',
    techStack: 'python',
    question: 'What is lambda function?',
    options: ['Anonymous function', 'Named function', 'Class method', 'Module function'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'functions'
  },
  {
    id: 'python_9',
    techStack: 'python',
    question: 'What is pip?',
    options: ['Python installer package', 'Package installer for Python', 'Python interpreter', 'Python IDE'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'tools'
  },
  {
    id: 'python_10',
    techStack: 'python',
    question: 'What is virtual environment?',
    options: ['Virtual reality', 'Isolated Python environment', 'Virtual machine', 'Virtual server'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'environment'
  },

  // TypeScript Questions (20 questions)
  {
    id: 'ts_1',
    techStack: 'typescript',
    question: 'What is TypeScript?',
    options: ['A superset of JavaScript', 'A new language', 'A framework', 'A library'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'ts_2',
    techStack: 'typescript',
    question: 'What is type annotation?',
    options: ['Adding types to variables', 'Adding comments', 'Adding notes', 'Adding documentation'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'types'
  },
  {
    id: 'ts_3',
    techStack: 'typescript',
    question: 'What is an interface?',
    options: ['A contract for objects', 'A class', 'A function', 'A variable'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'interfaces'
  },
  {
    id: 'ts_4',
    techStack: 'typescript',
    question: 'What is union type?',
    options: ['Type A | Type B', 'Type A & Type B', 'Type A + Type B', 'Type A - Type B'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'types'
  },
  {
    id: 'ts_5',
    techStack: 'typescript',
    question: 'What is generic?',
    options: ['Reusable type', 'Specific type', 'No type', 'Any type'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'generics'
  },
  {
    id: 'ts_6',
    techStack: 'typescript',
    question: 'What is the purpose of the "any" type?',
    options: ['Disables type checking', 'Enables strict typing', 'Creates unions', 'Defines objects'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'types'
  },
  {
    id: 'ts_7',
    techStack: 'typescript',
    question: 'What is an enum in TypeScript?',
    options: ['Named constants', 'Function type', 'Object type', 'Array type'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'enums'
  },
  {
    id: 'ts_8',
    techStack: 'typescript',
    question: 'What is tuple in TypeScript?',
    options: ['Array with fixed number and types', 'Dynamic array', 'Object array', 'String array'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'types'
  },
  {
    id: 'ts_9',
    techStack: 'typescript',
    question: 'What is the "never" type?',
    options: ['Type that never occurs', 'Empty type', 'Null type', 'Undefined type'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'types'
  },
  {
    id: 'ts_10',
    techStack: 'typescript',
    question: 'What is type assertion?',
    options: ['Telling compiler about variable type', 'Type checking', 'Type creation', 'Type deletion'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'assertions'
  },
  {
    id: 'ts_11',
    techStack: 'typescript',
    question: 'What is intersection type?',
    options: ['Type A & Type B', 'Type A | Type B', 'Type A + Type B', 'Type A - Type B'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'types'
  },
  {
    id: 'ts_12',
    techStack: 'typescript',
    question: 'What is namespace in TypeScript?',
    options: ['Way to organize code', 'Data type', 'Function type', 'Variable type'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'namespaces'
  },

  // Vue.js Questions (20 questions)
  {
    id: 'vue_1',
    techStack: 'vuejs',
    question: 'What is Vue.js?',
    options: ['A progressive JavaScript framework', 'A library', 'A database', 'A server'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'vue_2',
    techStack: 'vuejs',
    question: 'What is v-model?',
    options: ['Two-way data binding', 'One-way binding', 'No binding', 'Event binding'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'directives'
  },
  {
    id: 'vue_3',
    techStack: 'vuejs',
    question: 'What is Vuex?',
    options: ['State management pattern', 'Component library', 'Router', 'Testing library'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'state'
  },
  {
    id: 'vue_4',
    techStack: 'vuejs',
    question: 'What is computed property?',
    options: ['Cached calculated property', 'Method', 'Data property', 'Event'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'computed'
  },
  {
    id: 'vue_5',
    techStack: 'vuejs',
    question: 'What is Vue Router?',
    options: ['Official router for Vue.js', 'Third-party router', 'Component', 'Plugin'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'routing'
  },

  // Angular Questions (20 questions)
  {
    id: 'angular_1',
    techStack: 'angular',
    question: 'What is Angular?',
    options: ['A TypeScript-based framework', 'JavaScript framework', 'Library', 'Database'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'angular_2',
    techStack: 'angular',
    question: 'What is component?',
    options: ['Building block of Angular app', 'Service', 'Module', 'Directive'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'components'
  },
  {
    id: 'angular_3',
    techStack: 'angular',
    question: 'What is dependency injection?',
    options: ['Design pattern', 'Providing dependencies', 'Both A and B', 'Class method'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'di'
  },
  {
    id: 'angular_4',
    techStack: 'angular',
    question: 'What is directive?',
    options: ['Class that adds behavior to elements', 'Component', 'Service', 'Module'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'directives'
  },
  {
    id: 'angular_5',
    techStack: 'angular',
    question: 'What is service?',
    options: ['Class with specific purpose', 'Component', 'Directive', 'Module'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'services'
  },

  // Docker Questions (15 questions)
  {
    id: 'docker_1',
    techStack: 'docker',
    question: 'What is Docker?',
    options: ['Containerization platform', 'Virtual machine', 'Database', 'Web server'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'docker_2',
    techStack: 'docker',
    question: 'What is Dockerfile?',
    options: ['Text file with instructions', 'Image file', 'Container file', 'Config file'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'dockerfile'
  },
  {
    id: 'docker_3',
    techStack: 'docker',
    question: 'What is Docker image?',
    options: ['Template for containers', 'Running container', 'Docker file', 'Virtual machine'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'images'
  },
  {
    id: 'docker_4',
    techStack: 'docker',
    question: 'What is Docker container?',
    options: ['Running instance of image', 'Docker file', 'Virtual machine', 'Database'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'containers'
  },
  {
    id: 'docker_5',
    techStack: 'docker',
    question: 'What is docker-compose?',
    options: ['Tool for multi-container apps', 'Single container tool', 'Image builder', 'Container runner'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'compose'
  },

  // MongoDB Questions (15 questions)
  {
    id: 'mongo_1',
    techStack: 'mongodb',
    question: 'What is MongoDB?',
    options: ['NoSQL database', 'SQL database', 'Web server', 'Framework'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'mongo_2',
    techStack: 'mongodb',
    question: 'What is document in MongoDB?',
    options: ['BSON object', 'JSON object', 'Both A and B', 'Text file'],
    correctAnswer: 2,
    difficulty: 'beginner',
    category: 'documents'
  },
  {
    id: 'mongo_3',
    techStack: 'mongodb',
    question: 'What is collection?',
    options: ['Group of documents', 'Single document', 'Database', 'Table'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'collections'
  },
  {
    id: 'mongo_4',
    techStack: 'mongodb',
    question: 'What is aggregation?',
    options: ['Data processing pipeline', 'Data insertion', 'Data deletion', 'Data backup'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'aggregation'
  },
  {
    id: 'mongo_5',
    techStack: 'mongodb',
    question: 'What is indexing?',
    options: ['Improving query performance', 'Storing data', 'Deleting data', 'Backing up data'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'indexing'
  },

  // PostgreSQL Questions (15 questions)
  {
    id: 'postgres_1',
    techStack: 'postgresql',
    question: 'What is PostgreSQL?',
    options: ['Relational database', 'NoSQL database', 'Web server', 'Framework'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'postgres_2',
    techStack: 'postgresql',
    question: 'What is ACID?',
    options: ['Database properties', 'Query language', 'Data type', 'Function'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'concepts'
  },
  {
    id: 'postgres_3',
    techStack: 'postgresql',
    question: 'What is foreign key?',
    options: ['Reference to primary key', 'Unique key', 'Index key', 'Composite key'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'constraints'
  },
  {
    id: 'postgres_4',
    techStack: 'postgresql',
    question: 'What is JOIN?',
    options: ['Combining rows from tables', 'Adding rows', 'Deleting rows', 'Updating rows'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'queries'
  },
  {
    id: 'postgres_5',
    techStack: 'postgresql',
    question: 'What is transaction?',
    options: ['Unit of work', 'Single query', 'Database connection', 'Table operation'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'transactions'
  },

  // AWS Questions (15 questions)
  {
    id: 'aws_1',
    techStack: 'aws',
    question: 'What is AWS?',
    options: ['Cloud computing platform', 'Database', 'Web server', 'Framework'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'aws_2',
    techStack: 'aws',
    question: 'What is EC2?',
    options: ['Elastic Compute Cloud', 'Elastic Container Cloud', 'Easy Compute Cloud', 'Elastic Cache Cloud'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'compute'
  },
  {
    id: 'aws_3',
    techStack: 'aws',
    question: 'What is S3?',
    options: ['Simple Storage Service', 'Simple Server Service', 'Secure Storage Service', 'Standard Storage Service'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'storage'
  },
  {
    id: 'aws_4',
    techStack: 'aws',
    question: 'What is Lambda?',
    options: ['Serverless compute service', 'Database service', 'Storage service', 'Networking service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'serverless'
  },
  {
    id: 'aws_5',
    techStack: 'aws',
    question: 'What is RDS?',
    options: ['Relational Database Service', 'Redis Database Service', 'Remote Database Service', 'Rapid Database Service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'database'
  },

  // Java Questions (15 questions)
  {
    id: 'java_1',
    techStack: 'java',
    question: 'What is Java?',
    options: ['Object-oriented programming language', 'Scripting language', 'Database', 'Web server'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'java_2',
    techStack: 'java',
    question: 'What does JVM stand for?',
    options: ['Java Virtual Machine', 'Java Variable Manager', 'Java Version Manager', 'Java Visual Machine'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'java_3',
    techStack: 'java',
    question: 'What is the difference between JDK and JRE?',
    options: ['No difference', 'JDK includes development tools, JRE only runtime', 'JRE includes development tools, JDK only runtime', 'Both are the same'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'environment'
  },
  {
    id: 'java_4',
    techStack: 'java',
    question: 'What is inheritance in Java?',
    options: ['Getting money', 'A class inheriting properties from another class', 'A method', 'A variable'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'java_5',
    techStack: 'java',
    question: 'What is polymorphism?',
    options: ['Many forms', 'One object taking many forms', 'Multiple inheritance', 'Method overloading only'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'java_6',
    techStack: 'java',
    question: 'What is encapsulation?',
    options: ['Hiding implementation details', 'Creating objects', 'Inheriting classes', 'Overriding methods'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'java_7',
    techStack: 'java',
    question: 'What is an abstract class?',
    options: ['A class that cannot be instantiated', 'A concrete class', 'An interface', 'A final class'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'java_8',
    techStack: 'java',
    question: 'What is the difference between interface and abstract class?',
    options: ['No difference', 'Interface can have concrete methods, abstract class cannot', 'Abstract class can have concrete methods, interface cannot (before Java 8)', 'Both are exactly same'],
    correctAnswer: 2,
    difficulty: 'advanced',
    category: 'oop'
  },
  {
    id: 'java_9',
    techStack: 'java',
    question: 'What is garbage collection?',
    options: ['Manual memory management', 'Automatic memory management', 'Deleting files', 'Cleaning code'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'memory'
  },
  {
    id: 'java_10',
    techStack: 'java',
    question: 'What is a static method?',
    options: ['Method that belongs to class, not instance', 'Method that cannot be overridden', 'Method that is final', 'Method that is private'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'methods'
  },
  {
    id: 'java_11',
    techStack: 'java',
    question: 'What is exception handling?',
    options: ['Ignoring errors', 'Handling runtime errors gracefully', 'Preventing compilation', 'Debugging code'],
    correctAnswer: 1,
    difficulty: 'intermediate',
    category: 'exceptions'
  },
  {
    id: 'java_12',
    techStack: 'java',
    question: 'What is the difference between checked and unchecked exceptions?',
    options: ['No difference', 'Checked must be handled at compile time, unchecked at runtime', 'Unchecked must be handled at compile time, checked at runtime', 'Both are same'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'exceptions'
  },
  {
    id: 'java_13',
    techStack: 'java',
    question: 'What is multithreading?',
    options: ['Single thread execution', 'Multiple threads executing concurrently', 'Sequential execution', 'Parallel processing only'],
    correctAnswer: 1,
    difficulty: 'advanced',
    category: 'threading'
  },
  {
    id: 'java_14',
    techStack: 'java',
    question: 'What is ArrayList?',
    options: ['Dynamic array implementation', 'Fixed size array', 'Linked list', 'Hash table'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'collections'
  },
  {
    id: 'java_15',
    techStack: 'java',
    question: 'What is HashMap?',
    options: ['Key-value pair storage', 'Array implementation', 'Linked list', 'Tree structure'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'collections'
  },

  // Go Questions (10 questions)
  {
    id: 'go_1',
    techStack: 'go',
    question: 'What is Go?',
    options: ['Programming language developed by Google', 'Database', 'Web framework', 'Operating system'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'go_2',
    techStack: 'go',
    question: 'What is a goroutine?',
    options: ['Lightweight thread', 'Function', 'Package', 'Variable'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'concurrency'
  },
  {
    id: 'go_3',
    techStack: 'go',
    question: 'What is a channel in Go?',
    options: ['Communication mechanism between goroutines', 'Database connection', 'File stream', 'Network protocol'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'concurrency'
  },

  // Angular Questions (15 questions)
  {
    id: 'angular_1',
    techStack: 'angular',
    question: 'What is Angular?',
    options: ['JavaScript library', 'TypeScript-based web framework', 'CSS framework', 'Database'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'angular_2',
    techStack: 'angular',
    question: 'What is a component in Angular?',
    options: ['Basic building block of Angular apps', 'CSS class', 'HTML element', 'JavaScript function'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'components'
  },
  {
    id: 'angular_3',
    techStack: 'angular',
    question: 'What is dependency injection?',
    options: ['Design pattern for providing dependencies', 'Code injection attack', 'Database connection', 'Error handling'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'di'
  },
  {
    id: 'angular_4',
    techStack: 'angular',
    question: 'What is Angular CLI?',
    options: ['Command Line Interface for Angular', 'Angular Component Library', 'Angular Configuration Language', 'Angular Code Inspector'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'tools'
  },
  {
    id: 'angular_5',
    techStack: 'angular',
    question: 'What are Angular directives?',
    options: ['Classes that add behavior to elements', 'CSS styles', 'HTML tags', 'JavaScript functions'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'directives'
  },
  {
    id: 'angular_6',
    techStack: 'angular',
    question: 'What is two-way data binding?',
    options: ['[(ngModel)]', 'Data flows both ways between component and template', 'Both A and B', 'One-way binding'],
    correctAnswer: 2,
    difficulty: 'intermediate',
    category: 'binding'
  },
  {
    id: 'angular_7',
    techStack: 'angular',
    question: 'What are Angular services?',
    options: ['Classes for sharing data and functionality', 'Web services', 'Server endpoints', 'Database connections'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'services'
  },
  {
    id: 'angular_8',
    techStack: 'angular',
    question: 'What is Angular Router?',
    options: ['Navigation library for Angular apps', 'Network router', 'File router', 'Database router'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'routing'
  },
  {
    id: 'angular_9',
    techStack: 'angular',
    question: 'What are Angular Guards?',
    options: ['Route protection mechanisms', 'Security guards', 'Component guards', 'Data guards'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'guards'
  },
  {
    id: 'angular_10',
    techStack: 'angular',
    question: 'What is Angular Material?',
    options: ['UI component library', 'Build tool', 'Testing framework', 'State management'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'material'
  },
  {
    id: 'angular_11',
    techStack: 'angular',
    question: 'What are Angular pipes?',
    options: ['Transform data in templates', 'Data pipelines', 'HTTP requests', 'Event handlers'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'pipes'
  },
  {
    id: 'angular_12',
    techStack: 'angular',
    question: 'What is NgRx?',
    options: ['State management library for Angular', 'HTTP client', 'Router library', 'Testing tool'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'ngrx'
  },
  {
    id: 'angular_13',
    techStack: 'angular',
    question: 'What are Angular lifecycle hooks?',
    options: ['Methods called at specific component lifecycle points', 'HTTP hooks', 'Event hooks', 'Router hooks'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'lifecycle'
  },
  {
    id: 'angular_14',
    techStack: 'angular',
    question: 'What is Angular Universal?',
    options: ['Server-side rendering solution', 'Testing framework', 'Build tool', 'Animation library'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'ssr'
  },
  {
    id: 'angular_15',
    techStack: 'angular',
    question: 'What is the purpose of Angular modules?',
    options: ['Organize and bootstrap applications', 'Store data', 'Handle HTTP requests', 'Manage animations'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'modules'
  },

  // Go Questions (15 questions)
  {
    id: 'go_1',
    techStack: 'go',
    question: 'What is Go (Golang)?',
    options: ['Open source programming language by Google', 'JavaScript framework', 'Database', 'Web server'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'go_2',
    techStack: 'go',
    question: 'What are goroutines?',
    options: ['Lightweight threads managed by Go runtime', 'Go libraries', 'Go modules', 'Go packages'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'concurrency'
  },
  {
    id: 'go_3',
    techStack: 'go',
    question: 'What are channels in Go?',
    options: ['Communication mechanism between goroutines', 'Data structures', 'Functions', 'Variables'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'concurrency'
  },
  {
    id: 'go_4',
    techStack: 'go',
    question: 'How does Go handle error handling?',
    options: ['Explicit error values', 'Try-catch blocks', 'Exceptions', 'Error objects'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'errors'
  },
  {
    id: 'go_5',
    techStack: 'go',
    question: 'What is a Go interface?',
    options: ['Set of method signatures', 'Class definition', 'Struct type', 'Package declaration'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'interfaces'
  },
  {
    id: 'go_6',
    techStack: 'go',
    question: 'What is the zero value in Go?',
    options: ['Default value for uninitialized variables', 'Zero number', 'Null pointer', 'Empty string'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'go_7',
    techStack: 'go',
    question: 'What is Go modules?',
    options: ['Dependency management system', 'Code modules', 'Package imports', 'Build system'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'modules'
  },
  {
    id: 'go_8',
    techStack: 'go',
    question: 'What is the difference between := and = in Go?',
    options: [':= declares and assigns, = only assigns', ':= assigns, = declares', 'No difference', 'Both declare'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'syntax'
  },
  {
    id: 'go_9',
    techStack: 'go',
    question: 'What is defer in Go?',
    options: ['Delays function execution until surrounding function returns', 'Async function', 'Error handler', 'Loop construct'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'defer'
  },
  {
    id: 'go_10',
    techStack: 'go',
    question: 'How does Go handle memory management?',
    options: ['Garbage collection', 'Manual management', 'Reference counting', 'Stack only'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'memory'
  },
  {
    id: 'go_11',
    techStack: 'go',
    question: 'What is a Go struct?',
    options: ['Custom data type grouping fields', 'Function type', 'Interface type', 'Channel type'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'structs'
  },
  {
    id: 'go_12',
    techStack: 'go',
    question: 'What is the select statement in Go?',
    options: ['Choose between multiple channel operations', 'Database query', 'Conditional statement', 'Loop statement'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'select'
  },
  {
    id: 'go_13',
    techStack: 'go',
    question: 'What are Go slices?',
    options: ['Dynamic arrays', 'Fixed arrays', 'Hash maps', 'Linked lists'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'slices'
  },
  {
    id: 'go_14',
    techStack: 'go',
    question: 'What is the go keyword used for?',
    options: ['Start a goroutine', 'Import packages', 'Declare variables', 'Define functions'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'concurrency'
  },
  {
    id: 'go_15',
    techStack: 'go',
    question: 'What is Go\'s approach to object-oriented programming?',
    options: ['Composition over inheritance', 'Classical inheritance', 'Multiple inheritance', 'No OOP support'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'oop'
  },

  // PHP Questions (15 questions)
  {
    id: 'php_1',
    techStack: 'php',
    question: 'What does PHP stand for?',
    options: ['PHP: Hypertext Preprocessor', 'Personal Home Page', 'Private Home Page', 'Public Hypertext Processor'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'php_2',
    techStack: 'php',
    question: 'How do you start a PHP script?',
    options: ['<?php', '<php>', '<script php>', '<?php start?>'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'syntax'
  },
  {
    id: 'php_3',
    techStack: 'php',
    question: 'What is the difference between include and require?',
    options: ['require stops execution on failure, include continues with warning', 'include stops execution, require continues', 'No difference', 'Both stop execution'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'includes'
  },
  {
    id: 'php_4',
    techStack: 'php',
    question: 'What is Composer in PHP?',
    options: ['Dependency management tool', 'Code editor', 'Web server', 'Database tool'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'tools'
  },
  {
    id: 'php_5',
    techStack: 'php',
    question: 'What are PHP superglobals?',
    options: ['Built-in variables available in all scopes', 'Global functions', 'Global constants', 'Global classes'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'superglobals'
  },
  {
    id: 'php_6',
    techStack: 'php',
    question: 'What is the difference between == and === in PHP?',
    options: ['=== checks type and value, == only checks value', '== checks type and value, === only checks value', 'No difference', 'Both check type'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'operators'
  },
  {
    id: 'php_7',
    techStack: 'php',
    question: 'What are PHP namespaces?',
    options: ['Way to encapsulate and avoid naming conflicts', 'Database schemas', 'File directories', 'Class inheritance'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'namespaces'
  },
  {
    id: 'php_8',
    techStack: 'php',
    question: 'What is PDO in PHP?',
    options: ['PHP Data Objects for database access', 'PHP Development Object', 'PHP Display Output', 'PHP Data Operations'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'database'
  },
  {
    id: 'php_9',
    techStack: 'php',
    question: 'What is the purpose of session_start()?',
    options: ['Initialize PHP session', 'Start web server', 'Begin transaction', 'Start application'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'sessions'
  },
  {
    id: 'php_10',
    techStack: 'php',
    question: 'What is Laravel?',
    options: ['PHP web framework', 'PHP library', 'PHP extension', 'PHP database'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'frameworks'
  },
  {
    id: 'php_11',
    techStack: 'php',
    question: 'How do you prevent SQL injection in PHP?',
    options: ['Use prepared statements', 'Escape special characters', 'Validate input', 'All of the above'],
    correctAnswer: 3,
    difficulty: 'advanced',
    category: 'security'
  },
  {
    id: 'php_12',
    techStack: 'php',
    question: 'What is autoloading in PHP?',
    options: ['Automatic loading of classes when needed', 'Automatic page loading', 'Automatic database loading', 'Automatic server loading'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'autoloading'
  },
  {
    id: 'php_13',
    techStack: 'php',
    question: 'What are PHP traits?',
    options: ['Mechanism for code reuse', 'Class properties', 'Function parameters', 'Variable types'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'traits'
  },
  {
    id: 'php_14',
    techStack: 'php',
    question: 'What is the difference between public, private, and protected?',
    options: ['Visibility modifiers for class members', 'Access levels for functions', 'Variable scopes', 'File permissions'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'oop'
  },
  {
    id: 'php_15',
    techStack: 'php',
    question: 'What is Symfony?',
    options: ['PHP framework and components library', 'PHP extension', 'PHP database', 'PHP server'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'frameworks'
  },

  // SQL Questions (15 questions)
  {
    id: 'sql_1',
    techStack: 'sql',
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'sql_2',
    techStack: 'sql',
    question: 'Which command is used to retrieve data from a database?',
    options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
    correctAnswer: 1,
    difficulty: 'beginner',
    category: 'commands'
  },
  {
    id: 'sql_3',
    techStack: 'sql',
    question: 'What is a primary key?',
    options: ['Unique identifier for table rows', 'First column in table', 'Most important column', 'Encrypted column'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'keys'
  },
  {
    id: 'sql_4',
    techStack: 'sql',
    question: 'What is the difference between INNER JOIN and LEFT JOIN?',
    options: ['INNER JOIN returns only matching rows, LEFT JOIN includes all left table rows', 'LEFT JOIN returns only matching rows, INNER JOIN includes all rows', 'No difference', 'Both return all rows'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'joins'
  },
  {
    id: 'sql_5',
    techStack: 'sql',
    question: 'What is a foreign key?',
    options: ['Column that references primary key of another table', 'External key from another database', 'Encrypted key', 'Temporary key'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'keys'
  },
  {
    id: 'sql_6',
    techStack: 'sql',
    question: 'What does the GROUP BY clause do?',
    options: ['Groups rows with same values', 'Sorts data', 'Filters data', 'Joins tables'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'grouping'
  },
  {
    id: 'sql_7',
    techStack: 'sql',
    question: 'What is a database index?',
    options: ['Data structure that improves query performance', 'Table of contents', 'Primary key list', 'Column order'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'indexing'
  },
  {
    id: 'sql_8',
    techStack: 'sql',
    question: 'What is normalization?',
    options: ['Process of organizing data to reduce redundancy', 'Data validation', 'Data encryption', 'Data compression'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'normalization'
  },
  {
    id: 'sql_9',
    techStack: 'sql',
    question: 'What is a stored procedure?',
    options: ['Precompiled SQL code stored in database', 'Backup procedure', 'Installation process', 'Data export method'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'procedures'
  },
  {
    id: 'sql_10',
    techStack: 'sql',
    question: 'What is the difference between HAVING and WHERE?',
    options: ['HAVING filters groups, WHERE filters rows', 'WHERE filters groups, HAVING filters rows', 'No difference', 'Both filter the same'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'clauses'
  },
  {
    id: 'sql_11',
    techStack: 'sql',
    question: 'What is a view in SQL?',
    options: ['Virtual table based on query result', 'Physical table', 'Database schema', 'Table index'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'views'
  },
  {
    id: 'sql_12',
    techStack: 'sql',
    question: 'What is SQL injection?',
    options: ['Security vulnerability in database queries', 'Data insertion method', 'Query optimization', 'Database backup'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'security'
  },
  {
    id: 'sql_13',
    techStack: 'sql',
    question: 'What is a transaction in SQL?',
    options: ['Sequence of operations performed as single unit', 'Data transfer', 'Query execution', 'Table creation'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'transactions'
  },
  {
    id: 'sql_14',
    techStack: 'sql',
    question: 'What does ACID stand for in databases?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Identity, Data', 'Automatic, Concurrent, Indexed, Distributed', 'Advanced, Centralized, Integrated, Database'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'acid'
  },
  {
    id: 'sql_15',
    techStack: 'sql',
    question: 'What is the purpose of the DISTINCT keyword?',
    options: ['Remove duplicate rows from result', 'Sort results', 'Filter results', 'Join tables'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'keywords'
  },

  // Rust Questions (10 questions)
  {
    id: 'rust_1',
    techStack: 'rust',
    question: 'What is Rust?',
    options: ['Systems programming language', 'Web framework', 'Database', 'Operating system'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'rust_2',
    techStack: 'rust',
    question: 'What is ownership in Rust?',
    options: ['Memory management system', 'Class inheritance', 'Function calling', 'Variable declaration'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'memory'
  },
  {
    id: 'rust_3',
    techStack: 'rust',
    question: 'What is borrowing in Rust?',
    options: ['Temporary access to data without ownership', 'Copying data', 'Deleting data', 'Creating data'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'memory'
  },
  {
    id: 'rust_4',
    techStack: 'rust',
    question: 'What is a lifetime in Rust?',
    options: ['Scope for which reference is valid', 'Variable duration', 'Function runtime', 'Memory allocation'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'lifetimes'
  },
  {
    id: 'rust_5',
    techStack: 'rust',
    question: 'What is the Option type?',
    options: ['Enum for optional values', 'String type', 'Number type', 'Boolean type'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'types'
  },
  {
    id: 'rust_6',
    techStack: 'rust',
    question: 'What is pattern matching in Rust?',
    options: ['Control flow with match expressions', 'String matching', 'File matching', 'Network matching'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'pattern-matching'
  },
  {
    id: 'rust_7',
    techStack: 'rust',
    question: 'What is a trait in Rust?',
    options: ['Shared behavior definition', 'Data structure', 'Memory model', 'Compilation unit'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'traits'
  },
  {
    id: 'rust_8',
    techStack: 'rust',
    question: 'What is the Result type?',
    options: ['Enum for error handling', 'Success indicator', 'Memory type', 'Thread type'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'error-handling'
  },
  {
    id: 'rust_9',
    techStack: 'rust',
    question: 'What is a closure in Rust?',
    options: ['Anonymous function', 'Memory barrier', 'Thread lock', 'Data structure'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'closures'
  },
  {
    id: 'rust_10',
    techStack: 'rust',
    question: 'What is cargo in Rust?',
    options: ['Package manager and build tool', 'Compiler', 'Runtime', 'Debugger'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'tooling'
  },
  {
    id: 'rust_11',
    techStack: 'rust',
    question: 'What is unsafe code in Rust?',
    options: ['Code that bypasses safety checks', 'Buggy code', 'Slow code', 'Complex code'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'unsafe'
  },
  {
    id: 'rust_12',
    techStack: 'rust',
    question: 'What is memory safety in Rust?',
    options: ['Preventing memory errors at compile time', 'Runtime checks', 'Manual management', 'Garbage collection'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'memory-safety'
  },

  // Google Cloud Platform (GCP) Questions (15 questions)
  {
    id: 'gcp_1',
    techStack: 'google-cloud',
    question: 'What is Google Cloud Platform (GCP)?',
    options: ['Cloud computing platform by Google', 'Database management system', 'Web development framework', 'Programming language'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'basics'
  },
  {
    id: 'gcp_2',
    techStack: 'google-cloud',
    question: 'What is Google Compute Engine?',
    options: ['Virtual machine instances in the cloud', 'Container orchestration service', 'Database service', 'Storage service'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'compute'
  },
  {
    id: 'gcp_3',
    techStack: 'google-cloud',
    question: 'What is Google Cloud Storage?',
    options: ['Object storage service', 'Relational database', 'Virtual machine service', 'Container registry'],
    correctAnswer: 0,
    difficulty: 'beginner',
    category: 'storage'
  },
  {
    id: 'gcp_4',
    techStack: 'google-cloud',
    question: 'What is Google Kubernetes Engine (GKE)?',
    options: ['Managed Kubernetes service', 'Virtual machine service', 'Database service', 'Storage service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'containers'
  },
  {
    id: 'gcp_5',
    techStack: 'google-cloud',
    question: 'What is BigQuery?',
    options: ['Serverless data warehouse', 'Virtual machine service', 'Container service', 'Load balancer'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'analytics'
  },
  {
    id: 'gcp_6',
    techStack: 'google-cloud',
    question: 'What is Cloud Functions?',
    options: ['Serverless compute service', 'Database service', 'Storage service', 'Networking service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'serverless'
  },
  {
    id: 'gcp_7',
    techStack: 'google-cloud',
    question: 'What is Cloud SQL?',
    options: ['Managed relational database service', 'NoSQL database', 'Data warehouse', 'Message queue'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'database'
  },
  {
    id: 'gcp_8',
    techStack: 'google-cloud',
    question: 'What is Cloud Pub/Sub?',
    options: ['Messaging service', 'Database service', 'Storage service', 'Computing service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'messaging'
  },
  {
    id: 'gcp_9',
    techStack: 'google-cloud',
    question: 'What is Cloud Run?',
    options: ['Serverless container platform', 'Virtual machine service', 'Database service', 'Storage service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'containers'
  },
  {
    id: 'gcp_10',
    techStack: 'google-cloud',
    question: 'What is Identity and Access Management (IAM) in GCP?',
    options: ['Service for managing access control', 'Database service', 'Storage service', 'Computing service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'security'
  },
  {
    id: 'gcp_11',
    techStack: 'google-cloud',
    question: 'What is Cloud CDN?',
    options: ['Content delivery network', 'Database service', 'Computing service', 'Storage service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'networking'
  },
  {
    id: 'gcp_12',
    techStack: 'google-cloud',
    question: 'What is Cloud Firestore?',
    options: ['NoSQL document database', 'Relational database', 'Data warehouse', 'Message queue'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'database'
  },
  {
    id: 'gcp_13',
    techStack: 'google-cloud',
    question: 'What is Cloud AI Platform?',
    options: ['Machine learning platform', 'Database service', 'Storage service', 'Networking service'],
    correctAnswer: 0,
    difficulty: 'advanced',
    category: 'ai-ml'
  },
  {
    id: 'gcp_14',
    techStack: 'google-cloud',
    question: 'What is Cloud Build?',
    options: ['CI/CD service', 'Database service', 'Storage service', 'Networking service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'devops'
  },
  {
    id: 'gcp_15',
    techStack: 'google-cloud',
    question: 'What is Google Cloud Load Balancing?',
    options: ['Service for distributing incoming traffic', 'Database service', 'Storage service', 'Computing service'],
    correctAnswer: 0,
    difficulty: 'intermediate',
    category: 'networking'
  }
];

// Fisher-Yates shuffle algorithm for randomizing questions
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random questions for a specific tech stack
export function getQuestionsForTechStack(techStack: string, count: number = 3): Question[] {
  const techQuestions = QUESTION_BANK.filter(q => q.techStack.toLowerCase() === techStack.toLowerCase());
  const shuffled = shuffleArray(techQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Get questions for multiple tech stacks
export function getQuestionsForTechStacks(techStacks: string[], questionsPerStack: number = 3): Question[] {
  const allQuestions: Question[] = [];
  
  techStacks.forEach(techStack => {
    const questions = getQuestionsForTechStack(techStack, questionsPerStack);
    allQuestions.push(...questions);
  });
  
  return shuffleArray(allQuestions);
}

// Validate if tech stack has questions available
export function hasTechStackQuestions(techStack: string): boolean {
  return QUESTION_BANK.some(q => q.techStack.toLowerCase() === techStack.toLowerCase());
}

// Get available tech stacks
export function getAvailableTechStacks(): string[] {
  const techStacks = new Set(QUESTION_BANK.map(q => q.techStack));
  return Array.from(techStacks);
}

// Enhanced question fetching with web integration

/**
 * Get questions with hybrid approach (web + local fallback)
 */
export async function getEnhancedQuestionsForTechStack(
  techStack: string, 
  count: number = 3
): Promise<Question[]> {
  console.log(`🔄 Getting enhanced questions for ${techStack}`);
  
  // Get local questions as fallback
  const localQuestions = getQuestionsForTechStack(techStack, count * 2); // Get more for variety
  
  try {
    // Try to get hybrid questions (web + cache + fallback)
    const hybridQuestions = await getHybridQuestions(techStack, count, localQuestions);
    
    if (hybridQuestions.length >= count) {
      console.log(`✅ Got ${hybridQuestions.length} enhanced questions for ${techStack}`);
      return hybridQuestions;
    } else {
      console.log(`⚠️ Insufficient hybrid questions, padding with local questions`);
      // Pad with local questions if needed
      const remainingCount = count - hybridQuestions.length;
      const additionalLocal = localQuestions
        .filter(q => !hybridQuestions.some(hq => hq.id === q.id))
        .slice(0, remainingCount);
      
      return [...hybridQuestions, ...additionalLocal];
    }
  } catch (error) {
    console.error(`❌ Enhanced fetch failed for ${techStack}, using local questions:`, error);
    return localQuestions.slice(0, count);
  }
}

/**
 * Get enhanced questions for multiple tech stacks
 */
export async function getEnhancedQuestionsForTechStacks(
  techStacks: string[], 
  questionsPerStack: number = 3
): Promise<Question[]> {
  console.log(`🚀 Getting enhanced questions for multiple tech stacks:`, techStacks);
  
  // Clear any expired cache first
  clearExpiredCache();
  
  // Preload questions for better performance
  await preloadQuestions(techStacks);
  
  const allQuestions: Question[] = [];
  
  // Get questions for each tech stack
  for (const techStack of techStacks) {
    try {
      const questions = await getEnhancedQuestionsForTechStack(techStack, questionsPerStack);
      allQuestions.push(...questions);
      console.log(`📚 Added ${questions.length} questions for ${techStack}`);
    } catch (error) {
      console.error(`❌ Failed to get questions for ${techStack}:`, error);
      // Fallback to local questions
      const fallbackQuestions = getQuestionsForTechStack(techStack, questionsPerStack);
      allQuestions.push(...fallbackQuestions);
      console.log(`🏠 Used ${fallbackQuestions.length} local fallback questions for ${techStack}`);
    }
  }
  
  // Shuffle all questions for variety
  const shuffledQuestions = shuffleArray(allQuestions);
  console.log(`🎲 Total enhanced questions generated: ${shuffledQuestions.length}`);
  
  return shuffledQuestions;
}

/**
 * Enhanced version of hasTechStackQuestions that checks both local and web availability
 */
export async function hasEnhancedTechStackQuestions(techStack: string): Promise<boolean> {
  // Check local questions first (faster)
  const hasLocal = hasTechStackQuestions(techStack);
  
  if (hasLocal) {
    return true;
  }
  
  // Try to fetch from web to see if questions are available
  try {
    const webQuestions = await getHybridQuestions(techStack, 1, []);
    return webQuestions.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get question source information for debugging
 */
export function getQuestionSourceInfo(): { local: number; cached: number; total: string[] } {
  const localTechStacks = getAvailableTechStacks();
  
  // This would need to be imported from webQuestionService for cache stats
  // For now, return basic info
  return {
    local: QUESTION_BANK.length,
    cached: 0, // This would come from cache stats
    total: localTechStacks
  };
}