import Cards from "./components/cards/page";
import Progress from "./components/progress/page";
import SubmitTicketBtn from "./components/submitticketbtn/page";
import Task from "./components/task/page";

export default function Home() {
  return (
    <>
      <Cards />
      <Progress />
      <Task />
    </>
  );
}
