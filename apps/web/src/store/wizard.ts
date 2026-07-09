import { create } from "zustand";
import type {
  CustomerInput,
  DeviceInput,
  DefectInput,
  CheckInput,
  OrderItemInput,
  CheckKey,
  CheckType,
  CheckStatus,
  PaymentMethod,
  CreateServiceOrder,
  ServiceOrder,
} from "@atlas/shared";

export interface LocalPhoto {
  id: string;
  blob: Blob;
  previewUrl: string;
  label: string;
}

export const WIZARD_STEPS = [
  "Cliente",
  "Aparelho",
  "Inspeção e fotos",
  "Confirmação física e testes funcionais",
  "Orçamento",
  "Termos e assinatura",
  "Finalizar",
] as const;

export interface WizardState {
  step: number;
  customer: CustomerInput;
  device: DeviceInput;
  devicePowersOn: boolean;
  problemReport: string;
  budgetOnly: boolean;
  defects: DefectInput[];
  checks: CheckInput[];
  items: OrderItemInput[];
  budget: {
    desiredDeadline?: string;
    totalValue: number;
    amountPaid: number;
    paymentMethod?: PaymentMethod;
    receivedBy?: string;
  };
  termsTemplateId: string | null;
  signatureDataUrl?: string;
  photos: LocalPhoto[];
  createdOrder?: ServiceOrder;
  pdfUrl?: string;

  // navegação
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;

  // patches
  setCustomer: (patch: Partial<CustomerInput>) => void;
  setDevice: (patch: Partial<DeviceInput>) => void;
  setDevicePowersOn: (value: boolean) => void;
  setProblemReport: (value: string) => void;
  setBudgetOnly: (value: boolean) => void;
  addDefect: (defect: DefectInput) => void;
  removeDefect: (index: number) => void;
  setCheck: (
    type: CheckType,
    key: CheckKey,
    status: CheckStatus,
    note?: string,
  ) => void;
  getCheck: (key: CheckKey) => CheckInput | undefined;
  addItem: (item: OrderItemInput) => void;
  removeItem: (index: number) => void;
  setBudget: (patch: Partial<WizardState["budget"]>) => void;
  setTermsTemplate: (id: string) => void;
  setSignature: (dataUrl?: string) => void;
  addPhoto: (photo: LocalPhoto) => void;
  removePhoto: (id: string) => void;
  setCreatedOrder: (order: ServiceOrder) => void;
  setPdfUrl: (url: string) => void;

  buildPayload: () => CreateServiceOrder;
  reset: () => void;
}

const initial = {
  step: 0,
  customer: { name: "" } as CustomerInput,
  device: { kind: "phone", brand: "Apple", model: "" } as DeviceInput,
  devicePowersOn: true,
  problemReport: "",
  budgetOnly: false,
  defects: [] as DefectInput[],
  checks: [] as CheckInput[],
  items: [] as OrderItemInput[],
  budget: { totalValue: 0, amountPaid: 0 },
  termsTemplateId: null as string | null,
  signatureDataUrl: undefined as string | undefined,
  photos: [] as LocalPhoto[],
  createdOrder: undefined as ServiceOrder | undefined,
  pdfUrl: undefined as string | undefined,
};

export const useWizard = create<WizardState>((set, get) => ({
  ...initial,

  goTo: (step) => set({ step }),
  next: () =>
    set((s) => ({ step: Math.min(s.step + 1, WIZARD_STEPS.length - 1) })),
  prev: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),

  setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
  setDevice: (patch) => set((s) => ({ device: { ...s.device, ...patch } })),
  setDevicePowersOn: (value) => set({ devicePowersOn: value }),

  setProblemReport: (value) => set({ problemReport: value }),
  setBudgetOnly: (value) => set({ budgetOnly: value }),

  addDefect: (defect) => set((s) => ({ defects: [...s.defects, defect] })),
  removeDefect: (index) =>
    set((s) => ({ defects: s.defects.filter((_, i) => i !== index) })),

  setCheck: (type, key, status, note) =>
    set((s) => ({
      checks: [
        ...s.checks.filter((c) => c.key !== key),
        { type, key, status, note },
      ],
    })),
  getCheck: (key) => get().checks.find((c) => c.key === key),

  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (index) =>
    set((s) => ({ items: s.items.filter((_, i) => i !== index) })),

  setBudget: (patch) => set((s) => ({ budget: { ...s.budget, ...patch } })),
  setTermsTemplate: (id) => set({ termsTemplateId: id }),
  setSignature: (dataUrl) => set({ signatureDataUrl: dataUrl }),

  addPhoto: (photo) => set((s) => ({ photos: [...s.photos, photo] })),
  removePhoto: (id) =>
    set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),

  setCreatedOrder: (order) => set({ createdOrder: order }),
  setPdfUrl: (url) => set({ pdfUrl: url }),

  buildPayload: () => {
    const s = get();
    return {
      customer: s.customer,
      device: s.device,
      devicePowersOn: s.devicePowersOn,
      defects: s.defects,
      checks: s.checks,
      items: s.items,
      budget: {
        desiredDeadline: s.budget.desiredDeadline,
        totalValue: s.budget.totalValue,
        amountPaid: s.budget.amountPaid,
        paymentMethod: s.budget.paymentMethod,
        receivedBy: s.budget.receivedBy,
      },
      terms: {
        templateId: s.termsTemplateId ?? "",
        signatureDataUrl: s.signatureDataUrl,
      },
    };
  },

  reset: () => set({ ...initial }),
}));
