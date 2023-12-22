import './App.css'
import { Hero } from './Hero.tsx';
import { StudentCard } from './StudentCard.tsx';
import studentsJSON from './assets/entries.json';
function App() {
  const students = studentsJSON as Array<{image: string, name: string, description: string}>;
  return (
    <main>
      <Hero/>
      <div className={'m-8'}>
        <section id={'students-section'}>
          {students.map((student) => (
            <StudentCard key={crypto.randomUUID()} {...student}/>
          ))}
        </section>
      </div>

    </main>
  )
}

export default App
