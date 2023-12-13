import './App.css'
import { Hero } from './Hero.tsx';
import { StudentCard } from './StudentCard.tsx';

function App() {

  return (
    <main>
      <Hero/>
      <div className={'m-8'}>
        <section id={'students-section'}>
          <StudentCard image={'https://avatars.githubusercontent.com/u/16097816?v=4'} name={'Juan Perez'} description={'Estudiante de Ingeniería de Sistemas'}/>
          <StudentCard image={'https://avatars.githubusercontent.com/u/16097816?v=4'} name={'Juan Perez'} description={'Estudiante de Ingeniería de Sistemas'}/>
          <StudentCard image={'https://avatars.githubusercontent.com/u/16097816?v=4'} name={'Juan Perez'} description={'Estudiante de Ingeniería de Sistemas'}/>
        </section>
      </div>

    </main>
  )
}

export default App
