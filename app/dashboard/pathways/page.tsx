"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, TrendingUp, DollarSign, Code2, BarChart3, Palette, Shield, Brain, Database } from "lucide-react"

const careers = [
  {
    title: "Software Engineer",
    category: "ENGINEERING",
    icon: Code2,
    demand: "Very High",
    avgSalary: "$110,000 - $180,000",
    growth: "+25%",
    description: "Design, develop, and maintain software systems. One of the most in-demand roles globally.",
    topSkills: ["JavaScript", "Python", "System Design", "Data Structures", "Cloud (AWS/GCP)", "Git"],
    certifications: ["AWS Solutions Architect", "Google Cloud Professional"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/software-engineer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-software-engineer-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/software-engineer-jobs-SRCH_KO0,17.htm" },
    ],
  },
  {
    title: "Frontend Engineer",
    category: "ENGINEERING",
    icon: Palette,
    demand: "High",
    avgSalary: "$95,000 - $160,000",
    growth: "+20%",
    description: "Build user interfaces and interactive web applications. Critical for product-focused companies.",
    topSkills: ["React", "TypeScript", "CSS/Tailwind", "Next.js", "Accessibility", "Performance"],
    certifications: ["Meta Front-End Developer", "freeCodeCamp Responsive Web Design"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/frontend-developer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-frontend-developer-jobs.html" },
      { name: "AngelList", url: "https://wellfound.com/role/frontend-engineer" },
    ],
  },
  {
    title: "Backend Engineer",
    category: "ENGINEERING",
    icon: Database,
    demand: "High",
    avgSalary: "$100,000 - $170,000",
    growth: "+22%",
    description: "Build server-side logic, APIs, and database architectures that power applications.",
    topSkills: ["Node.js / Python / Go", "SQL & NoSQL", "REST/GraphQL APIs", "Docker", "Cloud Services", "System Design"],
    certifications: ["AWS Solutions Architect", "MongoDB Developer Certificate"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/backend-developer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-backend-developer-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/backend-engineer-jobs-SRCH_KO0,16.htm" },
    ],
  },
  {
    title: "Full-Stack Developer",
    category: "ENGINEERING",
    icon: Code2,
    demand: "Very High",
    avgSalary: "$90,000 - $155,000",
    growth: "+24%",
    description: "Handle both frontend and backend development. Highly versatile and sought after by startups.",
    topSkills: ["React", "Node.js", "TypeScript", "SQL", "Git", "DevOps basics"],
    certifications: ["Meta Full-Stack Developer", "freeCodeCamp Full Stack Certification"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/full-stack-developer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-full-stack-developer-jobs.html" },
      { name: "AngelList", url: "https://wellfound.com/role/full-stack-engineer" },
    ],
  },
  {
    title: "Data Scientist",
    category: "DATA & AI",
    icon: Brain,
    demand: "Very High",
    avgSalary: "$120,000 - $190,000",
    growth: "+36%",
    description: "Analyze complex datasets, build ML models, and drive business decisions through data insights.",
    topSkills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow/PyTorch", "Data Visualization"],
    certifications: ["Google Data Analytics", "IBM Data Science", "TensorFlow Developer"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/data-scientist-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-data-scientist-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/data-scientist-jobs-SRCH_KO0,14.htm" },
    ],
  },
  {
    title: "Data Analyst",
    category: "DATA & AI",
    icon: BarChart3,
    demand: "High",
    avgSalary: "$65,000 - $110,000",
    growth: "+23%",
    description: "Transform raw data into actionable insights. Strong entry point into the data field.",
    topSkills: ["SQL", "Excel", "Tableau/Power BI", "Python", "Statistics", "Communication"],
    certifications: ["Google Data Analytics", "Microsoft Power BI Data Analyst"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/data-analyst-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-data-analyst-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/data-analyst-jobs-SRCH_KO0,12.htm" },
    ],
  },
  {
    title: "AI/ML Engineer",
    category: "DATA & AI",
    icon: Brain,
    demand: "Extremely High",
    avgSalary: "$130,000 - $220,000",
    growth: "+40%",
    description: "Build and deploy machine learning models and AI systems. The fastest-growing tech role.",
    topSkills: ["Python", "PyTorch/TensorFlow", "MLOps", "NLP", "Computer Vision", "Cloud AI Services"],
    certifications: ["TensorFlow Developer", "AWS ML Specialty", "Google ML Engineer"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/machine-learning-engineer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-machine-learning-engineer-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/ml-engineer-jobs-SRCH_KO0,11.htm" },
    ],
  },
  {
    title: "DevOps Engineer",
    category: "INFRASTRUCTURE",
    icon: Shield,
    demand: "High",
    avgSalary: "$105,000 - $175,000",
    growth: "+21%",
    description: "Automate infrastructure, manage CI/CD pipelines, and ensure system reliability at scale.",
    topSkills: ["Docker", "Kubernetes", "CI/CD", "AWS/GCP/Azure", "Terraform", "Linux"],
    certifications: ["AWS DevOps Engineer", "Kubernetes CKA", "HashiCorp Terraform Associate"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/devops-engineer-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-devops-engineer-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/devops-engineer-jobs-SRCH_KO0,15.htm" },
    ],
  },
  {
    title: "Cybersecurity Analyst",
    category: "SECURITY",
    icon: Shield,
    demand: "Very High",
    avgSalary: "$85,000 - $150,000",
    growth: "+33%",
    description: "Protect organizations from cyber threats. One of the most critical and understaffed fields.",
    topSkills: ["Network Security", "SIEM Tools", "Python", "Penetration Testing", "Risk Assessment", "Compliance"],
    certifications: ["CompTIA Security+", "CISSP", "CEH (Certified Ethical Hacker)"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/cybersecurity-analyst-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-cybersecurity-analyst-jobs.html" },
      { name: "CyberSecJobs", url: "https://www.cybersecjobs.com/" },
    ],
  },
  {
    title: "Product Manager",
    category: "PRODUCT",
    icon: TrendingUp,
    demand: "High",
    avgSalary: "$110,000 - $180,000",
    growth: "+18%",
    description: "Define product vision, prioritize features, and work across engineering, design, and business teams.",
    topSkills: ["Product Strategy", "Data Analysis", "User Research", "A/B Testing", "SQL", "Communication"],
    certifications: ["Google PM Certificate", "Product School Certification"],
    applyLinks: [
      { name: "LinkedIn", url: "https://www.linkedin.com/jobs/product-manager-jobs/" },
      { name: "Indeed", url: "https://www.indeed.com/q-product-manager-jobs.html" },
      { name: "Glassdoor", url: "https://www.glassdoor.com/Job/product-manager-jobs-SRCH_KO0,15.htm" },
    ],
  },
]

export default function PathwaysPage() {
  const [filter, setFilter] = useState("ALL")
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skillgap_profile")
      if (saved) {
        const data = JSON.parse(saved)
        if (data.targetRole) {
          const matchedCareer = careers.find(c => c.title.toLowerCase() === data.targetRole.toLowerCase())
          if (matchedCareer) {
            setFilter(matchedCareer.category)
          }
        }
      }
    } catch {}
  }, [])

  const categories = ["ALL", ...Array.from(new Set(careers.map(c => c.category)))]
  const filtered = filter === "ALL" ? careers : careers.filter(c => c.category === filter)

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        
        <div className="mb-4">
          <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-8">
            <ArrowLeft className="w-3 h-3" /> BACK TO DASHBOARD
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6">
              § CAREER PATHWAYS
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-none mb-4">
              Explore roles.
            </h1>
            <p className="text-muted-foreground max-w-lg">The most in-demand tech careers right now — with salary data, required skills, and direct links to apply.</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap mb-12 border-b border-border pb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors ${
                filter === cat
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Career Cards */}
        <div className="space-y-px">
          {filtered.map((career, i) => (
            <div key={i} className="bg-background border border-border p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <career.icon className="w-5 h-5 text-accent" />
                    <h2 className="font-serif text-2xl md:text-3xl">{career.title}</h2>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">{career.category}</span>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{career.description}</p>
                  
                  {/* Stats Row */}
                  <div className="flex gap-8 flex-wrap mb-6">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">DEMAND</div>
                      <div className={`text-sm font-mono font-bold ${
                        career.demand.includes('Extremely') ? 'text-red-600' : career.demand.includes('Very') ? 'text-accent' : 'text-green-600'
                      }`}>{career.demand}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">SALARY</div>
                      <div className="text-sm font-mono font-bold">{career.avgSalary}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">JOB GROWTH</div>
                      <div className="text-sm font-mono font-bold text-green-600">{career.growth}</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">TOP SKILLS REQUIRED</div>
                    <div className="flex flex-wrap gap-2">
                      {career.topSkills.map((skill, j) => (
                        <span key={j} className="border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] font-mono bg-muted/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">RECOMMENDED CERTIFICATIONS</div>
                    <div className="flex flex-wrap gap-2">
                      {career.certifications.map((cert, j) => (
                        <span key={j} className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] font-mono">
                          🎓 {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Apply Links */}
                <div className="lg:w-[240px] shrink-0 flex flex-col gap-3">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">APPLY NOW</div>
                  {career.applyLinks.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between bg-foreground text-background px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ))}
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center justify-between border border-border px-5 py-3.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors mt-2"
                  >
                    <span>CHECK MY FIT</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
