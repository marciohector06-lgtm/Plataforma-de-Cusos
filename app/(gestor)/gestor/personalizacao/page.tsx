import { Palette } from "lucide-react";
import { EmDesenvolvimento } from "@/components/shared/EmDesenvolvimento";

export default function GestorPersonalizacaoPage() {
  return (
    <EmDesenvolvimento
      titulo="Personalização"
      descricaoPagina="Identidade visual da plataforma (cores, logo, marca)."
      icon={Palette}
      descricaoEstado="A personalização de marca ainda não foi implementada nesta fase do projeto."
    />
  );
}
