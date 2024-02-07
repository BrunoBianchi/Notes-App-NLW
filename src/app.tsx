import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string,
  date: Date,
  content: string
}

export default function App() {
  const [search,setSearch] = useState('')
  const [notes, setNote] = useState<Note[]>(() => {

    const notesOnStorage = localStorage.getItem('notes') 
    if( notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }else return []


  })

  function onNoteCreated(content: string) {
    
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes];

    setNote([newNote, ...notes]);

    localStorage.setItem('notes', JSON.stringify(notesArray));

  }
  function onNoteDeleted(id:string) {
    const notesArray = notes.filter(note=>{return note.id != id});
    setNote(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));

  }

  function handleSearch(event:ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearch(query);
  }

  const filteredNotes = search != ''?notes.filter(note=>{return note.content.toLowerCase().includes(search.toLowerCase())}):notes;

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 '>
      <img src={logo} alt='nlw expert'></img>

      <form className='w-full'>
        <input
          type='text'
          placeholder='Busque suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        >
        </input>
      </form>
      <div className='h-px bg-slate-700'></div>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        <NewNoteCard  onNoteCreated={onNoteCreated} />

        { filteredNotes.map(note => { return <NoteCard onNoteDeleted={onNoteDeleted} key={note.id} note={note} /> })}


      </div>
    </div>

  )
}

