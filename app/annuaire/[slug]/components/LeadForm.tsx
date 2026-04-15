"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface LeadFormProps {
  companyId: string;
  companyName: string;
}

const serviceTypes = [
  { id: "bureaux", label: "Nettoyage de bureaux" },
  { id: "industriel", label: "Nettoyage industriel" },
  { id: "vitres", label: "Lavage de vitres" },
  { id: "moquette", label: "Shampoing moquette" },
  { id: "desinfection", label: "Désinfection" },
  { id: "evenementiel", label: "Nettoyage événementiel" },
  { id: "residence", label: "Résidence/Copropriété" },
  { id: "commerce", label: "Commerce/Retail" },
  { id: "medical", label: "Milieu médical" },
  { id: "restauration", label: "Restauration" },
];

const budgetRanges = [
  { value: "0-500", label: "Moins de 500€/mois" },
  { value: "500-1000", label: "500€ - 1 000€/mois" },
  { value: "1000-2000", label: "1 000€ - 2 000€/mois" },
  { value: "2000-5000", label: "2 000€ - 5 000€/mois" },
  { value: "5000+", label: "Plus de 5 000€/mois" },
  { value: "undecided", label: "Je ne sais pas encore" },
];

const timingOptions = [
  { value: "immediate", label: "Dès que possible" },
  { value: "1-month", label: "Dans le mois" },
  { value: "3-months", label: "Dans 3 mois" },
  { value: "6-months", label: "Dans 6 mois" },
  { value: "planning", label: "Juste pour information" },
];

export function LeadForm({ companyId, companyName }: LeadFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    services: [] as string[],
    surface: "",
    budget: "",
    timing: "",
    message: "",
    postalCode: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const current = prev.services;
      if (current.includes(serviceId)) {
        return { ...prev, services: current.filter((s) => s !== serviceId) };
      }
      return { ...prev, services: [...current, serviceId] };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          ...formData,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Demande envoyée !
          </h3>
          <p className="text-green-700 text-sm">
            Votre demande a bien été transmise à <strong>{companyName}</strong>.<br />
            Ils vous contacteront prochainement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Demander un devis</CardTitle>
        <CardDescription>
          Recevez une estimation gratuite de {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="Jean"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="jean.dupont@entreprise.fr"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="06 12 34 56 78"
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Mon Entreprise SAS"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Services souhaités *</Label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {serviceTypes.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <Label htmlFor={service.id} className="font-normal cursor-pointer">
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="surface">Surface approximative (m²)</Label>
              <Input
                id="surface"
                type="number"
                value={formData.surface}
                onChange={(e) => updateField("surface", e.target.value)}
                placeholder="Ex: 500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">Budget mensuel estimé</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => updateField("budget", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timing">Délai souhaité</Label>
              <Select
                value={formData.timing}
                onValueChange={(value) => updateField("timing", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un délai" />
                </SelectTrigger>
                <SelectContent>
                  {timingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                placeholder="75001"
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message complémentaire</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="Décrivez votre besoin en détail..."
                rows={3}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}
          {step < 3 ? (
            <Button
              className="ml-auto"
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone)) ||
                (step === 2 && formData.services.length === 0)
              }
            >
              Continuer
            </Button>
          ) : (
            <Button
              className="ml-auto"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.postalCode}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer ma demande
                </>
              )}
            </Button>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${
                s === step ? "bg-primary" : s < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
