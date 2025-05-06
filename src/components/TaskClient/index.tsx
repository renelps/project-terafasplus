'use client';

import styled from "styled-components";
import { Textarea } from "../textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { Session } from "next-auth";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/services/firebase/firebaseConnection";
import { CommentsProps } from "@/app/task/[id]/page";
import { FaTrash } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 40px auto 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;


  > main {
    width: 100%;

    h2 {
      margin-bottom: 14px;
    }

    article {
    border: 1.5px solid #909090;
    padding: 14px;
    line-height: 150%;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;


    p {
      white-space: pre-wrap;
      width: 100%;
    }
  }
}

`;

const CommentsContainer = styled.section`
  margin: 20px 0;
  width: 100%;
  max-width: 1024px;

  > h2 {
    margin-bottom: 14px;
  }
  

  button {
    width: 100%;
    padding: 14px 0;
    border: none;
    background: #3183ff;
    color: #fff;
    border-radius: 5px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;

    &:disabled {
    background: #4187f0c8;
    cursor: not-allowed;
    opacity: 0.7;
  }
  }
`

const CommentsContainer2 = styled.section`
  margin: 20px 0;
  width: 100%;
  max-width: 1024px;

  h2 {
    margin-bottom: 14px;
  }

  > article {
    border: 1px solid #ddd; 
    padding: 14px;
    border-radius: 4px;


    > div {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      
      > label {
        padding: 4px 8px;
        margin-right: 8px;
        background: #ddd;
        border-radius: 4px;
      }

      > button {
        background: transparent;
        border: none;
        cursor: pointer;
      }

    }


    > p {
      margin-top: 14px;
      white-space: pre-wrap;
    }

  }
  
`

interface TaskClientProps {
  task: {
    task: string;
    created: string;
    user: string;
    taskId: string;
  };
  session: Session | null;
  allComments: CommentsProps[];
}



export default function TaskClient({ task, session, allComments }: TaskClientProps) {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentsProps[]>(allComments || [])

  async function handleCommit(event: FormEvent){
    event.preventDefault();

    if(input === "") return;

    if(!session?.user?.email || !session?.user?.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task?.taskId
      })

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: task.taskId,
      }


      setComments((oldItem) => [...oldItem, data])

      setInput("")


    }catch(err) {
      console.log(err)
    }
  }
  

  async function handleDeleteComment(id: string) {
    

    try {
      const docRef = doc(db, "comments", id)
      await deleteDoc(docRef)


      const deleteComment = comments.filter((item) => item.id !== id)

      setComments(deleteComment)
    }catch(err) {
      console.log(err)
    }
  }
  return (
    <Container>
      <main>
        <h2>Tarefa</h2>
        <article>
          <p>{task.task}</p>
        </article>
      </main>

      <CommentsContainer>
        <h2>Deixar comentário</h2>


        <form onSubmit={handleCommit}>
          <Textarea 
            placeholder="Digite seu comentário"
            value={input}
            onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
          />

          <button
            disabled={!session?.user}
          >
            Enviar comentário
          </button>
        </form>
      </CommentsContainer>

      <CommentsContainer2>
        <h2>Todos os Comentários</h2>

        {comments ? comments.map((item) => (
          <article key={item.id}>
            <div>
              <label>{item.name}</label>
              {item.user === session?.user?.email && (
                <button onClick={ () => handleDeleteComment(item.id)}>
                  <FaTrash size={18} color="#EA3140"/>
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        )): (
          <span>Nao tem comentários</span>
        )
        
      
      }
      </CommentsContainer2>
    </Container>
  );
}