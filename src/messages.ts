import { UserProducts } from "./types/types";

export const messages = {
  signUpSmsText:
    "Welcome aboard! C-Hero ETraining will help you become part of the C-Hero Rescue Crew. \n Click HERE to download the ETraining app, or \n Click HERE to do the training on a computer/pad \n You can edit/add your info, and begin a class at your convenience.",
  // customer setup info
  classSectionInstructions:
    "Thank you for enrolling into eTraining and your commitment to familiarizing yourself with your new C-Hero safety gear! Each product has a total of four sections to study and test against. <strong>Successfully completing</strong> the first section unlocks the next until you have finished all four. Have fun!",
  branchFacilityTypes: ["Port", "Facility"],
  addressInputs: ["City", "State", "Province", "Zip"],
  cHeroEquipment: [
    "VR-12 Rescue Pole",
    "VR-12 Resuce Pole with Recovery Strap",
    "Bit Mounted Rescue Davit + Swivel",
    "Flat Mounted Rescue Davit + Swivel",
  ],
  mobOfficerInputs: ["Name", "Phone", "Email", "Title"],
  mobOfficerLabels: [
    "Name:",
    "Mobile Phone:",
    "Email Address:",
    "Title / Function:",
  ],
  productTypes: [
    ["44a", "45a", "46a", "47a", "62a"],
    ["44b", "45b", "46b", "47b", "62b"],
    ["44c", "45c", "46c", "47c", "62c"],
    ["44d", "45d", "46d", "47d", "62d"],
  ],
};

export const classTypesMap = {
  a: "Setup",
  b: "Operation",
  c: "MOB Drills",
  d: "Inspection & Storage",
};

export const productsArray = [
  {
    name: "3B Series 3 Davit - Bitt Mount",
    code: "3b",
  },
  {
    name: "3F Series 3 Davit - Flat Mount",
    code: "3f",
  },
  {
    name: "5B Series 5 Davit - Bitt Mount",
    code: "5b",
  },
  {
    name: "5F Series 5 Davit - Flat Mount",
    code: "5f",
  },
  {
    name: "7B Series 7 Davit - Bitt Mount",
    code: "7b",
  },
  {
    name: "7F Series 7 Davit - Flat Mount",
    code: "7f",
  },
  {
    name: "9F Man Rated Rescue Davit",
    code: "9f",
  },
  {
    name: "HR Rescue Pole",
    code: "hr",
  },
  {
    name: "VR Rescue Pole",
    code: "vr",
  },
  {
    name: "RK Rescue Pole",
    code: "rk",
  },
  {
    name: "RS Rescue Pole",
    code: "rs",
  },
];

export const labels = [
  "name",
  "email",
  "phone",
  "title",
  "company",
  "vessel",
  "port",
];

export const productsMap: UserProducts = {
  "3b": {
    productId: "3b",
    productName: "3B Series 3 Davit - Bitt Mount",
    classProgress: {},
    assigned: false,
  },
  "3f": {
    productId: "3f",
    productName: "3F Series 3 Davit - Flat Mount",
    classProgress: {},
    assigned: false,
  },
  "5b": {
    productId: "5b",
    productName: "5B Series 5 Davit - Bitt Mount",
    classProgress: {},
    assigned: false,
  },
  "5f": {
    productId: "5f",
    productName: "5F Series 5 Davit - Flat Mount",
    classProgress: {},
    assigned: false,
  },
  "7b": {
    productId: "7b",
    productName: "7B Series 7 Davit - Bitt Mount",
    classProgress: {},
    assigned: false,
  },
  "7f": {
    productId: "7f",
    productName: "7F Series 7 Davit - Flat Mount",
    classProgress: {},
    assigned: false,
  },
  "9f": {
    productId: "9f",
    productName: "9F Man Rated Rescue Davit",
    classProgress: {},
    assigned: false,
  },
  hr: {
    productId: "hr",
    productName: "HR Rescue Pole",
    classProgress: {},
    assigned: false,
  },
  vr: {
    productId: "vr",
    productName: "VR Rescue Pole",
    classProgress: {},
    assigned: false,
  },
  rk: {
    productId: "rk",
    productName: "RK Rescue Pole",
    classProgress: {},
    assigned: false,
  },
  rs: {
    productId: "rs",
    productName: "RS Rescue Pole",
    classProgress: {},
    assigned: false,
  },
};
