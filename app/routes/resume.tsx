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

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

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

            const mapSection = (section: any) => ({
            score: section?.score ?? 0,
            tips: (section?.tips || []).map((tip: string) => ({
                type: "improve",
                tip,
            })),
            });

            // compute overall score
            const sections = Object.values(raw);

            const overallScore = sections.length
            ? Math.round(
                sections.reduce((acc: number, sec: any) => acc + (sec.score || 0), 0) /
                sections.length
                )
            : 0;

            const normalizedFeedback: Feedback = {
            overallScore,

            ATS: mapSection(raw.formatting),
            toneAndStyle: mapSection(raw.summary),
            content: mapSection(raw.experience),
            structure: mapSection(raw.education),
            skills: mapSection(raw.skills),
};

            setFeedback(normalizedFeedback);
            if (!raw) {
                console.error("Missing feedback:", raw);
                return;
            }
            console.log({resumeUrl, imageUrl, feedback: data.feedback });
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
                <section className="feedback-section bg-[url('/images/auth.png') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 p-2 shadow-[0_20px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl  gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    className="w-full h-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    )}
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