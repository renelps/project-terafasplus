'use client'

import { Textarea } from "@/components/textarea"
import styled from "styled-components"
import { FaTrash } from "react-icons/fa"
import { FiShare2 } from "react-icons/fi"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { db } from "../../services/firebase/firebaseConnection";
import { 
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from "firebase/firestore"
import Link from "next/link"
const Container = styled.div`
  width: 100%;
`
const Main = styled.main``
const Content = styled.section`
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;

  h2 {
    color: white;
    margin-bottom: 8px;
  }
`
const ContentForm = styled.div`
  max-width: 1024px;
  width: 100%;
  padding: 0 18px;
  padding-bottom: 28px;
  margin-top: 58px;

  button {
    width: 100%;
    color: white;
    background: #3183ff;
    border: none;
    height: 30px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
  }
`

const CheckBoxArea = styled.div`
  padding: 7px 0 15px 0;

  input {
    width: 18px;
    height: 18px;
  }
  label {
    color: white;
    padding-left: 5px;
    font-weight: 600;
  }
`

const TaskContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin: 34px auto 0 auto;
  padding: 0 18px;
  max-width: 1024px;
  width: 100%;

  h2 {
    text-align: center;
    font-size: 30px;
    margin-bottom: 15px;
  }

  a {
    text-decoration: none;
    color: #0f0f0f;
  }

  > article {
    display: flex;
    flex-direction: column;
    border: 1.5px solid #909090;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 14px;
    border-radius: 4px;
    line-height: 150%;
    padding: 14px
  }
`

const TagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;

  > label {
    background-color: #3183ff;
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 4px;
    color: white;
  }

  > button {
    margin: 0 8px;
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
`

const TaskContent = styled.div` 
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > p {
    white-space: pre-wrap;
  }

  > button {
    background: transparent;
    border: none;
    cursor: pointer;
    margin: 0 8px;
  }
`

interface HomeProps {
  user: {
    email: string;
  }
}

interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  task: string;
  user: string;
}

export default function DashboardClient({ user }: HomeProps) {
  const [input, setInput] = useState("")
  const [publicTask, setPublicTask] = useState(false)
  const [tasks, setTasks] = useState<TasksProps[]>([])

  useEffect(() => {
    async function loadTasks() {
      const taskRef = collection(db, "tasks")
      const q = query(
        taskRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      )

      onSnapshot(q, (snapshot) => {
        const list = [] as TasksProps[]

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            created: doc.data().created,
            user: doc.data().user,
            task: doc.data().task,
            public: doc.data().public,
          })
        })

        setTasks(list)
        console.log(list)
      })  
    }

    loadTasks();
  }, [user?.email])

  async function handleRegisterTask(event: FormEvent){
    event.preventDefault();

    if(input === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        created: new Date(),
        user: user?.email,
        public: publicTask
      })

      setInput("")
      setPublicTask(false)
    }catch(err) {
      console.log(err)
    }

  }
  
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked)
  }

  async function handleShare(id: string){
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    )
  }
  
  async function handleDeleteTask(id: string){
    const docRef = doc(db, "tasks", id)

    await deleteDoc(docRef)
  }


  return (
    <Container>
      <Main>
        <Content>
          <ContentForm>
            <h2>Qual é sua tarefa</h2>
            <form onSubmit={handleRegisterTask}>
              <Textarea 
                placeholder="Digite sua tarefa"
                value={input}
                onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value) }
              />
              <CheckBoxArea>
                <input 
                  type="checkbox"
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar a tarefa pública</label>
              </CheckBoxArea>

              <button type="submit">
                Registrar
              </button>
            </form>
          </ContentForm>
        </Content>

        <TaskContainer>
          <h2>Minhas tarefas</h2>

          {tasks.map((item) => (
            <article key={item.id}>
              {item.public && (
                <TagContainer>
                  <label>PUBLICO</label>
                  <button onClick={ () => handleShare(item.id)}>
                    <FiShare2
                      size={22}
                      color="#3183ff"
                    />
                  </button>
                </TagContainer>
              )}

              <TaskContent>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.task}</p>
                  </Link>
                ): (
                  <p>{item.task}</p>
                )
                }
                <button onClick={ () => handleDeleteTask(item.id)}>
                  <FaTrash 
                    size={22}
                    color="#ea3140"
                  />
                </button>
              </TaskContent>
            </article>
          ))}
        </TaskContainer>
      </Main>
    </Container>
  )
}