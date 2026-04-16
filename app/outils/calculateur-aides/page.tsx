import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calculateur global d'aides | NettoPro",
  description: "Estimez toutes vos aides en une seule simulation.",
};

export default function CalculateurAidesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <Link href="/outils" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          Retour aux outils
        </Link>
        <h1 className="text-3xl font-bold mb-2">Calculateur global d&apos;aides</h1>
        <p className="text-muted-foreground">
          Cet outil est en cours de maintenance. Utilisez les simulateurs individuels.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link href="/outils/test-prime-renove" className="px-4 py-2 bg-primary text-white rounded">
          Simulateur Prime Renov
        </Link>
        <Link href="/outils/test-cee" className="px-4 py-2 bg-green-600 text-white rounded">
          Simulateur CEE
        </Link>
      </div>
    </div>
  );
}
