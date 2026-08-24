import { useCallback, useEffect, useState } from "react";
import type { Medicoes, Perfil } from "./risk";

export interface Avaliacao extends Medicoes {
  id: string;
  data: string; // ISO
  protocoloForca?: string;
  tentativasForca?: number[];
  protocoloMarcha?: string;
  sensoresMarcha?: {
    amostras: number;
    picoAceleracaoMs2: number;
    cadenciaEstimadaPpm?: number;
  };
}

const CHAVE_PERFIL = "vitalidade.perfil";
const CHAVE_AVALIACOES = "vitalidade.avaliacoes";

export const perfilPadrao: Perfil = {
  nome: "",
  idade: 62,
  sexo: "feminino",
  alturaCm: 165,
  pesoKg: 70,
  usaAuxilioMarcha: false,
  quedaUltimos6Meses: false,
  cirurgiaRecente: false,
  doencaCardiovascular: false,
  nivelAtividade: "leve",
};

function ler<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function escrever(chave: string, valor: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(chave, JSON.stringify(valor));
  window.dispatchEvent(new CustomEvent("vitalidade:atualizado"));
}

function useArmazenado<T>(chave: string, padrao: T) {
  const [valor, setValor] = useState<T>(padrao);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    const sincronizar = () => setValor(ler(chave, padrao));
    sincronizar();
    setHidratado(true);
    window.addEventListener("vitalidade:atualizado", sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      window.removeEventListener("vitalidade:atualizado", sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const salvar = useCallback(
    (novo: T) => {
      setValor(novo);
      escrever(chave, novo);
    },
    [chave],
  );

  return { valor, salvar, hidratado };
}

export function usePerfil() {
  const { valor, salvar, hidratado } = useArmazenado<Perfil | null>(CHAVE_PERFIL, null);
  return { perfil: valor, salvarPerfil: salvar, hidratado };
}

export function useAvaliacoes() {
  const { valor, salvar, hidratado } = useArmazenado<Avaliacao[]>(CHAVE_AVALIACOES, []);
  const adicionar = useCallback(
    (a: Omit<Avaliacao, "id" | "data">) => {
      const nova: Avaliacao = {
        ...a,
        id: crypto.randomUUID(),
        data: new Date().toISOString(),
      };
      salvar([...valor, nova]);
      return nova;
    },
    [valor, salvar],
  );
  const ordenadas = [...valor].sort((a, b) => a.data.localeCompare(b.data));
  return {
    avaliacoes: ordenadas,
    ultima: ordenadas[ordenadas.length - 1],
    adicionar,
    limpar: () => salvar([]),
    hidratado,
  };
}

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
