import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants/index";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        console.log("[Upload] File selected:", file);
        setFile(file)
    }

const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
    try {
        console.log("[Upload] Starting analysis", { companyName, jobTitle });

        setIsProcessing(true);

        setStatusText('Uploading the file...');
        console.log("[Upload] Uploading PDF...");
        const uploadedFile = await fs.upload([file]);

        if(!uploadedFile) {
            console.error("[Upload] File upload failed");
            return setStatusText('Error: Failed to upload file');
        }

        console.log("[Upload] File uploaded:", uploadedFile);

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);

        if(!imageFile.file) {
            console.error("[Upload] PDF conversion failed:", imageFile.error);
            return setStatusText('Error: Failed to convert PDF to image');
        }

        console.log("[Upload] Image created:", imageFile.file);

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile.file]);

        if(!uploadedImage) {
            console.error("[Upload] Image upload failed");
            return setStatusText('Error: Failed to upload image');
        }

        console.log("[Upload] Image uploaded:", uploadedImage);

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        console.log("[Upload] Generated UUID:", uuid);
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        console.log("[Upload] Data saved to KV (initial)");

        setStatusText('Analyzing...');
        console.log("[Upload] Sending to AI...");

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )

        if (!feedback) {
            console.error("[Upload] AI feedback failed");
            return setStatusText('Error: Failed to analyze resume');
        }

        console.log("[Upload] Raw AI response:", feedback);

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        console.log("[Upload] Extracted feedback text:", feedbackText);

        data.feedback = JSON.parse(feedbackText);

        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        console.log("[Upload] Final data saved to KV");

        setStatusText('Analysis complete, redirecting...');
        console.log("[Upload] Navigation to:", `/resume/${uuid}`);

        navigate(`/resume/${uuid}`);

    } catch (err) {
        console.error("[Upload] Unexpected error:", err);
        setStatusText('Unexpected error occurred');
    }
}
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[Upload] Form submitted");

    const form = e.currentTarget.closest('form');
    if(!form) {
        console.error("[Upload] Form not found");
        return;
    }

    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    console.log("[Upload] Form data:", { companyName, jobTitle });

    if(!file) {
        console.warn("[Upload] No file selected");
        return;
    }

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
}
    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload