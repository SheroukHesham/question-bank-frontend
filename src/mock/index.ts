import type {
  ICategories,
  IGroupedQuestions,
  IQuestions,
  ISubCategories,
  IUser,
} from "@/interfaces";

export const MOCK_USERS: IUser[] = [
  {
    _id: "64a100000000000000000001",
    name: "Dr. Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    role: "professor",
    verified: true,
    profilePicture: "https://github.com/shadcn.png",
  },
  {
    _id: "64a100000000000000000002",
    name: "Dr. Sara Ali",
    email: "sara.ali@university.edu",
    role: "professor",
    verified: true,
    profilePicture: "https://github.com/shadcn.png",
  },
];

export const MOCK_CATEGORIES: ICategories[] = [
  {
    _id: "cat001",
    name: "Programming",
    description: "Programming languages and software development",
    subCategories: ["sub001", "sub002", "sub003"],
  },
  {
    _id: "cat002",
    name: "Database Systems",
    description: "Relational and NoSQL databases",
    subCategories: ["sub004", "sub005"],
  },
  {
    _id: "cat003",
    name: "Computer Networks",
    description: "Networking fundamentals",
    subCategories: ["sub006", "sub007"],
  },
  {
    _id: "cat004",
    name: "Operating Systems",
    description: "Operating system concepts",
    subCategories: ["sub008", "sub009"],
  },
];

export const MOCK_SUB_CATEGORIES: ISubCategories[] = [
  {
    _id: "sub001",
    name: "Java",
    categoryId: "cat001",
  },
  {
    _id: "sub002",
    name: "C++",
    categoryId: "cat001",
  },
  {
    _id: "sub003",
    name: "JavaScript",
    categoryId: "cat001",
  },

  {
    _id: "sub004",
    name: "SQL",
    categoryId: "cat002",
  },
  {
    _id: "sub005",
    name: "MongoDB",
    categoryId: "cat002",
  },

  {
    _id: "sub006",
    name: "TCP/IP",
    categoryId: "cat003",
  },
  {
    _id: "sub007",
    name: "Routing",
    categoryId: "cat003",
  },

  {
    _id: "sub008",
    name: "Processes",
    categoryId: "cat004",
  },
  {
    _id: "sub009",
    name: "Memory Management",
    categoryId: "cat004",
  },
];

export const MOCK_QUESTIONS: IQuestions[] = [
  {
    _id: "q001",
    type: "mcq",

    header: "Which keyword creates a subclass in Java?",

    headerImageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZDXM43whq2NiG2eicShUxSv8vgv0aqHCsA9NP0HUfVI04qLSBwCJs4w&s=10",

    difficulty: 1,

    mark: 1,

    categoryId: "cat001",

    subcategoryId: "sub001",

    createdBy: "64a100000000000000000001",

    choices: [
      {
        choice: "implements",
        isCorrect: false,
      },
      {
        choice: "inherits",
        isCorrect: false,
      },
      {
        choice: "extends",
        isCorrect: true,
      },
      {
        choice: "super",
        isCorrect: false,
      },
      {
        choice: "None of the above",
        isCorrect: false,
      },
    ],
  },

  {
    _id: "q002",
    type: "essay",

    header: "Explain polymorphism in Object-Oriented Programming.",

    difficulty: 3,

    mark: 8,

    categoryId: "cat001",

    subcategoryId: "sub001",

    createdBy: "64a100000000000000000001",

    modelAnswer:
      "Polymorphism allows one interface to represent many implementations...Polymorphism allows one interface to represent many implementations..Polymorphism allows one interface to represent many implementations..Polymorphism allows one interface to represent many implementations..Polymorphism allows one interface to represent many implementations..Polymorphism allows one interface to represent many implementations..Polymorphism allows one interface to represent many implementations..",
  },

  {
    _id: "q003",
    type: "mcq",

    header: "Which SQL statement retrieves data?",

    difficulty: 1,

    mark: 2,

    categoryId: "cat002",

    subcategoryId: "sub004",

    createdBy: "64a100000000000000000002",

    choices: [
      {
        choice: "SELECT",
        isCorrect: true,
      },
      {
        choice: "INSERT",
        isCorrect: false,
      },
      {
        choice: "DELETE",
        isCorrect: false,
      },
      {
        choice: "UPDATE",
        isCorrect: false,
      },
      {
        choice: "CREATE",
        isCorrect: false,
      },
    ],
  },

  {
    _id: "q004",

    type: "essay",

    header: "Compare SQL and MongoDB databases.",

    difficulty: 4,

    mark: 10,

    categoryId: "cat002",

    subcategoryId: "sub005",

    createdBy: "64a100000000000000000002",

    modelAnswer:
      "SQL databases are relational while MongoDB is a document-oriented NoSQL database...",
  },

  {
    _id: "q005",

    type: "mcq",

    header: "Which protocol guarantees reliable delivery?",

    difficulty: 2,

    mark: 2,

    categoryId: "cat003",

    subcategoryId: "sub006",

    createdBy: "64a100000000000000000001",

    choices: [
      {
        choice: "TCP",
        isCorrect: true,
      },
      {
        choice: "UDP",
        isCorrect: false,
      },
      {
        choice: "IP",
        isCorrect: false,
      },
      {
        choice: "ARP",
        isCorrect: false,
      },
      {
        choice: "HTTP",
        isCorrect: false,
      },
    ],
  },

  {
    _id: "q006",

    type: "essay",

    header: "Describe process scheduling algorithms.",

    difficulty: 5,

    mark: 12,

    categoryId: "cat004",

    subcategoryId: "sub008",

    createdBy: "64a100000000000000000001",

    modelAnswer:
      "Common scheduling algorithms include FCFS, SJF, Round Robin and Priority Scheduling...",
  },
];

export const MOCK_GROUPED_MCQ_QUESTIONS: IGroupedQuestions = {
  categories: [
    {
      _id: "cat001",
      name: "Programming",
      description: "Programming languages and software development",
      subcategories: [
        {
          _id: "sub001",
          name: "Java",
          categoryId: "cat001",
          questions: [
            {
              _id: "q001",
              type: "mcq",
              header: "Which keyword creates a subclass in Java?",
              difficulty: 1,
              mark: 1,
              categoryId: "cat001",
              subcategoryId: "sub001",
              createdBy: "64a100000000000000000001",
              key: "extends",
              distractors: [
                "implements",
                "inherits",
                "super",
                "None of the above",
              ],
            },
          ],
        },
        {
          _id: "sub002",
          name: "C++",
          categoryId: "cat001",
          questions: [],
        },
        {
          _id: "sub003",
          name: "JavaScript",
          categoryId: "cat001",
          questions: [],
        },
      ],
    },

    {
      _id: "cat002",
      name: "Database Systems",
      description: "Relational and NoSQL databases",
      subcategories: [
        {
          _id: "sub004",
          name: "SQL",
          categoryId: "cat002",
          questions: [
            {
              _id: "q003",
              type: "mcq",
              header: "Which SQL statement retrieves data?",
              difficulty: 1,
              mark: 2,
              categoryId: "cat002",
              subcategoryId: "sub004",
              createdBy: "64a100000000000000000002",
              key: "SELECT",
              distractors: ["INSERT", "DELETE", "UPDATE", "CREATE"],
            },
          ],
        },
        {
          _id: "sub005",
          name: "MongoDB",
          categoryId: "cat002",
          questions: [],
        },
      ],
    },

    {
      _id: "cat003",
      name: "Computer Networks",
      description: "Networking fundamentals",
      subcategories: [
        {
          _id: "sub006",
          name: "TCP/IP",
          categoryId: "cat003",
          questions: [
            {
              _id: "q005",
              type: "mcq",
              header: "Which protocol guarantees reliable delivery?",
              difficulty: 2,
              mark: 2,
              categoryId: "cat003",
              subcategoryId: "sub006",
              createdBy: "64a100000000000000000001",
              key: "TCP",
              distractors: ["UDP", "IP", "ARP", "HTTP"],
            },
          ],
        },
        {
          _id: "sub007",
          name: "Routing",
          categoryId: "cat003",
          questions: [],
        },
      ],
    },

    {
      _id: "cat004",
      name: "Operating Systems",
      description: "Operating system concepts",
      subcategories: [
        {
          _id: "sub008",
          name: "Processes",
          categoryId: "cat004",
          questions: [],
        },
        {
          _id: "sub009",
          name: "Memory Management",
          categoryId: "cat004",
          questions: [],
        },
      ],
    },
  ],
};

export const MOCK_GROUPED_ESSAY_QUESTIONS: IGroupedQuestions = {
  categories: [
    {
      _id: "cat001",
      name: "Programming",
      description: "Programming languages and software development",
      subcategories: [
        {
          _id: "sub001",
          name: "Java",
          categoryId: "cat001",
          questions: [
            {
              _id: "q002",
              type: "essay",
              header: "Explain polymorphism in Object-Oriented Programming.",
              difficulty: 3,
              mark: 8,
              categoryId: "cat001",
              subcategoryId: "sub001",
              createdBy: "64a100000000000000000001",
              modelAnswer:
                "Polymorphism allows one interface to represent many implementations...",
            },
          ],
        },
        {
          _id: "sub002",
          name: "C++",
          categoryId: "cat001",
          questions: [],
        },
        {
          _id: "sub003",
          name: "JavaScript",
          categoryId: "cat001",
          questions: [],
        },
      ],
    },

    {
      _id: "cat002",
      name: "Database Systems",
      description: "Relational and NoSQL databases",
      subcategories: [
        {
          _id: "sub004",
          name: "SQL",
          categoryId: "cat002",
          questions: [],
        },
        {
          _id: "sub005",
          name: "MongoDB",
          categoryId: "cat002",
          questions: [
            {
              _id: "q004",
              type: "essay",
              header: "Compare SQL and MongoDB databases.",
              difficulty: 4,
              mark: 10,
              categoryId: "cat002",
              subcategoryId: "sub005",
              createdBy: "64a100000000000000000002",
              modelAnswer:
                "SQL databases are relational while MongoDB is a document-oriented NoSQL database...",
            },
          ],
        },
      ],
    },

    {
      _id: "cat003",
      name: "Computer Networks",
      description: "Networking fundamentals",
      subcategories: [
        {
          _id: "sub006",
          name: "TCP/IP",
          categoryId: "cat003",
          questions: [],
        },
        {
          _id: "sub007",
          name: "Routing",
          categoryId: "cat003",
          questions: [],
        },
      ],
    },

    {
      _id: "cat004",
      name: "Operating Systems",
      description: "Operating system concepts",
      subcategories: [
        {
          _id: "sub008",
          name: "Processes",
          categoryId: "cat004",
          questions: [
            {
              _id: "q006",
              type: "essay",
              header: "Describe process scheduling algorithms.",
              difficulty: 5,
              mark: 12,
              categoryId: "cat004",
              subcategoryId: "sub008",
              createdBy: "64a100000000000000000001",
              modelAnswer:
                "Common scheduling algorithms include FCFS, SJF, Round Robin and Priority Scheduling...",
            },
          ],
        },
        {
          _id: "sub009",
          name: "Memory Management",
          categoryId: "cat004",
          questions: [],
        },
      ],
    },
  ],
};
