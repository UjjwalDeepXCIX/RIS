import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: 'Resumind | Review ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const navigate = useNavigate();
    const [jobLink, setJobLink] = useState<string>('');

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);
            const jobLink = data.jobLink;
            setJobLink(jobLink || '');

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            const raw = data.feedback;

            if (!raw) {
            console.error("Missing feedback:", raw);
            return;
            }

            // ✅ universal mapper (handles both formats)
            const mapSection = (section: any) => ({
            score: section?.score ?? 0,
            tips: (section?.tips || []).map((tip: any) => ({
                type: tip.type || "improve",
                tip: tip.text || tip.tip || "",// handles both formats
            })),
            });

            let normalizedFeedback: Feedback;

            // 🔥 CASE 1: New correct format (what you just showed)
            if (raw.ATS || raw.toneAndStyle) {
            normalizedFeedback = {
                overallScore:
                raw.overallScore ??
                Math.round(
                    [
                    raw.ATS,
                    raw.toneAndStyle,
                    raw.content,
                    raw.structure,
                    raw.skills,
                    ]
                    .filter(Boolean)
                    .reduce((acc: number, sec: any) => acc + (sec.score || 0), 0) / 5
                ),

                ATS: mapSection(raw.ATS),
                toneAndStyle: mapSection(raw.toneAndStyle),
                content: mapSection(raw.content),
                structure: mapSection(raw.structure),
                skills: mapSection(raw.skills),
            };
            }

            // 🔥 CASE 2: Old sections[] format (fallback safety)
            else if (raw.sections) {
            const sectionsMap: any = {};

            raw.sections.forEach((section: any) => {
                const key = section.name.toLowerCase();

                if (key.includes("format")) sectionsMap.ATS = section;
                else if (key.includes("summary")) sectionsMap.toneAndStyle = section;
                else if (key.includes("experience")) sectionsMap.content = section;
                else if (key.includes("skill")) sectionsMap.skills = section;
            });

            sectionsMap.structure = sectionsMap.structure || { score: 0, tips: [] };

            normalizedFeedback = {
                overallScore: raw.overall_score ?? 0,

                ATS: mapSection(sectionsMap.ATS),
                toneAndStyle: mapSection(sectionsMap.toneAndStyle),
                content: mapSection(sectionsMap.content),
                structure: mapSection(sectionsMap.structure),
                skills: mapSection(sectionsMap.skills),
            };
            }

            // ❌ unknown format
            else {
            console.error("Unknown feedback format:", raw);
            return;
            }

            setFeedback(normalizedFeedback);
            if (!raw) {
                console.error("Missing feedback:", raw);
                return;
            }
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
            console.log("✅ NORMALIZED:", normalizedFeedback);
            console.log("📦 RAW:", raw);
            console.log("TIPS:", normalizedFeedback.toneAndStyle.tips);
        }

        loadResume();
    }, [id]);

    return (
        <main className="!pt-0">
            <nav className="w-full flex justify-center pt-4 pb-2 sticky top-0 z-50">
            <div className="flex items-center justify-between w-full max-w-[1100px] px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

                <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97]">
                <img src="/icons/back.svg" alt="back" className="w-3 h-3 opacity-80" />
                Back
                </Link>

                <div className="text-sm text-gray-400">
                Resume Analysis
                </div>

                {/* spacer for symmetry */}
                <div className="w-[60px]" />

            </div>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse gap-6 px-6">
                <section className="feedback-section bg-cover h-[100vh] sticky top-56 flex flex-col items-center justify-center px-4">

                        {/* Resume Preview */}
                        {imageUrl && resumeUrl && (
                            <div className="animate-in fade-in duration-1000 p-2 
                            shadow-[0_20px_80px_rgba(0,0,0,0.7)] 
                            backdrop-blur-xl bg-white/5 border border-white/10 
                            rounded-2xl gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">

                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                title="resume"
                                />
                            </a>
                            </div>
                        )}

                        {/* 🔥 Job Link Panel */}
                        <div className="mt-6 w-full flex justify-center">
                            {jobLink ? (
                            <div className="group relative w-full max-w-md p-[1px] rounded-2xl 
                                bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 
                                shadow-[0_20px_80px_rgba(0,0,0,0.6)]">

                                <div className="flex items-center justify-between gap-4 
                                bg-black/60 backdrop-blur-xl rounded-2xl p-4">

                                {/* Left Content */}
                                <div className="flex flex-col">
                                    <p className="text-[10px] tracking-widest uppercase text-gray-400">
                                    Job Context
                                    </p>

                                    <p className="text-sm text-gray-200 font-medium leading-tight">
                                    Optimized against a real job posting
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                    {jobLink && new URL(jobLink).hostname.replace("www.", "")}
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <a
                                    href={jobLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative inline-flex items-center gap-2 px-4 py-2 
                                    rounded-lg text-sm font-medium text-white 
                                    bg-gradient-to-r from-indigo-500 to-blue-500 
                                    hover:from-indigo-400 hover:to-blue-400 
                                    transition-all duration-300 
                                    hover:scale-[1.05] active:scale-[0.96]"
                                >
                                    View Job
                                    <span className="text-xs transition-transform group-hover:translate-x-1">
                                    ↗
                                    </span>
                                </a>
                                </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-30 
                    bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 
                    -z-10 group-hover:opacity-50 transition"></div>
                </div>
                ) : (
                <div className="w-full max-w-md p-4 rounded-2xl 
                    bg-white/5 border border-white/10 backdrop-blur-xl 
                    text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)]">

                    <p className="text-sm text-gray-400 italic">
                    No job link provided
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                    Analysis is based on general ATS best practices
                    </p>
                </div>
                )}
            </div>

            </section>
                <section className="feedback-section">
                    <div className="flex flex-col gap-1 mb-4">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight bg-linear-to-r from-indigo-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
                        Resume Analysis
                        </h2>

                        <p className="text-sm text-gray-400">
                            AI-powered insights to improve your resume performance
                        </p>
                        </div>
                        
                        
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback} />
                            <ATS score={feedback.ATS?.score || 0} suggestions={feedback.ATS?.tips || []} />
                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume