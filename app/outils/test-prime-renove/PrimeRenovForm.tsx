"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Home, Building2, CheckCircle2, Calculator } from "lucide-react";

const steps = [
  { id: 1, title: "Type de logement", description: "S\u00e9lectionnez votre type de bien" },
  { id: 2, title: "Revenus", description: "D\u00e9terminez votre tranche de revenus" },
  { id: 3, title: "Travaux", description: "S\u00e9lectionnez les travaux envisag\u00e9s" },
  { id: 4, title: "Coordonn\u00e9es", description: "Recevez votre estimation" },
];

const travauxOptions = [
  { id: "isolation-murs", label: "Isolation des murs", aidable: true },
  { id: "isolation-combles", label: "Isolation des combles", aidable: true },
  { id: "isolation-sous-sol", label: "Isolation du sous-sol", aidable: true },
  { id: "pompe-chaleur", label: "Pompe \u00e0 chaleur", aidable: true },
  { id: "chaudiere", label: "Chaudi\u00e8re \u00e0 condensation", aidable: true },
  { id: "poele-buche", label: "Po\u00eale \u00e0 b\u00fbches", aidable: true },
  { id: "poele-granules", label: "Po\u00eale \u00e0 granul\u00e9s", aidable: true },
  { id: "vmc", label: "VMC double flux", aidable: true },
  { id: "menuiserie", label: "Menuiserie (fen\u00eatres/portes)", aidable: true },
  { id: "audit", label: "Audit \u00e9nerg\u00e9tique", aidable: true },
];

// Bar\u00e8mes 2025 (exemple)
const BAREMES: Record<string, { blue: number; yellow: number; purple: number; unit: string }> = {
  "isolation-murs": { blue: 75, yellow: 100, purple: 120, unit: "\u20ac/m\u00b2" },
  "isolation-combles": { blue: 30, yellow: 35, purple: 40, unit: "\u20ac/m\u00b2" },
  "isolation-sous-sol": { blue: 25, yellow: 30, purple: 35, unit: "\u20ac/m\u00b2" },
  "pompe-chaleur": { blue: 4000, yellow: 5000, purple: 7000, unit: "\u20ac" },
  "chaudiere": { blue: 1200, yellow: 1600, purple: 2000, unit: "\u20ac" },
  "poele-buche": { blue: 800, yellow: 1100, purple: 1500, unit: "\u20ac" },
  "poele-granules": { blue: 1000, yellow: 1400, purple: 2000, unit: "\u20ac" },
  "vmc": { blue: 2000, yellow: 2500, purple: 3000, unit: "\u20ac" },
  "menuiserie": { blue: 100, yellow: 130, purple: 160, unit: "\u20ac/m\u00b2" },
  "audit": { blue: 300, yellow: 400, purple: 500, unit: "\u20ac" },
};

export default function PrimeRenovForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    housingType: "",
    incomeBracket: "",
    travaux: [] as string[],
    surface: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
  });
  const [result, setResult] = useState<{
    total: number;
    details: Array<{ work: string; label: string; amount: number; unit: string }>;
    bracket: string;
  } | null>(null);

  const updateData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTravaux = (travauxId: string) => {
    setFormData((prev) => {
      const current = prev.travaux;
      if (current.includes(travauxId)) {
        return { ...prev, travaux: current.filter((t) => t !== travauxId) };
      }
      return { ...prev, travaux: [...current, travauxId] };
    });
  };

  const calculateResult = () => {
    const { travaux, incomeBracket, surface } = formData;
    const surfaceNum = parseInt(surface) || 100;
    let total = 0;
    const details = [];

    for (const work of travaux) {
      const bareme = BAREMES[work];
      if (bareme) {
        const rate = bareme[incomeBracket as 'blue' | 'yellow' | 'purple'];
        const amount = work.includes("isolation") || work === "menuiserie"
          ? rate * surfaceNum * 0.3 // 30% de la surface
          : rate;
        total += amount;
        const option = travauxOptions.find((t) => t.id === work);
        details.push({
          work,
          label: option?.label || work,
          amount,
          unit: bareme.unit,
        });
      }
    }

    setResult({
      total,
      details,
      bracket: incomeBracket,
    });
  };

  const handleNext = () => {
    if (currentStep === 3 && formData.travaux.length > 0) {
      calculateResult();
    }
    if (currentStep < 4) {
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
        return !!formData.housingType;
      case 2:
        return !!formData.incomeBracket;
      case 3:
        return formData.travaux.length > 0;
      case 4:
        return !!formData.email && !!formData.postalCode;
      default:
        return false;
    }
  };

  return (
    <>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                step.id <= currentStep ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 ${
                  step.id <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {step.id}
              </div>
              <span className="text-xs hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <RadioGroup
              value={formData.housingType}
              onValueChange={(value) => updateData("housingType", value)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="house"
                  id="house"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="house"
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                >
                  <Home className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="font-medium">Maison</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="apartment"
                  id="apartment"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="apartment"
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                >
                  <Building2 className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="font-medium">Appartement</span>
                </Label>
              </div>
            </RadioGroup>
          )}

          {currentStep === 2 && (
            <RadioGroup
              value={formData.incomeBracket}
              onValueChange={(value) => updateData("incomeBracket", value)}
              className="space-y-3"
            >
              {[
                { value: "blue", label: "Tr\u00e8s modestes (bleu)", desc: "Jusqu'\u00e0 20 000\u20ac/an" },
                { value: "yellow", label: "Modestes (jaune)", desc: "20 000\u20ac - 35 000\u20ac/an" },
                { value: "purple", label: "Interm\u00e9diaires (violet)", desc: "35 000\u20ac - 50 000\u20ac/an" },
              ].map((bracket) => (
                <div key={bracket.value}>
                  <RadioGroupItem
                    value={bracket.value}
                    id={bracket.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={bracket.value}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                  >
                    <div
                      className={`w-4 h-4 rounded-full mr-3 ${
                        bracket.value === "blue"
                          ? "bg-blue-500"
                          : bracket.value === "yellow"
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <div>
                      <span className="font-medium block">{bracket.label}</span>
                      <span className="text-sm text-muted-foreground">{bracket.desc}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {travauxOptions.map((travaux) => (
                  <div
                    key={travaux.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={travaux.id}
                      checked={formData.travaux.includes(travaux.id)}
                      onCheckedChange={() => toggleTravaux(travaux.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label
                      htmlFor={travaux.id}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {travaux.label}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Label htmlFor="surface">Surface approximative (m\u00b2)</Label>
                <Input
                  id="surface"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ex: 100"
                  value={formData.surface}
                  onChange={(e) => updateData("surface", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && result && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Estimation totale des aides
                </h3>
                <p className="text-4xl font-bold text-primary mb-2">
                  {result.total.toLocaleString("fr-FR")}\u20ac
                </p>
                <p className="text-sm text-muted-foreground">
                  Pour la tranche {result.bracket === "blue" ? "tr\u00e8s modestes" : result.bracket === "yellow" ? "modestes" : "interm\u00e9diaires"}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">D\u00e9tail par travaux :</h4>
                {result.details.map((detail) => (
                  <div
                    key={detail.work}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span>{detail.label}</span>
                    <span className="font-medium">
                      {detail.amount.toLocaleString("fr-FR")}\u20ac
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Pour recevoir une estimation d\u00e9taill\u00e9e par email, remplissez vos coordonn\u00e9es :
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Pr\u00e9nom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateData("firstName", e.target.value)}
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateData("lastName", e.target.value)}
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    placeholder="jean.dupont@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">T\u00e9l\u00e9phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateData("phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateData("postalCode", e.target.value)}
                    placeholder="75001"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        {currentStep < 4 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!canProceed()}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Recevoir mon estimation
          </Button>
        )}
      </div>
    </>
  );
}
