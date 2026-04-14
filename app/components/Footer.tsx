import Link from "next/link";

const footerLinks = {
  annuaire: [
    { name: "Toutes les entreprises", href: "/annuaire" },
    { name: "Par catégorie", href: "/categories" },
    { name: "Par région", href: "/regions" },
    { name: "Ajouter mon entreprise", href: "/inscription" },
  ],
  ressources: [
    { name: "Magazine", href: "/magazine" },
    { name: "Guides d'achat", href: "/magazine/guides" },
    { name: "Actualités", href: "/magazine/actualites" },
    { name: "Réglementation", href: "/magazine/reglementation" },
  ],
  entreprise: [
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              NettoPro
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              L&apos;annuaire de référence des entreprises de nettoyage professionnel en France.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Annuaire</h3>
            <ul className="space-y-2">
              {footerLinks.annuaire.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              {footerLinks.ressources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NettoPro. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
