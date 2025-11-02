export const programs = [
  {
    id: 1,
    code: 'SD-DIP',
    name: 'Software Development - Diploma',
    department: 'SD',
    duration: '2 years',
    term: 'Winter',
    description: 'A comprehensive two-year software development diploma program designed to equip students...',
    startDate: '2024-09-05',
    endDate: '2026-06-15',
    fees: {
      domestic: 9254,
      international: 27735
    }
  },
  {
    id: 2,
    code: 'SD-PD',
    name: 'Software Development - Post-Diploma',
    department: 'SD',
    duration: '1 year',
    term: 'Winter',
    description: 'Jumpstart your tech career with our one-year post-diploma program in software development....',
    startDate: '2024-09-05',
    endDate: '2025-06-15',
    fees: {
      domestic: 7895,
      international: 23675
    }
  },
  {
    id: 3,
    code: 'SD-CERT',
    name: 'Software Development - Certificate',
    department: 'SD',
    duration: '6 months',
    term: 'Winter',
    description: 'A focused six-month certificate program in software development fundamentals...',
    startDate: '2024-09-05',
    endDate: '2025-03-15',
    fees: {
      domestic: 4500,
      international: 13500
    }
  }
];

export const courses = [
  {
    id: 1,
    code: 'SODV1101',
    name: 'Introduction to Programming',
    term: 'Fall',
    startDate: '2024-09-05',
    endDate: '2024-12-15',
    description: 'Fundamentals of programming using Python: variables, control flow, functions, and basic data structures.',
    credits: 3
  },
  {
    id: 2,
    code: 'SODV1202',
    name: 'Database Systems',
    term: 'Winter',
    startDate: '2025-01-08',
    endDate: '2025-04-26',
    description: 'Introduction to relational databases, SQL, schema design, and basic normalization.',
    credits: 3
  },
  {
    id: 3,
    code: 'SODV2201',
    name: 'Web Programming',
    term: 'Winter',
    startDate: '2025-01-08',
    endDate: '2025-04-26',
    description: 'Learn modern web development including HTML, CSS, JavaScript, and React.',
    credits: 3
  },
  {
    id: 4,
    code: 'SODV2301',
    name: 'Server-side Development',
    term: 'Spring',
    startDate: '2025-03-01',
    endDate: '2025-06-15',
    description: 'Backend development with Node.js/Express including REST APIs, authentication, and persistence.',
    credits: 3
  },
  {
    id: 5,
    code: 'SODV2401',
    name: 'Mobile Application Development',
    term: 'Summer',
    startDate: '2025-06-01',
    endDate: '2025-08-15',
    description: 'Build cross-platform mobile apps using React Native. Covers UI, navigation, and native features.',
    credits: 3
  },
  {
    id: 6,
    code: 'SODV2501',
    name: 'DevOps and CI/CD',
    term: 'Fall',
    startDate: '2025-09-05',
    endDate: '2025-12-15',
    description: 'Principles of continuous integration and deployment, containerization with Docker, and basic orchestration.',
    credits: 2
  },
  {
    id: 7,
    code: 'SODV2601',
    name: 'User Interface Design',
    term: 'Winter',
    startDate: '2025-01-08',
    endDate: '2025-04-26',
    description: 'Design principles for user interfaces, accessibility, and responsive layouts.',
    credits: 2
  },
  {
    id: 8,
    code: 'SODV2701',
    name: 'Data Structures and Algorithms',
    term: 'Spring',
    startDate: '2025-03-01',
    endDate: '2025-06-15',
    description: 'Core data structures and algorithms focusing on problem solving and complexity analysis.',
    credits: 3
  },
  {
    id: 9,
    code: 'SODV2801',
    name: 'Software Testing and Quality Assurance',
    term: 'Summer',
    startDate: '2025-06-01',
    endDate: '2025-08-15',
    description: 'Techniques for unit testing, integration testing, and test automation.',
    credits: 2
  },
  {
    id: 10,
    code: 'SODV2901',
    name: 'Capstone Project I',
    term: 'Fall',
    startDate: '2025-09-05',
    endDate: '2026-04-30',
    description: 'Team-based project where students design and implement a substantial software application.',
    credits: 6
  },
  {
    id: 11,
    code: 'SODV1200',
    name: 'Stealing the moon',
    term: 'Fall',
    startDate: '2085-09-05',
    endDate: '1906-04-30',
    description: 'The power of the moon in the plam of your hand',
    credits: 0
  }
];

export const TERMS = ['Spring', 'Summer', 'Fall', 'Winter'];

export const TERM_DATES = {
  Spring: { start: '03-01', end: '06-30' },
  Summer: { start: '06-01', end: '08-31' },
  Fall: { start: '09-01', end: '12-31' },
  Winter: { start: '01-01', end: '03-31' }
};


export const students = [
  {
    id: 'stu-001',
    studentId: 'BVC123456',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    program: 'Software Development - Diploma',
    department: 'SD',
    // Registrations reference course CODES (more stable than numeric ids)
    registrations: {
      Winter: ['SODV1200', 'SODV2201'],          // e.g., Database Systems, Web Programming
      Summer: ['SODV2601']                       // e.g., User Interface Design
    }
  },
  {
    id: 'stu-002',
    studentId: 'BVC789012',
    firstName: 'Aisha',
    lastName: 'Singh',
    email: 'aisha.singh@example.com',
    program: 'Software Development - Diploma',
    department: 'SD',
    registrations: {
      Spring: ['SODV2701', 'SODV2301'],          // e.g., Data Structures, Server-side Dev
      Winter: ['SODV1200']
    }
  },
  {
    id: 'stu-003',
    studentId: 'BVC456789',
    firstName: 'Mateo',
    lastName: 'Garcia',
    email: 'mateo.garcia@example.com',
    program: 'Software Development - Diploma',
    department: 'SD',
    registrations: {
      Summer: ['SODV2801', 'SODV2401'],          // e.g., Software Testing & QA, Mobile App Dev
      Winter: ['SODV2201']
    }
  }
];
