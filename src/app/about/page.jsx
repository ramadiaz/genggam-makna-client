import { FlipWords } from "@/components/ui/flip-words"
import { FocusCards } from "@/components/ui/focus-cards";

const Page = () => {
    const words = ["care", "hope", "love", "unity"];

    const cards = [
        {
          title: "John Alessandro Jong",
          role: "Machine Learning",
          src: "/images/team/john.jpg",
        },
        {
          title: "Kevin Sipahutar",
          role: "Cloud Computing",
          src: "/images/team/kevin.png",
        },
        {
          title: "Rama Diaz",
          role: "Cloud Computing",
          src: "/images/team/rama.jpg",
        },
        {
          title: "Yulianto Aryaseta",
          role: "Machine Learning",
          src: "/images/team/seta.jpg",
        },
      ];

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto space-y-48">
                <div className="flex flex-col justify-center items-center mt-[15vh] p-4 space-y-4">
                    <div className="max-w-2xl text-neutral-800">
                        <div className="text-4xl sm:text-5xl text-333 font-acorn">
                            Empower
                            <FlipWords words={words} /> <br />
                            with{" "}
                            <span className="font-acorn">
                                Genggam Makna
                            </span>
                        </div>
                        <div className="mt-3 text-sm">
                            <h3 className="text-start">
                                Genggam Makna is an innovative AI-powered platform designed to bridge the communication gap between the hearing and speech-impaired community and the wider world. Our mission is to empower inclusivity by providing a tool that translates SIBI (Indonesian Sign Language) hand signs into the alphabet in real time.
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-4xl sm:text-5xl text-333 font-acorn text-center">Meet Our Team</h2>
                    <FocusCards cards={cards}/>
                </div>
            </div>
        </div>
    )
}

export default Page