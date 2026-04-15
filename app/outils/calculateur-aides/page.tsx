"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Home, Building2, CheckCircle2, Calculator, Euro, Leaf } from "lucide-react";
import Link from "next/link";

const steps = [
  { id: 1, title: "Votre profil", description: "Type de logement et revenus" },
  { id: 2, title: "Travaux", description: "Sélectionnez vos projets" },
  { id: 3, title: "Résultat", description: "Estimation complète" },
];

const travauxOptions = [
  { id: "isolation-murs", label: "Isolation des murs", primeRenov: true, cee: true },
  { id: "isolation-combles", label: "Isolation des combles", primeRenov: true, cee: true },
  { id: "pompe-chaleur", label: "Pompe à chaleur", primeRenov: true, cee: true },
  { id: "chaudiere", label: "Chaudière à condensation", primeRenov: true, cee: false },
  { id: "poele-granules", label: "Poêle à granulés", primeRenov: true, cee: false },
  { id: "vmc", label: "VMC double flux", primeRenov: true, cee: true },
  { id: "menuiserie", label: "Menuiserie (fenêtres/portes)", primeRenov: true, cee: false },
  { id: "eclairage-led", label: "Remplacement éclairage LED", primeRenov: false, cee: true },
  { id: "enr", label: "Énergies renouvelables", primeRenov: false, cee: true },
];

const incomeBrackets = [
  { value: "blue", label: "Très modestes (bleu)", desc: "Jusqu'à 20 000€/an", multiplier: 1.2 },
  { value: "yellow", label: "Modestes (jaune)", desc: "20 000€ - 35 000€/an", multiplier: 1.0 },
  { value: "purple", label: "Intermédiaires (violet)", desc: "35 000€ - 50 000€/an", multiplier: 0.8 },
];

const CEE_RATE = 0.015;

export default function CalculateurAides() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    housingType: "",
    incomeBracket: "",
    travaux: [] as string[],
    surface: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [result, setResult] = useState<{
    primeRenov: number;
    cee: number;
    total: number;
    details: Array<{ label: string; primeRenov: number; cee: number; total: number }>;
  } | null>(null);

  const updateData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTravaux = (id: string) => {
    setFormData((prev) => {
      const current = prev.travaux;
      if (current.includes(id)) {
        return { ...prev, travaux: current.filter((t) => t !== id) };
      }
      return { ...prev, travaux: [...current, id] };
    });
  };

  const calculateAides = () => {
    const surface = parseInt(formData.surface) || 100;
    const bracket = incomeBrackets.find(b => b.value === formData.incomeBracket);
    const multiplier = bracket?.multiplier || 1.0;

    let primeRenovTotal = 0;
    let ceeTotal = 0;
    const details = [];

    for (const travauxId of formData.travaux) {
      const option = travauxOptions.find((t) => t.id === travauxId);
      if (!option) continue;

      let primeRenov = 0;
      let cee = 0;

      // Calcul Prime Rénov'
      if (option.primeRenov) {
        const baseRates: Record<string, number> = {
          "isolation-murs": 100,
          "isolation-combles": 35,
          "pompe-chaleur": 5000,
          "chaudiere": 1600,
          "poele-granules": 1400,
          "vmc": 2500,
          "menuiserie": 130,
        };
        const baseRate = baseRates[travauxId] || 0;
        primeRenov = travauxId.includes("isolation") || travauxId === "menuiserie"
          ? baseRate * surface * 0.3 * multiplier
          : baseRate * multiplier;
      }

      // Calcul CEE
      if (option.cee) {
        const kwhRates: Record<string, number> = {
          "isolation-murs": 80,
          "isolation-combles": 60,
          "pompe-chaleur": 70,
          "vmc": 20,
          "eclairage-led": 15,
          "enr": 100,
        };
        const kwh = (kwhRates[travauxId] || 0) * surface;
        cee = kwh * CEE_RATE;
      }

      primeRenovTotal += primeRenov;
      ceeTotal += cee;
      
      details.push({
        label: option.label,
        primeRenov,
        cee,
        total: primeRenov + cee,
      });
    }

    setResult({
      primeRenov: primeRenovTotal,
      cee: ceeTotal,
      total: primeRenovTotal + ceeTotal,
      details,
    });
  };

  const handleNext = () => {
    if (currentStep === 2 && formData.travaux.length > 0) {
      calculateAides();
    }
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.housingType && !!formData.incomeBracket && !!formData.surface;
      case 2:
        return formData.travaux.length > 0;
      case 3:
        return !!formData.email;
      default:
        return false;
    }
  };

  return (
    <div className="container max-w-4xl py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/outils" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
          ← Retour aux outils
        </Link>
        <h1 className="text-3xl font-bold mb-2">Calculateur global d&apos;aides</h1>
        <p className="text-muted-foreground">
          Estimez toutes vos aides en une seule simulation : Prime Rénov&apos; + CEE
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div key={step.id} className={`flex flex-col items-center ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${step.id <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step.id}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Type de logement</Label>
                <RadioGroup value={formData.housingType} onValueChange={(value) => updateData("housingType", value)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="house" id="house" className="peer sr-only" />
                    <Label htmlFor="house" className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted">
                      <Home className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="font-medium">Maison</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="apartment" id="apartment" className="peer sr-only" />
                    <Label htmlFor="apartment" className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted">
                      <Building2 className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="font-medium">Appartement</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-3 block">Tranche de revenus</Label>
                <RadioGroup value={formData.incomeBracket} onValueChange={(value) => updateData("incomeBracket", value)} className="space-y-3">
                  {incomeBrackets.map((bracket) => (
                    <div key={bracket.value}>
                      <RadioGroupItem value={bracket.value} id={bracket.value} className="peer sr-only" />
                      <Label htmlFor={bracket.value} className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted">
                        <div className={`w-4 h-4 rounded-full mr-3 ${bracket.value === "blue" ? "bg-blue-500" : bracket.value === "yellow" ? "bg-yellow-500" : "bg-purple-500"}`} />
                        <div>
                          <span className="font-medium block">{bracket.label}</span>
                          <span className="text-sm text-muted-foreground">{bracket.desc}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="surface">Surface (m²)</Label>
                <Input id="surface" type="text" inputMode="numeric" placeholder="Ex: 100" value={formData.surface} onChange={(e) => updateData("surface", e.target.value)} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {travauxOptions.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox id={option.id} checked={formData.travaux.includes(option.id)} onCheckedChange={() => toggleTravaux(option.id)} />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="cursor-pointer font-medium block">{option.label}</Label>
                      <div className="flex gap-2 mt-1">
                        {option.primeRenov && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Prime Rénov&apos;</span>}
                        {option.cee && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">CEE</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && result && (
            <div className="space-y-6">
              {/* Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 text-center">
                  <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Prime Rénov&apos;</p>
                  <p className="text-2xl font-bold text-blue-600">{result.primeRenov.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
                  <Leaf className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">CEE</p>
                  <p className="text-2xl font-bold text-green-600">{result.cee.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
                  <Euro className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Total estimé</p>
                  <p className="text-2xl font-bold text-primary">{result.total.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <h4 className="font-medium">Détail par travaux :</h4>
                {result.details.map((detail, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-sm">{detail.label}</span>
                    <span className="font-medium">{detail.total.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€</span>
                  </div>
                ))}
              </div>

              {/* Contact form */}
              <div className="border-t pt-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">Recevez le détail complet par email :</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateData("firstName", e.target.value)} placeholder="Jean" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateData("lastName", e.target.value)} placeholder="Dupont" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateData("email", e.target.value)} placeholder="jean.dupont@email.com" required />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>Retour</Button>
        {currentStep < 3 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>Continuer <ArrowRight className="ml-2 h-4 w-4" /></Button>
        ) : (
          <Button disabled={!canProceed()}><CheckCircle2 className="mr-2 h-4 w-4" />Recevoir mon estimation</Button>
        )}
      </div>
    </div>
  );
}
