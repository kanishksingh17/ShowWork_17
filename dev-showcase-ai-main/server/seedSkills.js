import mongoose from 'mongoose';
import Skill from './models/Skill.js';

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/showwork';

const skills = [
  {
    name: 'html',
    displayName: 'HTML5',
    category: 'programming',
    description: 'HyperText Markup Language for structuring web content',
    icon: 'html5',
    color: '#E34F26',
    questions: [
      {
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 0,
        explanation: 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: ['<script>', '<css>', '<style>', '<link>'],
        correctAnswer: 2,
        explanation: 'The <style> tag is used to define CSS styles that are embedded within the HTML document.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<lb>', '<br>', '<line>'],
        correctAnswer: 2,
        explanation: 'The <br> tag is used to insert a single line break in HTML.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?',
        options: ['title', 'src', 'alt', 'href'],
        correctAnswer: 2,
        explanation: 'The alt attribute provides alternative text for an image when the image cannot be displayed.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is the purpose of the HTML <meta> tag?',
        options: [
          'To create a new section',
          'To define metadata about the document',
          'To insert a comment',
          'To create a table'
        ],
        correctAnswer: 1,
        explanation: 'The <meta> tag provides metadata about the HTML document, such as character encoding, viewport settings, and SEO information.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'Which HTML5 element is used to draw graphics on a web page?',
        options: ['<graphics>', '<canvas>', '<drawing>', '<svg>'],
        correctAnswer: 1,
        explanation: 'The <canvas> element is used to draw graphics on a web page using JavaScript.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is semantic HTML?',
        options: [
          'HTML that uses only lowercase letters',
          'HTML that describes the meaning of content rather than its appearance',
          'HTML that validates without errors',
          'HTML that uses CSS for styling'
        ],
        correctAnswer: 1,
        explanation: 'Semantic HTML uses meaningful tags that describe the content structure, making it more accessible and SEO-friendly.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'Which HTML5 form input type is used for email addresses?',
        options: ['<input type="text">', '<input type="email">', '<input type="mail">', '<input type="address">'],
        correctAnswer: 1,
        explanation: 'The email input type provides validation for email addresses and shows appropriate keyboard on mobile devices.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is the purpose of the HTML <article> element?',
        options: [
          'To create a navigation menu',
          'To define a self-contained composition',
          'To insert an image',
          'To create a form'
        ],
        correctAnswer: 1,
        explanation: 'The <article> element represents a self-contained composition that could be independently distributable or reusable.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'Which HTML attribute is used to specify that an input field must be filled out?',
        options: ['placeholder', 'required', 'validate', 'mandatory'],
        correctAnswer: 1,
        explanation: 'The required attribute specifies that an input field must be filled out before submitting the form.',
        difficulty: 'easy',
        points: 1
      }
    ],
    easyQuestions: 3,
    mediumQuestions: 4,
    hardQuestions: 3
  },
  {
    name: 'css',
    displayName: 'CSS3',
    category: 'programming',
    description: 'Cascading Style Sheets for styling web pages',
    icon: 'css3',
    color: '#1572B6',
    questions: [
      {
        question: 'What does CSS stand for?',
        options: [
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Cascading Style Sheets',
          'Colorful Style Sheets'
        ],
        correctAnswer: 2,
        explanation: 'CSS stands for Cascading Style Sheets, which is used to style and layout web pages.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'Which CSS property controls the text size?',
        options: ['font-style', 'text-size', 'font-size', 'text-style'],
        correctAnswer: 2,
        explanation: 'The font-size property controls the size of the text in CSS.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'How do you add a background color for all <h1> elements?',
        options: [
          'h1 {background-color:#FFFFFF;}',
          'h1.all {background-color:#FFFFFF;}',
          'all.h1 {background-color:#FFFFFF;}',
          'h1 {bgcolor:#FFFFFF;}'
        ],
        correctAnswer: 0,
        explanation: 'The correct CSS syntax is h1 {background-color:#FFFFFF;} to add a background color to all h1 elements.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'Which CSS property is used to change the text color of an element?',
        options: ['fgcolor', 'text-color', 'color', 'foreground-color'],
        correctAnswer: 2,
        explanation: 'The color property is used to change the text color of an element in CSS.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'What is the correct CSS syntax for making all the <p> elements bold?',
        options: [
          'p {font-weight:bold;}',
          'p {text-size:bold;}',
          'p {style:bold;}',
          'p {text:bold;}'
        ],
        correctAnswer: 0,
        explanation: 'The correct CSS syntax is p {font-weight:bold;} to make all paragraph elements bold.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'How do you make each word in a text start with a capital letter?',
        options: [
          'text-transform:capitalize',
          'text-transform:uppercase',
          'text-style:capitalize',
          'font-transform:capitalize'
        ],
        correctAnswer: 0,
        explanation: 'The text-transform:capitalize property makes each word start with a capital letter.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'Which property is used to change the left margin of an element?',
        options: ['margin-left', 'padding-left', 'indent', 'left-margin'],
        correctAnswer: 0,
        explanation: 'The margin-left property is used to change the left margin of an element.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is the CSS box model?',
        options: [
          'A way to create 3D effects',
          'A model that describes how elements are laid out with margins, borders, padding, and content',
          'A method for organizing CSS rules',
          'A technique for responsive design'
        ],
        correctAnswer: 1,
        explanation: 'The CSS box model describes how elements are laid out with margins, borders, padding, and content areas.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'What does the CSS property "position: relative" do?',
        options: [
          'Positions the element relative to its normal position',
          'Positions the element relative to the viewport',
          'Positions the element relative to its parent',
          'Positions the element relative to the document'
        ],
        correctAnswer: 0,
        explanation: 'position: relative positions the element relative to where it would normally be positioned.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'Which CSS selector is used to select elements with a specific class?',
        options: ['#id', '.class', 'element', '*'],
        correctAnswer: 1,
        explanation: 'The .class selector is used to select elements with a specific class name.',
        difficulty: 'medium',
        points: 2
      }
    ],
    easyQuestions: 3,
    mediumQuestions: 4,
    hardQuestions: 3
  },
  {
    name: 'javascript',
    displayName: 'JavaScript (ES6+)',
    category: 'programming',
    description: 'Programming language for web development and beyond',
    icon: 'javascript',
    color: '#F7DF1E',
    questions: [
      {
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['string', 'boolean', 'integer', 'object'],
        correctAnswer: 2,
        explanation: 'JavaScript does not have an "integer" type. It has "number" which represents both integers and floating-point numbers.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'How do you declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 0,
        explanation: 'Variables in JavaScript are declared using var, let, or const keywords.',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'What is the correct way to write a JavaScript array?',
        options: [
          'var colors = "red", "green", "blue"',
          'var colors = ["red", "green", "blue"]',
          'var colors = (1:"red", 2:"green", 3:"blue")',
          'var colors = "red" + "green" + "blue"'
        ],
        correctAnswer: 1,
        explanation: 'Arrays in JavaScript are written using square brackets: var colors = ["red", "green", "blue"]',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'How do you call a function named "myFunction"?',
        options: [
          'call myFunction()',
          'myFunction()',
          'call function myFunction',
          'function myFunction()'
        ],
        correctAnswer: 1,
        explanation: 'Functions are called by writing the function name followed by parentheses: myFunction()',
        difficulty: 'easy',
        points: 1
      },
      {
        question: 'What is the purpose of the "use strict" directive?',
        options: [
          'To enable strict mode which catches common coding mistakes',
          'To make the code run faster',
          'To enable ES6 features',
          'To disable console.log statements'
        ],
        correctAnswer: 0,
        explanation: '"use strict" enables strict mode which catches common coding mistakes and prevents some potentially confusing features.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is a closure in JavaScript?',
        options: [
          'A function that has access to variables in its outer scope',
          'A way to close browser windows',
          'A method to end loops',
          'A type of error handling'
        ],
        correctAnswer: 0,
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'What does the "this" keyword refer to in JavaScript?',
        options: [
          'Always refers to the global object',
          'Refers to the function it is written inside',
          'Refers to the object that is currently executing the function',
          'Refers to the previous function in the call stack'
        ],
        correctAnswer: 2,
        explanation: 'The "this" keyword refers to the object that is currently executing the function, which can vary depending on how the function is called.',
        difficulty: 'hard',
        points: 3
      },
      {
        question: 'What is the difference between "==" and "===" in JavaScript?',
        options: [
          'There is no difference',
          '"==" checks value and type, "===" checks only value',
          '"==" checks only value, "===" checks value and type',
          '"==" is deprecated, "===" is the modern way'
        ],
        correctAnswer: 2,
        explanation: '"==" performs type coercion and checks value, while "===" checks both value and type without coercion.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is an arrow function?',
        options: [
          'A function that can only be called once',
          'A shorter syntax for writing function expressions',
          'A function that automatically returns values',
          'A function that can only be used in loops'
        ],
        correctAnswer: 1,
        explanation: 'Arrow functions are a shorter syntax for writing function expressions, introduced in ES6.',
        difficulty: 'medium',
        points: 2
      },
      {
        question: 'What is the purpose of the "async/await" syntax?',
        options: [
          'To make functions run faster',
          'To handle asynchronous operations more elegantly than promises',
          'To create infinite loops',
          'To prevent function calls'
        ],
        correctAnswer: 1,
        explanation: 'async/await provides a more elegant way to handle asynchronous operations compared to using promises with .then() and .catch().',
        difficulty: 'hard',
        points: 3
      }
    ],
    easyQuestions: 3,
    mediumQuestions: 4,
    hardQuestions: 3
  }
];

async function seedSkills() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing skills
    await Skill.deleteMany({});
    console.log('🗑️ Cleared existing skills');
    
    // Insert new skills
    const insertedSkills = await Skill.insertMany(skills);
    console.log(`✅ Inserted ${insertedSkills.length} skills`);
    
    // Log each skill
    insertedSkills.forEach(skill => {
      console.log(`📚 ${skill.displayName}: ${skill.questions.length} questions`);
    });
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedSkills();
