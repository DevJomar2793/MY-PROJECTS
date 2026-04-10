import Navbar from "./component/navbar/page";
import Hero from "./component/hero/page";
import About from "./component/about/page";
import Skills from "./component/skills/page";
import Tools from "./component/tools/page";
import Projects from "./component/projects/page";
import Contacts from "./component/contacts/page";
import Footer from "./component/footer/page";

export default function Profile() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Tools />
      <Projects />
      <Contacts />
      <Footer />
    </>
  );
}
