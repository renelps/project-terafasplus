"use client"

import Link from "next/link"
import styled from "styled-components"
import { useSession, signIn, signOut} from "next-auth/react"

const ContainerHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 75px;
  background: #0f0f0f;
`

const Contant = styled.section`
  padding: 0 14px;
  width: 100%;
  max-width: 1024px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    border: none;
    outline: none;
  }


  nav {
    display: flex;
    align-items: center;
    gap: 10px;
    
    
    h2 {
      color: white
    }

    span {
      color: red;
      font-size: 30px;
    }
  }


  
  button {
    padding: 8px 20px;
    font-size: 17px;
    border: 1.5px solid white;
    background: transparent;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover {
    transform: scale(1.03);
    background: #fff;
    color: #000;
  }
`

const DashboardLink = styled(Link)`
  background: white;
  padding: 7px 12px;
  color: #000;
  border-radius: 4px;
`

export function Header() {

  const { data: session, status} = useSession();


  return (
    <ContainerHeader>
      <Contant>
        <nav>
          <Link href="/">
            <h2>
              Tarefas<span>+</span>
            </h2>
          </Link>
          { session?.user && (
            <DashboardLink href="/dashboard">
              Meu Painel
            </DashboardLink>
          )}
        </nav>

        {status === "loading" ? (
          <p></p>
        ): session ? (
          <button onClick={ () => signOut()}> 
            Olá {session?.user?.name}
          </button>
        ) : (
          <button onClick={ () => signIn("google")}> 
            Acessar
          </button>
        ) 
      }
      </Contant>
    </ContainerHeader>
  )
}