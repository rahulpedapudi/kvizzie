import { db, client } from "./db";
import { questions, difficultyEnum } from "./schemas/questions";
import { categories } from "./schemas/categories";
import type { InferInsertModel } from "drizzle-orm";
import { questionOptions } from "./schemas/questionOptions";

async function seedCategories() {
  const seedCategories = [
    { title: "JavaScript" },
    { title: "Computer Science" },
    { title: "Web Development" },
  ];

  await db.insert(categories).values(seedCategories).onConflictDoNothing();
}

// seedCategories()
//   .catch((e) => {
//     console.error("Seeding Failed: ", e);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await client.end();
//   });

type NewQuestion = InferInsertModel<typeof questions>;
type SeedQuestion = Pick<NewQuestion, "text" | "difficulty" | "status"> & {
  options: {
    text: string;
    isCorrect: boolean;
  }[];
};

async function seedQuestions() {
  const sampleQuestions: SeedQuestion[] = [
    {
      text: "What is the output of typeof null in JavaScript?",
      difficulty: "easy",
      status: "published",
      options: [
        { text: '"null"', isCorrect: false },
        { text: '"object"', isCorrect: true },
        { text: '"undefined"', isCorrect: false },
        { text: '"boolean"', isCorrect: false },
      ],
    },
    {
      text: "Which array method creates a new array by transforming each element?",
      difficulty: "easy",
      status: "published",
      options: [
        { text: "filter()", isCorrect: false },
        { text: "forEach()", isCorrect: false },
        { text: "map()", isCorrect: true },
        { text: "find()", isCorrect: false },
      ],
    },
    {
      text: "What is the time complexity of binary search on a sorted array?",
      difficulty: "medium",
      status: "published",
      options: [
        { text: "O(1)", isCorrect: false },
        { text: "O(log n)", isCorrect: true },
        { text: "O(n)", isCorrect: false },
        { text: "O(n²)", isCorrect: false },
      ],
    },
    {
      text: "What does a 404 HTTP status code indicate?",
      difficulty: "easy",
      status: "published",
      options: [
        { text: "Internal server error", isCorrect: false },
        { text: "Unauthorized request", isCorrect: false },
        { text: "Resource not found", isCorrect: true },
        { text: "Successful request", isCorrect: false },
      ],
    },
  ];

  for (const { options, ...questionData } of sampleQuestions) {
    let [inserted] = await db
      .insert(questions)
      .values(questionData)
      .returning({ id: questions.id });

    if (!inserted) {
      throw new Error(`Failed to insert: ${questionData.text}`);
    }

    await db.insert(questionOptions).values(
      options.map((option) => ({
        ...option,
        questionId: inserted.id,
      })),
    );
  }
  console.log("added");
}

seedQuestions()
  .catch((e) => {
    console.error("Seeding Error: ", e);
    process.exitCode = 1;
  })
  .then(async () => {
    await client.end();
  });
