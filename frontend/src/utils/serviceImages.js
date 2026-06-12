import { FALLBACK_IMAGE } from '../components/SafeImage';
import heroImg from '../assets/images/hero_bg.png';
import heroFloatingImg from '../assets/images/hero_floating_card.png';
import serviceOil from '../assets/images/service_oil.png';
import serviceFull from '../assets/images/service_full.png';
import serviceBrake from '../assets/images/service_brake.png';
import serviceAc from '../assets/images/service_ac.png';
import serviceBattery from '../assets/images/service_battery.png';
import serviceDiagnostics from '../assets/images/service_diagnostics.png';
import step1Img from '../assets/images/step1.png';
import step2Img from '../assets/images/step2.png';
import step3Img from '../assets/images/step3.png';
import step4Img from '../assets/images/step4.png';
import step5Img from '../assets/images/step5.png';
import contactLocationImg from '../assets/images/contact_location.png';
const fallbackLocalImg = heroImg;

const IMAGES = {
  // ── Home Page ──────────────────────────────────────────────
  hero: heroImg,
  heroAlt: heroFloatingImg,
  aboutInspection: fallbackLocalImg,
  aboutCustomer: fallbackLocalImg,
  statsBg: fallbackLocalImg,
  benefits: fallbackLocalImg,
  cta: fallbackLocalImg,
  handover: fallbackLocalImg,
  garage: fallbackLocalImg,

  // ── Page Banners ───────────────────────────────────────────
  servicesBanner: fallbackLocalImg,
  howItWorksBanner: fallbackLocalImg,
  contactBanner: fallbackLocalImg,
  contactSupport: fallbackLocalImg,
  contactLocation: contactLocationImg,

  // ── Service Categories ─────────────────────────────────────
  oil: serviceOil,
  fullService: serviceFull,
  brake: serviceBrake,
  ac: serviceAc,
  battery: serviceBattery,
  diagnostics: serviceDiagnostics,
  alignment: fallbackLocalImg,
  inspection: fallbackLocalImg,
  tyre: fallbackLocalImg,
  default: fallbackLocalImg,

  // ── How It Works Steps ─────────────────────────────────────
  step1: step1Img,
  step2: step2Img,
  step3: step3Img,
  step4: step4Img,
  step5: step5Img,

  // ── Footer ─────────────────────────────────────────────────
  footerBg: fallbackLocalImg,

  fallback: FALLBACK_IMAGE,
  fallbackLocal: fallbackLocalImg
};

export const getServiceImage = (serviceName = '') => {
  const name = serviceName.toLowerCase();

  if (name.includes('oil')) return IMAGES.oil;
  if (name.includes('full')) return IMAGES.fullService;
  if (name.includes('brake')) return IMAGES.brake;
  if (name.includes('ac') || name.includes('air con')) return IMAGES.ac;
  if (name.includes('battery')) return IMAGES.battery;
  if (name.includes('diagnostic') || name.includes('engine')) return IMAGES.diagnostics;
  if (name.includes('align') || name.includes('wheel') || name.includes('tyre') || name.includes('tire')) return IMAGES.alignment;
  if (name.includes('inspect')) return IMAGES.inspection;

  return IMAGES.default;
};

export default IMAGES;
