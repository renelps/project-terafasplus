import { db } from "@/services/firebase/firebaseConnection";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { redirect, notFound } from "next/navigation";
import TaskClient from "../../../components/TaskClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


interface TaskProps {
  params: {
    id: string;
  };
}

export interface CommentsProps {
  id: string;
  comment: string;
  name: string;
  taskId: string;
  user: string;
}

export default async function Task({ params }: TaskProps) {
  const session = await getServerSession(authOptions);

  const { id } = params;

  const q = query(collection(db, "comments"), where("taskId", "==", id))

  const snapshotComments = await getDocs(q)

  const allComments: CommentsProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      name: doc.data().name,
      taskId: doc.data().taskId,
      user: doc.data().user
    })
  })

  const docRef = doc(db, "tasks", id);
  const snapshot = await getDoc(docRef);

  const data = snapshot.data();
  if (!data) notFound();
  if (!data.public) redirect("/");

  const miliseconds = data.created?.seconds * 1000;
  const createdDate = new Date(miliseconds).toLocaleDateString();

  const task = {
    task: data.task,
    created: createdDate,
    user: data.user,
    taskId: id,
  };



  return <TaskClient task={task} session={session} allComments={allComments}/>;
}