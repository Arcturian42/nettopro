import Link from "next/link";
import PrimeRenovForm from "./PrimeRenovForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Simulateur Prime R\u00e9nov' - NettoPro",
  description: "Estimez le montant des aides pour la r\u00e9novation \u00e9nerg\u00e9tique de vos locaux.",
};

export default function SimulateurPrimeRenovPage() {
  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/outils" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          \u2190 Retour aux outils
        </Link>
        <h1 className="text-3xl font-bold mb-2">Simulateur Prime R\u00e9nov&apos;</h1>
        <p className="text-muted-foreground">
          Estimez le montant des aides pour la r\u00e9novation \u00e9nerg\u00e9tique de vos locaux.
        </p>
      </div>

      <PrimeRenovForm />
    </div>
  );
}
