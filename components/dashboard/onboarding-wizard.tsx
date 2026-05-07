"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  // State
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [targetCategory, setTargetCategory] = useState("")
  const [experience, setExperience] = useState("1")
  const [currentStatus, setCurrentStatus] = useState("EMPLOYED")
  
  const [education, setEducation] = useState("")
  const [learningStyle, setLearningStyle] = useState("VIDEO")

  // Load saved profile data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skillgap_profile")
      if (saved) {
        const data = JSON.parse(saved)
        if (data.skills?.length) setSkills(data.skills)
        if (data.targetRole) setTargetRole(data.targetRole)
        if (data.targetCategory) setTargetCategory(data.targetCategory)
        if (data.experience) setExperience(data.experience)
        if (data.currentStatus) setCurrentStatus(data.currentStatus)
        if (data.education) setEducation(data.education)
        if (data.learningStyle) setLearningStyle(data.learningStyle)
      }
    } catch {}
  }, [])

  const suggestions = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Docker", "Kubernetes",
    "AWS", "Machine Learning", "Statistics", "Pandas", "Tableau", "Figma", "User Research",
    "A/B Testing", "Excel", "Project Management", "Communication", "Leadership", "Public Speaking",
    "Writing", "C++", "Go"
  ]

  const roles = [
    { name: "Software Engineer", category: "TECH" },
    { name: "Frontend Engineer", category: "TECH" },
    { name: "Backend Engineer", category: "TECH" },
    { name: "Full-Stack Developer", category: "TECH" },
    { name: "Data Scientist", category: "TECH / ANALYTICS" },
    { name: "Data Analyst", category: "ANALYTICS" },
  ]

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleNext = () => setStep(s => Math.min(3, s + 1))
  const handlePrev = () => setStep(s => Math.max(1, s - 1))

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Save profile data to localStorage
    const profileData = { skills, targetRole, targetCategory, experience, currentStatus, education, learningStyle }
    localStorage.setItem("skillgap_profile", JSON.stringify(profileData))
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          targetRole,
          experience,
          currentStatus,
          education,
          learningStyle,
        }),
      })

      if (!res.ok) {
        throw new Error("Analysis failed")
      }

      const data = await res.json()
      
      // Save current analysis result
      sessionStorage.setItem("analysis_result", JSON.stringify(data))
      
      // Save to history in localStorage
      const historyEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        targetRole,
        readinessScore: data.readinessScore,
        skillGapsCount: data.skillGaps?.length || 0,
        strengthsCount: data.strengths?.length || 0,
        summary: data.summary,
      }
      const existingHistory = JSON.parse(localStorage.getItem("skillgap_history") || "[]")
      existingHistory.unshift(historyEntry)
      localStorage.setItem("skillgap_history", JSON.stringify(existingHistory.slice(0, 20)))
      
      // Save latest analysis for dashboard
      localStorage.setItem("skillgap_latest_analysis", JSON.stringify(data))
      
      router.push("/dashboard/analysis")
    } catch (err) {
      console.error(err)
      setIsAnalyzing(false)
      alert("Analysis failed. Please try again.")
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f9f7f2] flex flex-col text-foreground font-sans">
      {/* Analyzing Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-foreground flex items-center justify-center">
          <div className="text-center text-background">
            <div className="mb-12">
              <div className="w-16 h-16 border-2 border-background/30 border-t-background animate-spin mx-auto" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-background/50 mb-4">§ ANALYZING</div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Processing your profile...</h2>
            <p className="text-background/60 text-sm max-w-md mx-auto">Our AI is comparing your skills against industry standards for {targetRole || "your target role"}.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8 w-full flex-1 flex flex-col">
        
        {/* Progress Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-t border-border/50 pt-8">
          <div className={`transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2">
              <span className={step === 1 ? 'text-accent' : ''}>{step > 1 ? '•' : '01'}</span>
              <span className="text-foreground text-sm font-serif lowercase tracking-normal">Current skills</span>
            </div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground ml-6">
              WHAT YOU KNOW TODAY
            </div>
          </div>
          <div className={`transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2">
              <span className={step === 2 ? 'text-accent' : ''}>{step > 2 ? '•' : '02'}</span>
              <span className="text-foreground text-sm font-serif lowercase tracking-normal">Target & experience</span>
            </div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground ml-6">
              WHERE YOU'RE HEADING
            </div>
          </div>
          <div className={`transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2">
              <span className={step === 3 ? 'text-accent' : ''}>03</span>
              <span className="text-foreground text-sm font-serif lowercase tracking-normal">Context & preferences</span>
            </div>
            <div className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground ml-6">
              HELP US PERSONALIZE
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col">
          {step === 1 && (
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <h1 className="font-serif text-5xl md:text-6xl mb-4">List your current skills.</h1>
                <p className="text-muted-foreground mb-12">Type to add, or pick from suggestions. Be honest — better data, better diagnosis.</p>
                
                <div className="flex items-center border border-border/50 bg-background mb-8">
                  <input 
                    type="text" 
                    placeholder="e.g. Python, React, A/B testing" 
                    className="flex-1 bg-transparent px-4 py-4 outline-none placeholder:text-muted-foreground/50"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                  />
                  <button 
                    onClick={() => handleAddSkill(skillInput)}
                    className="bg-foreground text-background w-14 h-14 flex items-center justify-center hover:bg-foreground/90 transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="mb-12 min-h-[60px]">
                  {skills.length === 0 ? (
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono pt-4">
                      NO SKILLS YET - START TYPING OR PICK BELOW.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                         <div key={skill} className="bg-foreground text-background px-4 py-3 flex items-center gap-3 text-sm">
                           <span>{skill}</span>
                           <button onClick={() => handleRemoveSkill(skill)} className="text-muted-foreground hover:text-background transition-colors text-lg leading-none">×</button>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4 flex items-center gap-2">
                    — SUGGESTIONS
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                      <button 
                        key={suggestion}
                        onClick={() => handleAddSkill(suggestion)}
                        disabled={skills.includes(suggestion)}
                        className="border border-border/50 bg-background px-4 py-2 text-xs hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-mono"
                      >
                        <span className="text-muted-foreground">+</span> {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-[320px] shrink-0">
                <div className="bg-[#f2f0e9] border border-border/50 p-8 h-[320px] flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">TIP</div>
                    <p className="text-sm leading-relaxed opacity-80">
                      Include both hard skills (Python, SQL) and signal skills (mentoring, public speaking). Both matter for senior roles.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-3 border-t border-border/50 pt-6">
                    <span className="font-serif text-5xl">{skills.length}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">SKILLS LOGGED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <h1 className="font-serif text-5xl md:text-6xl mb-4">Your target role.</h1>
                <p className="text-muted-foreground mb-12">Pick the role you're aiming for. Search across 50+ roles and 10 industries.</p>
                
                <div className="border border-border/50 bg-background">
                  <div className="p-4 border-b border-border/50">
                    <input 
                      type="text" 
                      placeholder="Search roles..." 
                      className="w-full bg-transparent outline-none placeholder:text-muted-foreground/50 text-sm font-sans"
                    />
                  </div>
                  <div className="flex flex-col">
                    {roles.map(role => (
                      <button 
                        key={role.name}
                        onClick={() => {
                          setTargetRole(role.name)
                          setTargetCategory(role.category)
                        }}
                        className={`flex items-center justify-between p-6 border-b border-border/50 last:border-0 text-left transition-colors ${
                          targetRole === role.name ? 'bg-foreground text-background' : 'hover:bg-muted'
                        }`}
                      >
                        <span className="font-serif text-xl">{role.name}</span>
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-mono ${targetRole === role.name ? 'text-accent' : 'text-muted-foreground'}`}>
                          {role.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-8">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">YEARS OF EXPERIENCE</div>
                  <input 
                    type="number" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full border border-border/50 bg-background p-4 text-xl font-serif outline-none"
                  />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">CURRENT STATUS</div>
                  <div className="grid grid-cols-2 gap-px bg-border/50 border border-border/50">
                    {["STUDENT", "EMPLOYED", "UNEMPLOYED", "FREELANCE"].map(status => (
                      <button
                        key={status}
                        onClick={() => setCurrentStatus(status)}
                        className={`p-4 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors ${
                          currentStatus === status ? 'bg-foreground text-background' : 'bg-[#f9f7f2] hover:bg-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                {targetRole && (
                  <div className="bg-[#f2f0e9] border border-border/50 p-6 mt-auto">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">SELECTED</div>
                    <div className="font-serif text-2xl mb-1">{targetRole}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">{targetCategory}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1">
                <h1 className="font-serif text-5xl md:text-6xl mb-12">A bit more context.</h1>
                
                <div className="mb-12">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">HIGHEST EDUCATION</div>
                  <select 
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full border border-border/50 bg-background p-4 outline-none appearance-none font-sans text-sm"
                  >
                    <option value="">— select —</option>
                    <option value="highschool">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">Ph.D.</option>
                  </select>
                </div>

                <div className="mb-12">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">CERTIFICATIONS (OPTIONAL)</div>
                  <div className="flex items-center border border-border/50 bg-background">
                    <input 
                      type="text" 
                      placeholder="e.g. AWS Solutions Architect" 
                      className="flex-1 bg-transparent px-4 py-4 outline-none placeholder:text-muted-foreground/50 font-sans text-sm"
                    />
                    <button className="bg-foreground text-background px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors">
                      ADD
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">PREFERRED LEARNING STYLE</div>
                  <div className="grid grid-cols-3 gap-px bg-border/50 border border-border/50">
                    {["VIDEO", "READING", "PROJECT"].map(style => (
                      <button
                        key={style}
                        onClick={() => setLearningStyle(style)}
                        className={`p-4 text-[10px] uppercase tracking-[0.2em] font-mono transition-colors ${
                          learningStyle === style ? 'bg-accent text-background font-bold' : 'bg-background hover:bg-muted'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[400px] shrink-0">
                <div className="bg-foreground text-background p-10 min-h-[300px] flex flex-col">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono mb-8">READY TO ANALYZE</div>
                  
                  <div className="mb-12">
                    <div className="font-serif text-4xl mb-2">{targetRole || "No role selected"}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">{targetCategory || "—"}</div>
                  </div>
                  
                  <div className="border-t border-background/20 pt-8 flex items-start gap-16">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2">SKILLS</div>
                      <div className="font-serif text-3xl">{skills.length}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-2">YEARS EXP</div>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="font-serif text-3xl bg-transparent border-b border-background/30 w-16 text-background outline-none focus:border-accent transition-colors text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-border/50 flex items-center justify-between pb-12">
          {step > 1 ? (
            <button 
              onClick={handlePrev}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> BACK
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="bg-muted-foreground text-background px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-foreground transition-colors flex items-center gap-2"
            >
              CONTINUE <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button 
              onClick={handleRunAnalysis}
              className="bg-accent text-background px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-accent/90 transition-colors flex items-center gap-2 font-bold"
            >
              RUN ANALYSIS <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
