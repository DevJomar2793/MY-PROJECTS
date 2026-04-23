import Cards from "./components/cards/page";
import Progress from "./components/progress/page";
import SubmitTicketBtn from "./components/submitticketbtn/page";
import Task from "./components/task/page";

export default function Home() {
  return (
    <>
      <Cards />
      <div className="px-6 pb-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Progress />
        </div>
        <div className="xl:col-span-1">
          <Task />
        </div>
      </div>
    </>
  );
}
