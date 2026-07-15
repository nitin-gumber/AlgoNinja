export const SAMPLE_DATA = {
  title: "Climbing Stairs",
  description:
    "## Problem Description\n\nEvery staircase tells a tiny counting story. Stand at the bottom of a staircase where you're only allowed to take one step or two steps at a time, and ask yourself: how many genuinely different sequences of steps could get you all the way to the top?\n\nThis problem is usually the very first introduction many people get to dynamic programming, precisely because the brute-force recursive idea is intuitive, but it hides a massive amount of repeated, wasted work that a tiny bit of bookkeeping can eliminate entirely.\n\n## Problem Statement\n\nYou are climbing a staircase that takes `n` steps to reach the top. Each time, you can either climb **1 step** or **2 steps**.\n\nReturn the number of **distinct ways** you can climb to the top.\n\n## Input\n\n- A single line containing the integer `n` (`1 <= n <= 45`).\n\n## Output\n\n- A single integer — the total number of distinct ways to reach the top.\n\n## Notes\n\n- Two ways are considered different if the sequence of step sizes differs.\n- A naive recursive solution recomputes the same subproblems repeatedly. Build the answer from the bottom up instead.\n\n## Real-World Context\n\nThis is the Fibonacci sequence in disguise — the number of ways to reach step `n` equals the ways to reach `n-1` plus the ways to reach `n-2`.",
  difficulty: "easy",
  tags: [
    "dynamic-programming",
    "math",
    "fibonacci",
    "amazon",
    "adobe",
    "apple",
    "google",
    "dp-intro",
  ],
  examples: {
    "Example 1": {
      input: "2",
      output: "2",
      explanation:
        "There are two ways to climb a 2-step staircase: take one step twice (1, 1), or take one big two-step leap (2).",
    },
    "Example 2": {
      input: "3",
      output: "3",
      explanation:
        "There are three distinct ways: (1, 1, 1), (1, 2), and (2, 1).",
    },
  },
  constraints: "1 <= n <= 45\nTime complexity: O(n)\nSpace complexity: O(1)",
  hints:
    "Hint 1: Think about your very last move when you finally reach step n. It was either a single step from step n - 1, or a double step from step n - 2.\nHint 2: This means the total ways to reach step n equals ways to reach n - 1 plus ways to reach n - 2.\nHint 3: Build the answer iteratively from the bottom up, keeping just the previous two results.",
  editorial:
    "## Editorial: Climbing Stairs\n\n### Problem Recap\n\nGiven a staircase of `n` steps, count how many distinct step sequences reach the top.\n\n### Intuition\n\nThe recurrence `ways(n) = ways(n-1) + ways(n-2)` is the Fibonacci sequence. Implement it iteratively with two variables instead of recursion.\n\n### Approach\n\n1. Base cases: `n=1` returns 1, `n=2` returns 2.\n2. For larger n, maintain `prev2=1` and `prev1=2`, updating each step.\n3. Return `prev1` after the loop.\n\n### Dry Run (n=4)\n\n- Step 3: prev1 + prev2 = 2 + 1 = 3\n- Step 4: 3 + 2 = 5\n\n### Complexity\n\n- Time: O(n) — single loop\n- Space: O(1) — two variables only",
  testcases: [
    { input: "2", output: "2" },
    { input: "3", output: "3" },
    { input: "4", output: "5" },
    { input: "1", output: "1" },
    { input: "10", output: "89" },
  ],
  codeSnippets: {
    JAVASCRIPT: `const fs = require('fs');\n\nfunction climbStairs(n) {\n    // Write your code here\n}\n\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nconsole.log(climbStairs(n));`,
    PYTHON: `def climb_stairs(n):\n    # Write your code here\n    pass\n\nimport sys\nn = int(sys.stdin.read().strip())\nprint(climb_stairs(n))`,
    JAVA: `import java.util.Scanner;\n\npublic class Main {\n    public static int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.util.System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        System.out.println(climbStairs(n));\n    }\n}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `const fs = require('fs');\n\nfunction climbStairs(n) {\n    if (n <= 2) return n;\n    let prev2 = 1, prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        const current = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}\n\nconst n = parseInt(fs.readFileSync(0, 'utf-8').trim());\nconsole.log(climbStairs(n));`,
    PYTHON: `def climb_stairs(n):\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for i in range(3, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    return prev1\n\nimport sys\nn = int(sys.stdin.read().strip())\nprint(climb_stairs(n))`,
    JAVA: `import java.util.Scanner;\n\npublic class Main {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int current = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = current;\n        }\n        return prev1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        System.out.println(climbStairs(n));\n    }\n}`,
  },
};