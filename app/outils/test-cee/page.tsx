import Link from "next/link";
import CEEForm from "./CEEForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Simulateur CEE - NettoPro",
  description: "Calculez le montant de vos Certificats d'Économie d'Énergie (CEE) pour vos travaux.",
};

export default function SimulateurCEEPage() {
  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/outils" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Retour aux outils
        </Link>
        <h1 className="text-3xl font-bold mb-2">Simulateur CEE</h1>
        <p className="text-muted-foreground">
          Calculez le montant de vos Certificats d&apos;Économie d&apos;Énergie (CEE) pour vos travaux.
        </p>
      </div>

      <CEEForm />
    </div>
  );
}
