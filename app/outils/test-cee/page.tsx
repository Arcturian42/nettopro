"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Building2, Factory, Store, CheckCircle2, Leaf } from "lucide-react";
import Link from "next/link";

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

export default function SimulateurCEE() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    activityType: "",
    economies: [] as string[],
    annualConsumption: "",
    surface: "",
    email: "",
    companyName: "",
  });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
          kwh = surface * 15; // 15 kWh/m²/an économisés
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
          kwh = baseConsumption * 0.05; // 5% d'économies
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
        <h1 className="text-3xl font-bold mb-2">Simulateur CEE</h1>
        <p className="text-muted-foreground">
          Calculez le montant de vos Certificats d&apos;Économie d&apos;Énergie (CEE) pour vos travaux.
        </p>
      </div>

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
              value={formData.activityType}
              onValueChange={(value) => updateData("activityType", value)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { value: "tertiaire", label: "Bureaux / Tertiaire", icon: Building2 },
                { value: "commerce", label: "Commerce / Retail", icon: Store },
                { value: "industrie", label: "Industrie", icon: Factory },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.value}>
                    <RadioGroupItem
                      value={type.value}
                      id={type.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.value}
                      className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                    >
                      <Icon className="w-8 h-8 mb-2 text-muted-foreground" />
                      <span className="font-medium text-center">{type.label}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {economieOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={option.id}
                      checked={formData.economies.includes(option.id)}
                      onCheckedChange={() => toggleEconomie(option.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={option.id}
                        className="cursor-pointer font-medium block"
                      >
                        {option.label}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Économie estimée: variable selon surface
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <Label htmlFor="surface">Surface (m²) *</Label>
                  <Input
                    id="surface"
                    type="number"
                    placeholder="Ex: 500"
                    value={formData.surface}
                    onChange={(e) => updateData("surface", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="consumption">Conso annuelle (MWh)</Label>
                  <Input
                    id="consumption"
                    type="number"
                    placeholder="Ex: 200"
                    value={formData.annualConsumption}
                    onChange={(e) => updateData("annualConsumption", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && result && (
            <div className="space-y-6">
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6 text-center">
                <Leaf className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Valeur estimée de vos CEE
                </h3>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {result.total.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€
                </p>
                <p className="text-sm text-muted-foreground">
                  Pour {result.kwhEconomy.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kWh économisés/an
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Détail par opération :</h4>
                {result.details.map((detail, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{detail.label}</span>
                    <div className="text-right">
                      <span className="font-medium block">
                        {detail.value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {detail.kwh.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kWh
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note :</strong> Cette estimation est indicative. Le montant réel dépend 
                  des opérations standardisées (CEE-OS) éligibles et des cours du marché CEE.
                  Contactez un professionnel pour une étude personnalisée.
                </p>
              </div>

              <div className="border-t pt-6 space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Recevez une étude complète par email :
                </p>
                <div>
                  <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateData("companyName", e.target.value)}
                    placeholder="Mon Entreprise SAS"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    placeholder="contact@entreprise.fr"
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
            Recevoir mon étude
          </Button>
        )}
      </div>
    </div>
  );
}
