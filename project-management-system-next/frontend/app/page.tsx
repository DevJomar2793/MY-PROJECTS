import Navbar from "./navbar/page";
import Cards from "./cards/page";
import Progress from "./progress/page";
import Task from "./task/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <Cards />
      <Progress />
      <Task />
    </>
  );
}
