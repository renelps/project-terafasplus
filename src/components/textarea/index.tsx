import { HTMLProps } from "react"
import styled from "styled-components"

const StyleTextarea = styled.textarea`
  width: 100%;
  resize: none;
  outline: none;
  height: 160px;
  padding: 5px;
  border-radius: 8px;
`
export function Textarea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return <StyleTextarea {...rest}></StyleTextarea>
} 