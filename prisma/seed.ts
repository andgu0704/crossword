import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  // Puzzle 1: 5x5 easy
  // Solution:
  // მ ა მ ა - (mama = dad)
  // ა - ო - ა
  // ს ა ხ ლ ი (saxli = house)
  // ა - ა - ნ
  // ც - - - ი
  const puzzle1 = await prisma.puzzle.upsert({
    where: { id: "puzzle-1" },
    update: {},
    create: {
      id: "puzzle-1",
      title: "სახლი და ოჯახი",
      difficulty: "easy",
      gridSize: 5,
      solution: [
        ["მ", "ა", "მ", "ა", null],
        ["ა", null, "ო", null, "ა"],
        ["ს", "ა", "ხ", "ლ", "ი"],
        ["ა", null, "ა", null, "ნ"],
        ["ც", null, null, null, "ი"],
      ],
      gridData: [
        [
          { isBlack: false, number: 1 },
          { isBlack: false, number: null },
          { isBlack: false, number: 2 },
          { isBlack: false, number: null },
          { isBlack: true },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 3 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 4 },
          { isBlack: true },
          { isBlack: true },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
      ],
      clues: {
        across: [
          { num: 1, clue: "მამაკაცი მშობელი" },
          { num: 3, clue: "სადაც ოჯახი ცხოვრობს" },
        ],
        down: [
          { num: 1, clue: "ოჯახის ძირითადი სტრუქტურა" },
          { num: 2, clue: "სიამოვნებით ვიმოქმედებ" },
          { num: 4, clue: "ზოგიერთი ქვეყნის შვილი" },
        ],
      },
    },
  });

  // Puzzle 2: 7x7 medium
  const puzzle2 = await prisma.puzzle.upsert({
    where: { id: "puzzle-2" },
    update: {},
    create: {
      id: "puzzle-2",
      title: "ქალაქი და ბუნება",
      difficulty: "medium",
      gridSize: 7,
      solution: [
        ["თ", "ბ", "ი", "ლ", "ი", "ს", "ი"],
        ["ო", null, "ა", null, "ა", null, "ა"],
        ["ვ", "ი", "ნ", "ა", "ხ", "ი", "ს"],
        ["ლ", null, "ა", null, "ა", null, null],
        ["ი", "ს", "ი", "ს", "ი", "ს", "ი"],
        [null, null, "ა", null, null, null, "ა"],
        ["მ", "თ", "ა", "ვ", "ა", "რ", "ი"],
      ],
      gridData: [
        [
          { isBlack: false, number: 1 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 2 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: true },
        ],
        [
          { isBlack: false, number: 3 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: true },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: true },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 4 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
      ],
      clues: {
        across: [
          { num: 1, clue: "საქართველოს დედაქალაქი" },
          { num: 2, clue: "ყურძნის წვენი, ქართული სასმელი" },
          { num: 3, clue: "კატის მსგავსი, მაგრამ გარეული" },
          { num: 4, clue: "ქვეყნის მმართველი" },
        ],
        down: [
          { num: 1, clue: "ხარის მსგავსი ცხოველი" },
          { num: 2, clue: "ქართული სიტყვა სასიამოვნოსთვის" },
        ],
      },
    },
  });

  // Puzzle 3: 9x9 hard
  const puzzle3 = await prisma.puzzle.upsert({
    where: { id: "puzzle-3" },
    update: {},
    create: {
      id: "puzzle-3",
      title: "კულტურა და ისტორია",
      difficulty: "hard",
      gridSize: 9,
      solution: [
        ["ს", "ა", "ქ", "ა", "რ", "თ", "ვ", "ე", "ლ"],
        ["ა", null, "ა", null, "ო", null, "ა", null, "ო"],
        ["ხ", "ა", "ლ", "ხ", "ი", "ს", "უ", "რ", "ი"],
        ["ე", null, "ა", null, "ს", null, "ა", null, null],
        ["ლ", "ი", "თ", "ე", "რ", "ა", "ტ", "უ", "რ"],
        ["მ", null, "ო", null, null, null, "უ", null, "ა"],
        ["წ", "ი", "ბ", "ა", "ს", "ი", "ო", "ნ", "ი"],
        ["ი", null, "ი", null, "ა", null, null, null, null],
        ["ფ", "ო", "ლ", "კ", "ლ", "ო", "რ", "ი", "ა"],
      ],
      gridData: [
        [
          { isBlack: false, number: 1 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 2 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: true },
        ],
        [
          { isBlack: false, number: 3 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: true },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: 4 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
        [
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: false, number: null },
          { isBlack: true },
          { isBlack: true },
          { isBlack: true },
          { isBlack: true },
        ],
        [
          { isBlack: false, number: 5 },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
          { isBlack: false, number: null },
        ],
      ],
      clues: {
        across: [
          { num: 1, clue: "კავკასიაში მდებარე ქვეყანა" },
          { num: 2, clue: "ხალხს მიკუთვნებული, ნაციონალური" },
          { num: 3, clue: "წერილობითი შემოქმედების სფერო" },
          { num: 4, clue: "ქრისტიანული სიწმინდე, ტაძარი" },
          { num: 5, clue: "ხალხური ტრადიციების კრებული" },
        ],
        down: [
          { num: 1, clue: "ისტორიული ადგილი, ძველი ნაგებობა" },
          { num: 2, clue: "ქართული ანბანის ასო" },
          { num: 3, clue: "ხელოვანი, რომელიც ქმნის" },
        ],
      },
    },
  });

  console.log("Seeded puzzles:", puzzle1.id, puzzle2.id, puzzle3.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
