import { Calendar } from "@/components/Calendar";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Calendário Acadêmico - Graduação EAD 2026</title>
        <meta name="description" content="Calendário acadêmico da Graduação EAD com cronograma de atividades, períodos letivos, rematrículas e mais. Visualize por ano ou mês." />
      </Helmet>
      <Calendar />
    </>
  );
};

export default Index;
