import Link from "next/link";
import CalculateurForm from "./CalculateurForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calculateur global d'aides | NettoPro",
  description: "Estimez toutes vos aides en une seule simulation : Prime R\u00e9nov' + CEE. Le calculateur le plus complet disponible.",
};

export default function CalculateurAidesPage() {
  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/outils" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          \u2190 Retour aux outils
        </Link>
        <h1 className="text-3xl font-bold mb-2">Calculateur global d&apos;aides</h1>
        <p className="text-muted-foreground">
          Estimez toutes vos aides en une seule simulation : Prime R\u00e9nov&apos; + CEE
        </p>
      </div>

      <CalculateurForm />
    </div>
  );
}
