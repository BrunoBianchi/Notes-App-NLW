import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void;
}
export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeechAvailable, setIsSpeechAvailable] = useState(Boolean);

    let SpeechRecognition:SpeechRecognition |null = null;

    function handleStartEditor() {
        setShouldShowOnBoarding(false);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        if (event.target.value.length <= 0) {
            setShouldShowOnBoarding(true);
        }
        setContent(event.target.value);
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();
        if (content == '') return;
        toast.success('Nota Criada Com Sucesso!');
        onNoteCreated(content);
        setContent('');
        setShouldShowOnBoarding(true)
    }

    function handleStartRecord() {
       
        const isSpeechRecognitionApiAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
        if (!isSpeechRecognitionApiAvailable) {
            setIsSpeechAvailable(isSpeechRecognitionApiAvailable);
            return;
        } else {
            setIsSpeechAvailable(true);

            const speechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

            SpeechRecognition = new speechRecognitionApi();
            SpeechRecognition.lang = 'pt-BR';
            SpeechRecognition.continuous = true;
            SpeechRecognition.maxAlternatives = 1;
            SpeechRecognition.interimResults = true;

            SpeechRecognition.onresult = (event) =>{
                const transcription = Array.from(event.results).reduce((text,result)=>{
                    return text.concat(result[0].transcript);
                },'')
                setContent(transcription);
            }
            SpeechRecognition.onerror= (event)=>{
                console.log(event)
            }
            SpeechRecognition.start();
        }
        setIsRecording(true);
        setShouldShowOnBoarding(false);

    }

    function handleStopRecording() {
        setIsRecording(false);
        SpeechRecognition?.stop();
        if (content == '') return;
        toast.success('Nota Criada Com Sucesso!');
        onNoteCreated(content);
        setContent('');
        setShouldShowOnBoarding(true)
    }
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md bg-slate-700 p-5 space-y-3 overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>Adicionar Nota</span>
                <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none ">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    <form className="flex-1 flex flex-col">

                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className='text-sm font-medium text-slate-300'>
                                Adicionar Nota
                            </span>
                            {shouldShowOnBoarding ? (<p className='text-sm leading-6 text-slate-400'>
                                Comece <button type="button" onClick={handleStartRecord} className="font-medium text-lime-400 hover:text-lime-500">gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className="font-medium text-lime-400 hover:text-lime-500">utilize apenas texto</button>.
                            </p>) : (
                                <textarea
                                    value={content}
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChanged}
                                >
                                </textarea>
                            )}
                            {isRecording && !isSpeechAvailable ? (
                                <span className="text-red-500">Infelizmente seu navegador nao suporta essa feature!</span>
                            ) : (
                                <div> </div>
                            )}

                        </div>
                        {isRecording ? (
                            <button
                                type='button'
                                className="flex items-center justify-center gap-2 w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100  "
                                onClick={handleStopRecording}
                            >
                                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                Gravando ! (clique para interromper)
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveNote}
                                type='submit'
                                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500  "
                            >
                                Salvar nota
                            </button>
                        )}


                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>

    )
}