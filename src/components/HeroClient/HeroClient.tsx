"use client"
import styled from "styled-components";
import Image, { StaticImageData } from "next/image";

const Container = styled.main`
  background: #0f0f0f;
  width: 100%;
  height: calc(100vh - 75px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    max-width: 480px;
    object-fit: contain;
    width: auto;
    height: auto;
  }


  @media screen and (max-width: 580px) {
    > div {
      max-width: 80%;
    }
  }

`

const Title = styled.h2`
  color: white;
  text-align: center;
  padding-top: 10px;
  font-size: 25px;
  line-height: 150%;
`
const InfoContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;

  section {
    background: #fafafa;
    padding: 14px 44px;
    border-radius: 2px;
    margin-top: 14px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  section:hover {
    transform: scale(1.08)
  }


  @media screen and (max-width: 760px) {
    flex-direction: column;
    
    section {
      width: 80%;
      text-align: center;
    }
  }

`


interface Props {
  image: StaticImageData;
  posts: number;
  comments: number;
}


export default function Home({comments, image, posts}: Props) {
  return (
    <Container>
      <div>
        <Image 
          src={image}
          alt="image hero"
          priority
        />

        <Title>Sistema feito para voçê organizar<br /> seus estudos e tarefas</Title>

        <InfoContent>
          <section>
            <span>{posts > 0 ? "+" : ""}{posts} posts</span>
          </section>

          <section>
            <span>{comments > 0 ? "+" : ""}{comments} {comments > 1000 ? "mil comentários" : "comentários"}</span>
          </section>
        </InfoContent>
      </div>
    </Container>
  );
}
