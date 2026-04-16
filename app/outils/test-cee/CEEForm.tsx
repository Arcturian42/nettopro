"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Building2, Factory, Store, CheckCircle2, Leaf } from "lucide-react";

const steps = [
  { id: 1, title: "Type d'activité", description: "Sélectionnez votre secteur" },
  { id: 2, title: "Travaux", description: "Sélectionnez les économies d'énergie" },
  { id: 3, title: "Résultat", description: "Votre estimation CEE" },
];

const economieOptions = [
  { id: "eclairage-led", label: "Remplacement éclairage par LED", gain: "kWh/an" },
  { id: "isolation", label: "Isolation thermique", gain: "kWh/an" },
  { id: "chauffage", label: "Optimisation chauffage/climatisation", gain: "kWh/an" },
  { id: "eau-chaude", label: "Eau chaude sanitaire efficace", gain: "kWh/an" },
  { id: "ventilation", label: "Ventilation performante", gain: "kWh/an" },
  { id: "enr", label: "Installation énergies renouvelables", gain: "kWh/an" },
  { id: "sensibilisation", label: "Sensibilisation comportements", gain: "kWh/an" },
];

// Valeurs CEE approximatives (en € par kWh économisé)
const CEE_RATE = 0.015; // 1.5 centimes par kWh

export default function CEEForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    activityType: "",
    economies: [] as string[],
    annualConsumption: "",
    surface: "",
    email: "",
    companyName: "",
  });
  const [result, setResult] = useState<{
    total: number;
    kwhEconomy: number;
    details: Array<{ label: string; kwh: number; value: number }>;
  } | null>(null);

  const updateData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEconomie = (id: string) => {
    setFormData((prev) => {
      const current = prev.economies;
      if (current.includes(id)) {
        return { ...prev, economies: current.filter((e) => e !== id) };
      }
      return { ...prev, economies: [...current, id] };
    });
  };

  const calculateCEE = () => {
    const surface = parseInt(formData.surface) || 100;
    const baseConsumption = parseInt(formData.annualConsumption) || 200;
    
    let totalKwh = 0;
    const details = [];

    for (const eco of formData.economies) {
      let kwh = 0;
      switch (eco) {
        case "eclairage-led":
          kwh = surface * 15;
          break;
        case "isolation":
          kwh = surface * 80;
          break;
        case "chauffage":
          kwh = surface * 60;
          break;
        case "eau-chaude":
          kwh = surface * 25;
          break;
        case "ventilation":
          kwh = surface * 20;
          break;
        case "enr":
          kwh = surface * 100;
          break;
        case "sensibilisation":
          kwh = baseConsumption * 0.05;
          break;
      }
      totalKwh += kwh;
      const option = economieOptions.find((e) => e.id === eco);
      details.push({
        label: option?.label || eco,
        kwh,
        value: kwh * CEE_RATE,
      });
    }

    setResult({
      total: totalKwh * CEE_RATE,
      kwhEconomy: totalKwh,
      details,
    });
  };

  const handleNext = () => {
    if (currentStep === 2 && formData.economies.length > 0) {
      calculateCEE();
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
        return !!formData.activityType;
      case 2:
        return formData.economies.length > 0 && !!formData.surface;
      case 3:
        return true;
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => updateData("activityType", "bureau")}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all hover:bg-muted ${
                  formData.activityType === "bureau" ? "border-primary bg-primary/5" : ""
                }`}
              >
                <Building2 className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="font-medium">Bureaux</span>
              </button>
              <button
                type="button"
                onClick={() => updateData("activityType", "commerce")}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all hover:bg-muted ${
                  formData.activityType === "commerce" ? "border-primary bg-primary/5" : ""
                }`}
              >
                <Store className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="font-medium">Commerce</span>
              </button>
              <button
                type="button"
                onClick={() => updateData("activityType", "industrie")}
                className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all hover:bg-muted ${
                  formData.activityType === "industrie" ? "border-primary bg-primary/5" : ""
                }`}
              >
                <Factory className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="font-medium">Industrie</span>
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {economieOptions.map((economie) => (
                  <button
                    key={economie.id}
                    type="button"
                    onClick={() => toggleEconomie(economie.id)}
                    className={`flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left ${
                      formData.economies.includes(economie.id) ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                      formData.economies.includes(economie.id) ? "bg-primary border-primary" : "border-input"
                    }`}>
                      {formData.economies.includes(economie.id) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 font-normal">{economie.label}</span>
                  </button>
                ))}
              </div>
              <div className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="surface">Surface (m²)</Label>
                  <Input
                    id="surface"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 500"
                    value={formData.surface}
                    onChange={(e) => updateData("surface", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="consumption">Consommation annuelle estimée (kWh)</Label>
                  <Input
                    id="consumption"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 50000"
                    value={formData.annualConsumption}
                    onChange={(e) => updateData("annualConsumption", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && result && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <Leaf className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-medium text-green-700 mb-2">
                  Valeur de vos CEE estimée
                </h3>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {result.total.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€
                </p>
                <p className="text-sm text-green-600">
                  Pour {result.kwhEconomy.toLocaleString("fr-FR")} kWh économisés/an
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Détail par mesure :</h4>
                {result.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span>{detail.label}</span>
                    <span className="font-medium">
                      {detail.value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Recevez une offre personnalisée pour la cession de vos CEE :
                </p>
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateData("companyName", e.target.value)}
                    placeholder="Ma Société SARL"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    placeholder="contact@entreprise.com"
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
        {currentStep < 3 ? (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={!canProceed()}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Recevoir mon offre
          </Button>
        )}
      </div>
    </>
  );
}
