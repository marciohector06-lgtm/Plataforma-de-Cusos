import { Newspaper } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { publicadoEm: { not: null } },
    include: { autor: true },
    orderBy: { publicadoEm: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
          Blog
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Conteúdo sobre saúde, suporte de vida e emergências médicas.
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Nenhum artigo publicado ainda"
          description="Em breve traremos conteúdos sobre saúde e emergências."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{post.resumo}</p>
                <p className="text-xs text-muted-foreground">
                  {post.autor.name} ·{" "}
                  {post.publicadoEm ? formatDate(post.publicadoEm) : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
