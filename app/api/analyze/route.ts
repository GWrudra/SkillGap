import { NextRequest, NextResponse } from "next/server"

const MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
]

async function callGemini(apiKey: string, prompt: string): Promise<string | null> {
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          console.log(`Success with model: ${model}`)
          return text
        }
      }

      const status = response.status
      console.error(`Model ${model} failed (${status})`)
      if (status !== 429) break // Only retry on rate limit
    } catch (e) {
      console.error(`Model ${model} exception:`, e)
    }
  }
  return null
}

function generateFallbackAnalysis(skills: string[], targetRole: string, experience: string, currentStatus: string, learningStyle: string) {
  // Skill database with role requirements
  const roleSkillMap: Record<string, { required: string[]; nice: string[] }> = {
    "Software Engineer": {
      required: ["Data Structures", "Algorithms", "System Design", "Git", "SQL", "REST APIs", "Testing"],
      nice: ["Docker", "Kubernetes", "AWS", "CI/CD", "Agile"],
    },
    "Frontend Engineer": {
      required: ["JavaScript", "TypeScript", "React", "CSS", "HTML", "Responsive Design", "Web Performance"],
      nice: ["Next.js", "Testing", "Accessibility", "Figma", "GraphQL"],
    },
    "Backend Engineer": {
      required: ["Node.js", "SQL", "REST APIs", "System Design", "Docker", "Authentication", "Database Design"],
      nice: ["Kubernetes", "AWS", "Redis", "Message Queues", "Microservices"],
    },
    "Full-Stack Developer": {
      required: ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "REST APIs"],
      nice: ["Docker", "AWS", "CI/CD", "Testing", "System Design"],
    },
    "Data Scientist": {
      required: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization", "Pandas", "NumPy"],
      nice: ["Deep Learning", "TensorFlow", "NLP", "A/B Testing", "Spark"],
    },
    "Data Analyst": {
      required: ["SQL", "Excel", "Statistics", "Data Visualization", "Python", "Tableau", "Communication"],
      nice: ["Power BI", "A/B Testing", "R", "ETL", "Dashboarding"],
    },
  }

  const roleData = roleSkillMap[targetRole] || roleSkillMap["Software Engineer"]
  const allRequired = [...roleData.required, ...roleData.nice]
  const skillsLower = skills.map(s => s.toLowerCase())

  // Calculate which required skills the user has and doesn't have
  const matchedSkills = allRequired.filter(s => skillsLower.includes(s.toLowerCase()))
  const missingRequired = roleData.required.filter(s => !skillsLower.includes(s.toLowerCase()))
  const missingNice = roleData.nice.filter(s => !skillsLower.includes(s.toLowerCase()))

  const expYears = parseInt(experience) || 0
  
  const skillMatchScore = allRequired.length > 0 ? (matchedSkills.length / allRequired.length) * 55 : 0
  const generalSkillScore = Math.min(25, skills.length * 2)
  const expScore = Math.min(35, expYears * 6)
  
  const baseScore = Math.round(skillMatchScore + generalSkillScore + expScore)
  
  // Add a slight deterministic variance so identical sparse profiles don't always get exact same low score
  const variance = (skills.length * 7 + targetRole.length * 3) % 14
  const readinessScore = Math.max(12, Math.min(98, baseScore + (baseScore < 40 ? variance : 0)))

  // Build skill gaps
  const skillGaps = [
    ...missingRequired.slice(0, 5).map((skill, i) => ({
      skill,
      currentLevel: i < 2 ? 0 : 1,
      requiredLevel: 4,
      severity: i < 2 ? "critical" as const : "high" as const,
      description: `${skill} is a core competency for ${targetRole} roles. Most job postings list this as a must-have requirement.`,
    })),
    ...missingNice.slice(0, 3).map(skill => ({
      skill,
      currentLevel: 1,
      requiredLevel: 3,
      severity: "medium" as const,
      description: `${skill} is increasingly expected for senior ${targetRole} positions and will differentiate you from other candidates.`,
    })),
  ]

  // Build strengths from matched skills
  const strengths = matchedSkills.slice(0, 5).map((skill, index) => {
    let baseLvl = expYears >= 4 ? 4 : expYears >= 1 ? 3 : 2;
    let variance = (skill.length + index) % 2; // Adds 0 or 1
    let finalLvl = Math.min(5, Math.max(3, baseLvl + variance));
    
    return {
      skill,
      level: finalLvl,
      relevance: `Your ${skill} experience directly applies to ${targetRole} responsibilities. This is a strong foundation to build on.`,
    };
  })

  // Add any extra user skills as strengths
  const extraSkills = skills.filter(s => !allRequired.map(r => r.toLowerCase()).includes(s.toLowerCase()))
  extraSkills.slice(0, 3).forEach((skill, index) => {
    let variance = (skill.length + index) % 2;
    let finalLvl = Math.min(5, Math.max(3, (expYears >= 2 ? 3 : 2) + variance));
    strengths.push({
      skill,
      level: finalLvl,
      relevance: `While not a primary requirement, ${skill} shows breadth and can be valuable for cross-functional collaboration.`,
    })
  })

  // Real learning resource database with actual URLs
  // Each skill has video, reading, and project resources
  const resourceDB: Record<string, Array<{ title: string; provider: string; url: string; hours: number; cost: "free" | "paid"; priority: "critical" | "high" | "medium"; type?: string }>> = {
    "JavaScript": [
      { title: "JavaScript Full Course for Beginners", provider: "YouTube - Bro Code", url: "https://www.youtube.com/watch?v=lfmg-EJ8gm4", hours: 12, cost: "free", priority: "critical", type: "video" },
      { title: "The Complete JavaScript Course 2024", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-javascript-course/", hours: 69, cost: "paid", priority: "critical", type: "video" },
      { title: "JavaScript Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/javascript/", hours: 20, cost: "free", priority: "critical", type: "reading" },
      { title: "MDN JavaScript Guide", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", hours: 15, cost: "free", priority: "critical", type: "reading" },
      { title: "Build 30 JS Projects in 30 Days", provider: "JavaScript30", url: "https://javascript30.com/", hours: 30, cost: "free", priority: "high", type: "project" },
    ],
    "TypeScript": [
      { title: "TypeScript Full Course for Beginners", provider: "YouTube - Dave Gray", url: "https://www.youtube.com/watch?v=gieEQFIfgYc", hours: 8, cost: "free", priority: "high" },
      { title: "Understanding TypeScript", provider: "Udemy", url: "https://www.udemy.com/course/understanding-typescript/", hours: 15, cost: "paid", priority: "high" },
    ],
    "React": [
      { title: "React Full Course 2024", provider: "YouTube - Bro Code", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA", hours: 10, cost: "free", priority: "critical" },
      { title: "React - The Complete Guide", provider: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", hours: 68, cost: "paid", priority: "critical" },
    ],
    "Node.js": [
      { title: "Node.js Full Course for Beginners", provider: "YouTube - Dave Gray", url: "https://www.youtube.com/watch?v=f2EqECiTBL8", hours: 7, cost: "free", priority: "high" },
      { title: "The Complete Node.js Developer Course", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/", hours: 35, cost: "paid", priority: "high" },
    ],
    "Python": [
      { title: "Python Full Course for Beginners", provider: "YouTube - Bro Code", url: "https://www.youtube.com/watch?v=XKHEtdqhLK8", hours: 12, cost: "free", priority: "critical" },
      { title: "100 Days of Code: Python", provider: "Udemy", url: "https://www.udemy.com/course/100-days-of-code/", hours: 60, cost: "paid", priority: "critical" },
    ],
    "SQL": [
      { title: "SQL Full Course for Beginners", provider: "YouTube - Bro Code", url: "https://www.youtube.com/watch?v=5OdVJbNCSso", hours: 4, cost: "free", priority: "critical" },
      { title: "The Complete SQL Bootcamp", provider: "Udemy", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/", hours: 9, cost: "paid", priority: "high" },
    ],
    "Git": [
      { title: "Git and GitHub Full Course", provider: "YouTube - Kunal Kushwaha", url: "https://www.youtube.com/watch?v=apGV9Kg7ics", hours: 2, cost: "free", priority: "high" },
      { title: "Git & GitHub - The Practical Guide", provider: "Udemy", url: "https://www.udemy.com/course/git-github-practical-guide/", hours: 11, cost: "paid", priority: "high" },
    ],
    "Docker": [
      { title: "Docker Full Course", provider: "YouTube - TechWorld with Nana", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", hours: 4, cost: "free", priority: "high" },
      { title: "Docker & Kubernetes: The Practical Guide", provider: "Udemy", url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", hours: 24, cost: "paid", priority: "high" },
    ],
    "AWS": [
      { title: "AWS Certified Cloud Practitioner", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", hours: 14, cost: "free", priority: "high" },
      { title: "Ultimate AWS Certified Solutions Architect", provider: "Udemy", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", hours: 27, cost: "paid", priority: "high" },
    ],
    "CSS": [
      { title: "CSS Full Course for Beginners", provider: "YouTube - Dave Gray", url: "https://www.youtube.com/watch?v=n4R2E7O-Ngo", hours: 11, cost: "free", priority: "high" },
    ],
    "HTML": [
      { title: "HTML Full Course for Beginners", provider: "YouTube - Dave Gray", url: "https://www.youtube.com/watch?v=mJgBOIoGihA", hours: 4, cost: "free", priority: "high" },
    ],
    "System Design": [
      { title: "System Design for Beginners", provider: "YouTube - NeetCode", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4", hours: 2, cost: "free", priority: "critical" },
      { title: "Grokking System Design", provider: "Design Gurus", url: "https://www.designgurus.io/course/grokking-the-system-design-interview", hours: 30, cost: "paid", priority: "critical" },
    ],
    "Data Structures": [
      { title: "Data Structures & Algorithms Full Course", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=8hly31xKli0", hours: 8, cost: "free", priority: "critical" },
    ],
    "Algorithms": [
      { title: "Algorithms and Data Structures", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/", hours: 40, cost: "free", priority: "critical" },
    ],
    "Machine Learning": [
      { title: "Machine Learning Full Course", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=NWONeJKn6kc", hours: 10, cost: "free", priority: "critical" },
      { title: "Machine Learning Specialization", provider: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction", hours: 80, cost: "paid", priority: "critical" },
    ],
    "Statistics": [
      { title: "Statistics Full Course for Beginners", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=xxpc-HPKN28", hours: 8, cost: "free", priority: "high" },
    ],
    "REST APIs": [
      { title: "REST API Design Best Practices", provider: "YouTube - Traversy Media", url: "https://www.youtube.com/watch?v=fgTGPDDRJPI", hours: 1, cost: "free", priority: "high" },
    ],
    "Testing": [
      { title: "JavaScript Testing with Jest", provider: "YouTube - Traversy Media", url: "https://www.youtube.com/watch?v=FgnxcUQ5vho", hours: 1, cost: "free", priority: "high" },
    ],
    "Responsive Design": [
      { title: "Responsive Web Design", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", hours: 20, cost: "free", priority: "high" },
    ],
    "Web Performance": [
      { title: "Web Performance Fundamentals", provider: "YouTube - Google Chrome Developers", url: "https://www.youtube.com/watch?v=0fONene3OIA", hours: 2, cost: "free", priority: "medium" },
    ],
    "Kubernetes": [
      { title: "Kubernetes Full Course", provider: "YouTube - TechWorld with Nana", url: "https://www.youtube.com/watch?v=X48VuDVv0do", hours: 4, cost: "free", priority: "medium" },
    ],
    "Next.js": [
      { title: "Next.js Full Course 2024", provider: "YouTube - JavaScript Mastery", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", hours: 5, cost: "free", priority: "high" },
    ],
    "Figma": [
      { title: "Figma UI Design Tutorial", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=jwCmIBJ8Jtc", hours: 3, cost: "free", priority: "medium" },
    ],
    "CI/CD": [
      { title: "GitHub Actions Full Course", provider: "YouTube - TechWorld with Nana", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", hours: 2, cost: "free", priority: "medium" },
    ],
    "Data Visualization": [
      { title: "Data Visualization with D3.js", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-visualization/", hours: 20, cost: "free", priority: "high" },
    ],
    "Pandas": [
      { title: "Pandas Full Course", provider: "YouTube - Keith Galli", url: "https://www.youtube.com/watch?v=vmEHCJofslg", hours: 2, cost: "free", priority: "high" },
    ],
    "Tableau": [
      { title: "Tableau Full Course For Beginners", provider: "YouTube - Simplilearn", url: "https://www.youtube.com/watch?v=aHaOIvR00So", hours: 6, cost: "free", priority: "high" },
    ],
    "Excel": [
      { title: "Excel Full Course for Beginners", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=Vl0H-qTclOg", hours: 3, cost: "free", priority: "high" },
    ],
    "Communication": [
      { title: "Improving Communication Skills", provider: "Coursera", url: "https://www.coursera.org/learn/wharton-communication-skills", hours: 10, cost: "free", priority: "medium" },
    ],
    "Database Design": [
      { title: "Database Design Full Course", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", hours: 8, cost: "free", priority: "critical" },
    ],
    "Authentication": [
      { title: "Web Auth Full Course (JWT, OAuth)", provider: "YouTube - The Net Ninja", url: "https://www.youtube.com/watch?v=SoAbT-KEm_c", hours: 3, cost: "free", priority: "high" },
    ],
    "Accessibility": [
      { title: "Web Accessibility Full Course", provider: "YouTube - freeCodeCamp", url: "https://www.youtube.com/watch?v=e2nkq3h1P68", hours: 2, cost: "free", priority: "medium" },
    ],
    "GraphQL": [
      { title: "GraphQL Full Course", provider: "YouTube - The Net Ninja", url: "https://www.youtube.com/watch?v=Y0lDGjwRYKw", hours: 3, cost: "free", priority: "medium" },
    ],
    "Microservices": [
      { title: "Microservices Explained", provider: "YouTube - TechWorld with Nana", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", hours: 1, cost: "free", priority: "medium" },
    ],
  }

  // Build learning paths from missing skills using real resources
  // Filter by preferred learning style
  const learningPaths: Array<{ title: string; provider: string; url: string; estimatedHours: number; cost: string; priority: "critical" | "high" | "medium"; skillsAddressed: string[]; type: string }> = []
  const usedSkills = new Set<string>()

  // Reading resources database (GeeksforGeeks, MDN, W3Schools, etc.)
  const readingDB: Record<string, Array<{ title: string; provider: string; url: string; hours: number; cost: "free"; priority: "critical" | "high" | "medium" }>> = {
    "JavaScript": [{ title: "JavaScript Tutorial - Complete Guide", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/javascript/", hours: 20, cost: "free", priority: "critical" }, { title: "MDN JavaScript Guide", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", hours: 15, cost: "free", priority: "critical" }],
    "TypeScript": [{ title: "TypeScript Handbook", provider: "TypeScript Docs", url: "https://www.typescriptlang.org/docs/handbook/", hours: 10, cost: "free", priority: "high" }],
    "React": [{ title: "React Official Tutorial", provider: "React Docs", url: "https://react.dev/learn", hours: 12, cost: "free", priority: "critical" }, { title: "React Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/react/", hours: 15, cost: "free", priority: "high" }],
    "Node.js": [{ title: "Node.js Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/nodejs/", hours: 12, cost: "free", priority: "high" }, { title: "Node.js Official Docs", provider: "Node.js", url: "https://nodejs.org/en/learn", hours: 10, cost: "free", priority: "high" }],
    "Python": [{ title: "Python Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/python-programming-language-tutorial/", hours: 20, cost: "free", priority: "critical" }, { title: "Python Official Tutorial", provider: "Python Docs", url: "https://docs.python.org/3/tutorial/", hours: 10, cost: "free", priority: "critical" }],
    "SQL": [{ title: "SQL Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/sql-tutorial/", hours: 10, cost: "free", priority: "critical" }, { title: "SQL Tutorial - W3Schools", provider: "W3Schools", url: "https://www.w3schools.com/sql/", hours: 8, cost: "free", priority: "high" }],
    "CSS": [{ title: "CSS Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/css/", hours: 12, cost: "free", priority: "high" }, { title: "CSS Reference - MDN", provider: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", hours: 10, cost: "free", priority: "high" }],
    "HTML": [{ title: "HTML Tutorial - W3Schools", provider: "W3Schools", url: "https://www.w3schools.com/html/", hours: 6, cost: "free", priority: "high" }],
    "Data Structures": [{ title: "DSA Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/data-structures/", hours: 30, cost: "free", priority: "critical" }],
    "System Design": [{ title: "System Design Primer", provider: "GitHub", url: "https://github.com/donnemartin/system-design-primer", hours: 20, cost: "free", priority: "critical" }],
    "Machine Learning": [{ title: "ML Tutorial - GeeksforGeeks", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/machine-learning/", hours: 25, cost: "free", priority: "critical" }],
    "Docker": [{ title: "Docker Docs - Get Started", provider: "Docker Docs", url: "https://docs.docker.com/get-started/", hours: 5, cost: "free", priority: "high" }],
    "Git": [{ title: "Git Tutorial - Atlassian", provider: "Atlassian", url: "https://www.atlassian.com/git/tutorials", hours: 5, cost: "free", priority: "high" }],
    "Algorithms": [{ title: "Algorithms Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/fundamentals-of-algorithms/", hours: 20, cost: "free", priority: "critical" }],
    "REST APIs": [{ title: "REST API Tutorial", provider: "REST API Tutorial", url: "https://restfulapi.net/", hours: 5, cost: "free", priority: "high" }],
    "AWS": [{ title: "AWS Documentation", provider: "AWS", url: "https://docs.aws.amazon.com/", hours: 20, cost: "free", priority: "high" }],
    "Kubernetes": [{ title: "Kubernetes Documentation", provider: "Kubernetes", url: "https://kubernetes.io/docs/home/", hours: 15, cost: "free", priority: "high" }],
    "Testing": [{ title: "Software Testing Tutorial", provider: "Guru99", url: "https://www.guru99.com/software-testing.html", hours: 10, cost: "free", priority: "high" }],
    "Responsive Design": [{ title: "Responsive Web Design Basics", provider: "web.dev", url: "https://web.dev/learn/design/", hours: 8, cost: "free", priority: "high" }],
    "Web Performance": [{ title: "Learn Web Performance", provider: "web.dev", url: "https://web.dev/learn/performance/", hours: 10, cost: "free", priority: "high" }],
    "Database Design": [{ title: "Database Design Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/database-management-system-tutorial/", hours: 15, cost: "free", priority: "high" }],
    "Microservices": [{ title: "Microservices Guide", provider: "Martin Fowler", url: "https://martinfowler.com/microservices/", hours: 5, cost: "free", priority: "high" }],
    "Statistics": [{ title: "Statistics Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/statistics/", hours: 15, cost: "free", priority: "high" }],
    "Data Visualization": [{ title: "Data Visualization Guide", provider: "Tableau", url: "https://www.tableau.com/learn/articles/data-visualization", hours: 5, cost: "free", priority: "high" }],
    "Pandas": [{ title: "Pandas User Guide", provider: "Pandas Docs", url: "https://pandas.pydata.org/docs/user_guide/index.html", hours: 10, cost: "free", priority: "high" }],
    "NumPy": [{ title: "NumPy Quickstart", provider: "NumPy Docs", url: "https://numpy.org/doc/stable/user/quickstart.html", hours: 8, cost: "free", priority: "high" }],
    "TensorFlow": [{ title: "TensorFlow Core", provider: "TensorFlow", url: "https://www.tensorflow.org/guide", hours: 15, cost: "free", priority: "high" }],
    "Deep Learning": [{ title: "Deep Learning Book", provider: "Ian Goodfellow", url: "https://www.deeplearningbook.org/", hours: 30, cost: "free", priority: "high" }],
    "NLP": [{ title: "NLP Tutorial", provider: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/natural-language-processing-nlp-tutorial/", hours: 15, cost: "free", priority: "high" }],
  }

  // Project-based resources
  const projectDB: Record<string, Array<{ title: string; provider: string; url: string; hours: number; cost: "free"; priority: "critical" | "high" | "medium" }>> = {
    "JavaScript": [{ title: "Build 30 JS Projects in 30 Days", provider: "JavaScript30", url: "https://javascript30.com/", hours: 30, cost: "free", priority: "high" }],
    "React": [{ title: "Build a Full-Stack App with React", provider: "The Odin Project", url: "https://www.theodinproject.com/paths/full-stack-javascript", hours: 60, cost: "free", priority: "critical" }],
    "Python": [{ title: "Build Python Projects - Real Python", provider: "Real Python", url: "https://realpython.com/tutorials/projects/", hours: 40, cost: "free", priority: "high" }],
    "Node.js": [{ title: "Build a REST API with Node.js", provider: "The Odin Project", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", hours: 30, cost: "free", priority: "high" }],
    "SQL": [{ title: "SQL Practice Problems - HackerRank", provider: "HackerRank", url: "https://www.hackerrank.com/domains/sql", hours: 15, cost: "free", priority: "high" }],
    "Data Structures": [{ title: "LeetCode Problem Sets", provider: "LeetCode", url: "https://leetcode.com/problemset/", hours: 50, cost: "free", priority: "critical" }, { title: "NeetCode 150 Roadmap", provider: "NeetCode", url: "https://neetcode.io/roadmap", hours: 40, cost: "free", priority: "critical" }],
    "CSS": [{ title: "100 Days CSS Challenge", provider: "100DaysCSS", url: "https://100dayscss.com/", hours: 20, cost: "free", priority: "high" }],
    "Machine Learning": [{ title: "Kaggle Competitions & Learn", provider: "Kaggle", url: "https://www.kaggle.com/learn", hours: 40, cost: "free", priority: "critical" }],
    "AWS": [{ title: "AWS Hands-on Tutorials", provider: "AWS", url: "https://aws.amazon.com/getting-started/hands-on/", hours: 20, cost: "free", priority: "high" }],
    "Kubernetes": [{ title: "Kubernetes Tutorials", provider: "Kubernetes", url: "https://kubernetes.io/docs/tutorials/", hours: 15, cost: "free", priority: "high" }],
    "REST APIs": [{ title: "Build a REST API", provider: "The Odin Project", url: "https://www.theodinproject.com/lessons/nodejs-api-basics", hours: 10, cost: "free", priority: "high" }],
    "Algorithms": [{ title: "LeetCode Problem Sets", provider: "LeetCode", url: "https://leetcode.com/problemset/", hours: 50, cost: "free", priority: "critical" }],
    "Database Design": [{ title: "Database Design Projects", provider: "HackerRank", url: "https://www.hackerrank.com/domains/sql", hours: 15, cost: "free", priority: "high" }],
    "Pandas": [{ title: "Pandas Practice", provider: "Kaggle", url: "https://www.kaggle.com/learn/pandas", hours: 10, cost: "free", priority: "high" }],
    "TensorFlow": [{ title: "TensorFlow Tutorials", provider: "TensorFlow", url: "https://www.tensorflow.org/tutorials", hours: 20, cost: "free", priority: "high" }],
  }

  const styleLower = learningStyle.toLowerCase()

  for (const skill of [...missingRequired, ...missingNice]) {
    if (learningPaths.length >= 10) break
    if (usedSkills.has(skill)) continue

    let allForSkill: Array<any> = []

    if (styleLower === "reading") {
      if (readingDB[skill]) {
        allForSkill = readingDB[skill].map(r => ({ ...r, type: "reading" }))
      } else {
        allForSkill = [{
          title: `${skill} Official Documentation & Guides`,
          provider: "Official Docs",
          url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation tutorial')}`,
          hours: 15,
          cost: "free",
          priority: "high",
          type: "reading"
        }]
      }
    } else if (styleLower === "project") {
      if (projectDB[skill]) {
        allForSkill = projectDB[skill].map(r => ({ ...r, type: "project" }))
      } else {
        allForSkill = [{
          title: `Build a Real-World ${skill} Project`,
          provider: "GitHub / Community",
          url: `https://github.com/search?q=${encodeURIComponent(skill + ' tutorial project')}`,
          hours: 40,
          cost: "free",
          priority: "high",
          type: "project"
        }]
      }
      
      // Add a YouTube video companion as requested by user
      if (resourceDB[skill]) {
        allForSkill.push({ ...resourceDB[skill][0], type: "video" })
      } else {
        allForSkill.push({
          title: `${skill} Project Tutorial for Beginners`,
          provider: "YouTube Search",
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' project tutorial')}`,
          hours: 5,
          cost: "free",
          priority: "high",
          type: "video"
        })
      }
    } else {
      if (resourceDB[skill]) {
        allForSkill = resourceDB[skill].map(r => ({ ...r, type: "video" }))
      } else {
        allForSkill = [{
          title: `${skill} Full Course for Beginners`,
          provider: "YouTube Search",
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course')}`,
          hours: 5,
          cost: "free",
          priority: "high",
          type: "video"
        }]
      }
    }
    
    // If absolutely no resources found, skip
    if (allForSkill.length === 0) continue

    for (const res of allForSkill.slice(0, 2)) {
      if (learningPaths.length >= 10) break
      learningPaths.push({
        title: res.title,
        provider: res.provider,
        url: res.url,
        estimatedHours: res.hours || res.estimatedHours || 10,
        cost: res.cost,
        priority: res.priority,
        skillsAddressed: [skill],
        type: res.type,
      })
    }
    usedSkills.add(skill)
  }

  // If we don't have enough, add generic ones
  if (learningPaths.length < 4) {
    const genericPaths = [
      { title: "CS50: Introduction to Computer Science", provider: "YouTube - Harvard", url: "https://www.youtube.com/watch?v=8mAITcNt710", estimatedHours: 24, cost: "free", priority: "high" as const, skillsAddressed: ["Computer Science Fundamentals"], type: "video" },
      { title: "The Odin Project", provider: "The Odin Project", url: "https://www.theodinproject.com/", estimatedHours: 100, cost: "free", priority: "high" as const, skillsAddressed: ["Full-Stack Development"], type: "project" },
      { title: "freeCodeCamp Full Curriculum", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/", estimatedHours: 300, cost: "free", priority: "medium" as const, skillsAddressed: ["Web Development"], type: "project" },
    ]
    for (const gp of genericPaths) {
      if (learningPaths.length >= 6) break
      learningPaths.push(gp)
    }
  }

  // Add relevant certifications based on target role
  const roleCertifications: Record<string, Array<{ title: string; provider: string; url: string; estimatedHours: number; cost: string; priority: "critical" | "high" | "medium"; skillsAddressed: string[]; type: string }>> = {
    "Software Engineer": [
      { title: "AWS Certified Cloud Practitioner", provider: "Amazon Web Services", url: "https://aws.amazon.com/certification/certified-cloud-practitioner/", estimatedHours: 40, cost: "paid", priority: "high", skillsAddressed: ["AWS", "Cloud Computing"], type: "certification" },
      { title: "Google Associate Cloud Engineer", provider: "Google Cloud", url: "https://cloud.google.com/learn/certification/cloud-engineer", estimatedHours: 60, cost: "paid", priority: "medium", skillsAddressed: ["GCP", "Cloud Infrastructure"], type: "certification" },
    ],
    "Frontend Engineer": [
      { title: "Meta Front-End Developer Certificate", provider: "Coursera / Meta", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", estimatedHours: 120, cost: "paid", priority: "high", skillsAddressed: ["React", "JavaScript", "CSS"], type: "certification" },
      { title: "Google UX Design Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-ux-design", estimatedHours: 150, cost: "paid", priority: "medium", skillsAddressed: ["UX Design", "Figma", "User Research"], type: "certification" },
      { title: "freeCodeCamp Responsive Web Design Certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", estimatedHours: 30, cost: "free", priority: "high", skillsAddressed: ["HTML", "CSS", "Responsive Design"], type: "certification" },
    ],
    "Backend Engineer": [
      { title: "AWS Certified Solutions Architect – Associate", provider: "Amazon Web Services", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", estimatedHours: 80, cost: "paid", priority: "critical", skillsAddressed: ["AWS", "System Design", "Cloud Architecture"], type: "certification" },
      { title: "MongoDB Developer Certificate", provider: "MongoDB University", url: "https://university.mongodb.com/certification", estimatedHours: 30, cost: "paid", priority: "medium", skillsAddressed: ["MongoDB", "Database Design"], type: "certification" },
    ],
    "Full-Stack Developer": [
      { title: "Meta Full-Stack Developer Certificate", provider: "Coursera / Meta", url: "https://www.coursera.org/professional-certificates/meta-back-end-developer", estimatedHours: 150, cost: "paid", priority: "high", skillsAddressed: ["Full-Stack", "React", "Python"], type: "certification" },
      { title: "freeCodeCamp Full Stack Certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", estimatedHours: 200, cost: "free", priority: "high", skillsAddressed: ["JavaScript", "Node.js", "React", "SQL"], type: "certification" },
    ],
    "Data Scientist": [
      { title: "Google Data Analytics Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-data-analytics", estimatedHours: 180, cost: "paid", priority: "critical", skillsAddressed: ["Data Analysis", "SQL", "Tableau", "R"], type: "certification" },
      { title: "IBM Data Science Professional Certificate", provider: "Coursera / IBM", url: "https://www.coursera.org/professional-certificates/ibm-data-science", estimatedHours: 200, cost: "paid", priority: "high", skillsAddressed: ["Python", "Machine Learning", "SQL"], type: "certification" },
      { title: "TensorFlow Developer Certificate", provider: "Google", url: "https://www.tensorflow.org/certificate", estimatedHours: 100, cost: "paid", priority: "medium", skillsAddressed: ["Deep Learning", "TensorFlow", "ML"], type: "certification" },
    ],
    "Data Analyst": [
      { title: "Google Data Analytics Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-data-analytics", estimatedHours: 180, cost: "paid", priority: "critical", skillsAddressed: ["Data Analysis", "SQL", "Spreadsheets", "Tableau"], type: "certification" },
      { title: "Microsoft Power BI Data Analyst", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/", estimatedHours: 60, cost: "paid", priority: "high", skillsAddressed: ["Power BI", "Data Visualization", "DAX"], type: "certification" },
      { title: "freeCodeCamp Data Analysis with Python", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/data-analysis-with-python/", estimatedHours: 40, cost: "free", priority: "high", skillsAddressed: ["Python", "Pandas", "NumPy"], type: "certification" },
    ],
  }

  const certs = roleCertifications[targetRole] || roleCertifications["Software Engineer"]
  for (const cert of certs) {
    if (learningPaths.length >= 12) break
    learningPaths.push(cert)
  }

  const timeEstimate = readinessScore >= 70 ? "1-3 months" : readinessScore >= 45 ? "3-6 months" : "6-12 months"
  const salaryRanges: Record<string, string> = {
    "Software Engineer": "$90,000 - $160,000",
    "Frontend Engineer": "$85,000 - $150,000",
    "Backend Engineer": "$90,000 - $160,000",
    "Full-Stack Developer": "$80,000 - $145,000",
    "Data Scientist": "$95,000 - $170,000",
    "Data Analyst": "$60,000 - $110,000",
  }

  return {
    readinessScore,
    summary: `Based on your ${skills.length} listed skills and ${experience} year${expYears !== 1 ? 's' : ''} of experience, you are ${readinessScore}% ready for a ${targetRole} role. ${missingRequired.length > 0 ? `Key gaps exist in ${missingRequired.slice(0, 3).join(', ')}.` : 'You have strong coverage of core requirements.'} Focus on the critical skill gaps to accelerate your readiness.`,
    targetRole,
    skillGaps,
    strengths: strengths.length > 0 ? strengths : [{ skill: "Adaptability", level: 3, relevance: "Your willingness to learn and transition shows strong growth mindset." }],
    learningPaths,
    careerInsights: {
      timeToReady: timeEstimate,
      marketDemand: "high",
      salaryRange: salaryRanges[targetRole] || "$80,000 - $140,000",
      topAdvice: missingRequired.length > 2
        ? `Focus on ${missingRequired[0]} and ${missingRequired[1]} first — these are non-negotiable for ${targetRole} interviews.`
        : `You're well-positioned. Build portfolio projects that showcase your ${matchedSkills[0] || 'skills'} in real-world contexts to stand out.`,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { skills, targetRole, experience, currentStatus, education, learningStyle } = body

    const apiKey = process.env.GEMINI_API_KEY

    // Try Gemini AI first
    if (apiKey) {
      const prompt = `You are a career intelligence AI. Analyze the skill gap for a candidate and return a JSON response.

CANDIDATE PROFILE:
- Current Skills: ${skills.join(", ")}
- Target Role: ${targetRole}
- Years of Experience: ${experience}
- Current Status: ${currentStatus}
- Education: ${education || "Not specified"}
- Preferred Learning Style: ${learningStyle}

TASK: Provide a comprehensive skill gap analysis. Return ONLY valid JSON with this exact structure (no markdown, no code fences, just raw JSON):

{
  "readinessScore": <number 0-100>,
  "summary": "<2-3 sentence executive summary of their readiness>",
  "targetRole": "${targetRole}",
  "skillGaps": [
    {
      "skill": "<skill name>",
      "currentLevel": <0-5>,
      "requiredLevel": <1-5>,
      "severity": "critical" | "high" | "medium" | "low",
      "description": "<why this skill matters for the role>"
    }
  ],
  "strengths": [
    {
      "skill": "<skill name>",
      "level": <1-5>,
      "relevance": "<how this helps for the target role>"
    }
  ],
  "learningPaths": [
    {
      "title": "<course or resource title>",
      "provider": "<platform name>",
      "type": "${learningStyle.toLowerCase()}",
      "estimatedHours": <number>,
      "priority": "critical" | "high" | "medium",
      "skillsAddressed": ["<skill1>", "<skill2>"],
      "url": "<real URL if possible, otherwise leave empty>"
    }
  ],
  "careerInsights": {
    "timeToReady": "<estimated time like '3-6 months'>",
    "marketDemand": "high" | "medium" | "low",
    "salaryRange": "<salary range for this role>",
    "topAdvice": "<one key piece of career advice>"
  }
}

Provide 5-8 skill gaps, 3-5 strengths, and 4-6 learning paths. Be specific and realistic based on industry standards. For learning paths, recommend real platforms like Coursera, Udemy, freeCodeCamp, etc.`

      const text = await callGemini(apiKey, prompt)
      if (text) {
        let cleaned = text.trim()
        if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7)
        if (cleaned.startsWith("```")) cleaned = cleaned.slice(3)
        if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3)
        cleaned = cleaned.trim()

        try {
          const analysis = JSON.parse(cleaned)
          return NextResponse.json(analysis)
        } catch (parseErr) {
          console.error("Failed to parse Gemini response:", parseErr)
        }
      }
    }

    // Fallback: intelligent rule-based analysis
    console.log("Using fallback analysis engine")
    const fallback = generateFallbackAnalysis(skills, targetRole, experience, currentStatus, learningStyle || "VIDEO")
    return NextResponse.json(fallback)

  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to process analysis" }, { status: 500 })
  }
}
