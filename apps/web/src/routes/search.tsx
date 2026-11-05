
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { searchProfessionals } from "../utils/search-professional";
import { z } from "zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@workspace/ui/components/card";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

const searchSchema = z.object({
  query: z.string().trim().min(1),
});

const professionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  profession: z.string().nullable(),
  abilities: z.string().nullable(),
  distance: z.number(),
});

type Professional = z.infer<typeof professionalSchema>;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [professional, setProfessional] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validate = searchSchema.safeParse({ query });

    if (!validate.success) {
      setError(validate.error.issues[0]?.message ?? "Pesquisa inválida");
      setLoading(false);
      return;
    }

    try {
      const result = await searchProfessionals({
        data: validate.data,
      });

      const validatedProfessional = professionalSchema.array().parse(result);

      setProfessional(validatedProfessional);
    } catch {
      setError("Não foi possível realizar a pesquisa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen mx-auto space-y-6 p-6 justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Buscar Profissionais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border"
              required
            />

            <Button type="submit" disabled={loading || !query.trim()} className="ml-5">
              {loading ? "Buscando..." : "Pesquisar"}
            </Button>
          </form>

          {error && <p className="text-red-500">{error}</p>}


          <section className="flex flex-col gap-4 mt-4">
            {professional.map((professional) => (
              <Card key={professional.id} className="flex items-start px-2">
                <h2>{professional.name}</h2>
                <p>profissão: {professional.profession}</p>
                <p>habilidades: {professional.abilities}</p>
                <p>Distância: {professional.distance.toFixed(4)}</p>
              </Card>
            ))}

            {!loading && professional.length === 0 && !error && (
              <p>Nenhum resultado.</p>
            )}
          </section>
        </CardContent>
      </Card>


    </main>
  );
}
