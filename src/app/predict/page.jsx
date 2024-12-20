'use client'

import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect, useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GetUserData } from "@/utilities/getUserData";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/tabs";
import { ArrowsClockwise, ArrowUpRight } from "@phosphor-icons/react";
import fetchWithAuth from "@/utilities/fetchWithAuth";
import { BASE_API } from "@/utilities/environment";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

const Page = () => {
    const [userData, setUserData] = useState({})
    const [currentType, setCurrentType] = useState("image")
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [currentProgress, setCurrentProgress] = useState(0)
    const [result, setResult] = useState({})
    const [modelType, setModelType] = useState("sibi")
    const router = useRouter()

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleFileUpload = (files) => {
        setFiles(files);
    };

    const handleError = (message) => {
        toast.error(message)
    }

    useEffect(() => {
        const user_data = GetUserData()
        setUserData(user_data)
    }, [])

    useEffect(() => {
        setFiles([])
    }, [currentType])

    const loadingStates = [
        { text: "Preparing for file upload" },
        { text: "Awaiting server response" },
        { text: "File is being uploaded" },
        { text: "Processing SIBI prediction" },
        { text: "SIBI prediction completed successfully" }
    ];

    const handlePredict = async () => {
        if (!predictValidation()) {
            return
        }

        setIsLoading(true)

        const formData = new FormData()
        formData.append(currentType, files)

        await new Promise(resolve => setTimeout(resolve, 100));
        setCurrentProgress(1)
        await new Promise(resolve => setTimeout(resolve, 100));
        setCurrentProgress(2)
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const res = await fetchWithAuth(BASE_API + `/predict/${modelType}/${currentType}`, {
                method: "POST",
                body: formData,
            })
            setCurrentProgress(3)

            if (res.ok) {
                setCurrentProgress(4)
                const data = await res.json()
                setResult(data.body)
                await new Promise(resolve => setTimeout(resolve, 1000));
                onOpen()
                toast.success("Prediction successful!")
            } else {
                toast.error("Something went wrong!")
            }
        } catch (err) {
            toast.error("Connection error!")
        } finally {
            setCurrentProgress(0)
            setIsLoading(false)
        }
    }

    const predictValidation = () => {
        if (files.length === 0) {
            toast.error("Please select a file to predict!")
            return false
        }

        return true
    }

    const tabs = [
        {
            title: "Image",
            value: "image",
            content: (
                <div className="w-full overflow-hidden relative h-max rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-sky-300 to-blue-500">
                    <p className="font-acorn">Image Predict</p>
                    <div
                        className="mt-8 w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-xl">
                        <FileUpload onChange={handleFileUpload} onError={handleError} />
                    </div>
                </div>
            ),
        },
        {
            title: "Video",
            value: "video",
            content: (
                <div className="w-full overflow-hidden relative h-max rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-sky-300 to-blue-500">
                    <p className="font-acorn">Video Predict</p>
                    <div
                        className="mt-8 w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-xl">
                        <FileUpload onChange={handleFileUpload} onError={handleError} currentFormat="video" />
                    </div>
                </div>
            ),
        },
    ];

    const handleModelChange = () => {
        modelType === "bisindo" ? setModelType("sibi") : setModelType("bisindo")
    }

    const ModelChangeToggle = () => {
        return (
            <Button className="bg-gradient-to-tl from-sky-300 to-blue-500 rounded-full text-sm font-semibold text-white" onClick={handleModelChange}>
                <ArrowsClockwise size={24} color="#fff" />
                {modelType === "sibi" ? "BISINDO" : "SIBI"}
            </Button>
        )
    }

    return (
        <div className="p-8 text-333">
            <button className="text-xs font-semibold text-333 flex flex-row gap-2 items-center sm:hidden" onClick={handleModelChange} variant="light">
                <ArrowsClockwise size={24} color="#000" />
                {modelType === "sibi" ? "BISINDO" : "SIBI"}
            </button>
            <div className="w-full sm:w-max mx-auto">
                <h1 className="font-acorn text-center text-2xl sm:text-5xl sm:mt-10 mt-5">
                    Predict <span className="uppercase" >{modelType}</span> Hand Signs
                </h1>
                <h3 className="text-sm text-center">
                    Upload an image or video of <span className="uppercase" >{modelType}</span> hand signs to translate it into text.
                </h3>
            </div>
            <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full mt-4 items-start justify-start">
                <Tabs
                    onChange={setCurrentType}
                    tabs={tabs}
                    modelChangeToggle={<ModelChangeToggle />}
                    predictButton={userData.id ? (
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            onClick={handlePredict}
                            className="bg-blue-50 text-[#333333] flex items-center space-x-2 shadow-lg hover:scale-105 transition-all duration-400"
                        >
                            <span className="text-[#333333] font-acorn text-lg px-3" variant="light">Predict </span>
                        </HoverBorderGradient>
                    ) : (
                        (
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                onClick={() => router.push("/auth/login")}
                                className="bg-blue-50 text-[#333333] flex items-center space-x-2 shadow-lg hover:scale-105 transition-all duration-400"
                            >
                                <span className="text-[#333333] font-acorn text-lg px-3 md:hidden block" variant="light">Login </span>
                                <span className="text-[#333333] font-acorn text-lg px-3 md:block hidden" variant="light">Login to Start </span>
                                <ArrowUpRight size={24} />
                            </HoverBorderGradient>
                        )
                    )} />
            </div>
            <MultiStepLoader loadingStates={loadingStates} loading={isLoading} currentState={currentProgress} />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Predict Result</ModalHeader>
                            <ModalBody>
                                <div className="font-semibold text-center text-4xl">
                                    {result.predicted_alphabet}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-gradient-to-tl from-sky-300 to-sky-500 text-white" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page