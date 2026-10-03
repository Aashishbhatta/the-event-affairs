"use client";

import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Banknote,
  Bell,
  CalendarCheck2,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Flower2,
  Headphones,
  Image,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Music2,
  PartyPopper,
  Pencil,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  categories,
  createBudgetItems,
  currency,
  eventStyles,
  eventTypes,
  formattedDate,
  initialBookings,
  initialBudgetItems,
  initialEvent,
  initialGuests,
  initialTasks,
  requirementOptions,
  shortDate,
  vendors,
  type Booking,
  type BudgetItem,
  type Category,
  type EventDetails,
  type EventTask,
  type Guest,
  type Vendor,
} from "@/lib/event-data";

type Role = "customer" | "vendor" | "admin";
type PageKey =
  | "home"
  | "dashboard"
  | "budget"
  | "vendors"
  | "vendor-profile"
  | "bookings"
  | "guests"
  | "tasks"
  | "messages"
  | "profile"
  | "vendor-dashboard"
  | "vendor-bookings"
  | "calendar"
  | "services"
  | "vendor-messages"
  | "earnings"
  | "vendor-profile-management"
  | "admin-dashboard"
  | "admin-users"
  | "admin-vendors"
  | "admin-events"
  | "admin-bookings"
  | "transactions"
  | "analytics";

type PersistedDemo = {
  event: EventDetails;
  bookings: Booking[];
  guests: Guest[];
  tasks: EventTask[];
  budgetItems: BudgetItem[];
  role: Role;
  profileName: string;
  profileEmail: string;
  vendorBusinessName: string;
  vendorDescription: string;
  vendorLocation: string;
  vendorPrices: number[];
  vendorTakingEnquiries: boolean;
  vendorServiceCategory: Category;
  vendorServices: string[];
  vendorCancellationPolicy: string;
  vendorContactEmail: string;
};

type BookingTarget = { vendorId: string; packageName: string };
type WizardProps = {
  onClose: () => void;
  onCreate: (event: EventDetails) => void;
  initial: EventDetails;
};

type AppButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "dark" | "danger";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
};

const storageKey = "the-event-affair-demo-v1";
const allDemoEventTypes = ["Wedding", "Birthday", "Farewell", "College Event", "Corporate Event", "Party", "Anniversary"];
const eventCategories: Record<string, Category[]> = {
  Wedding: categories,
  Birthday: ["Venues", "Catering", "DJ & Music", "Decoration", "Photography", "Lighting", "Transportation", "Entertainment"],
  Farewell: ["Venues", "Catering", "DJ & Music", "Decoration", "Photography", "Lighting", "Clothing", "Transportation", "Entertainment"],
  "College Event": ["Venues", "Catering", "DJ & Music", "Decoration", "Photography", "Lighting", "Transportation", "Entertainment"],
  "Corporate Event": ["Venues", "Catering", "DJ & Music", "Decoration", "Photography", "Lighting", "Transportation"],
  Party: ["Venues", "Catering", "DJ & Music", "Decoration", "Photography", "Lighting", "Transportation", "Entertainment"],
  Anniversary: categories,
};

const roleNavigation: Record<Role, { label: string; page: PageKey; icon: LucideIcon }[]> = {
  customer: [
    { label: "Home", page: "home", icon: Sparkles },
    { label: "My event", page: "dashboard", icon: CalendarCheck2 },
    { label: "Vendors", page: "vendors", icon: Search },
    { label: "Bookings", page: "bookings", icon: CreditCard },
    { label: "Guests", page: "guests", icon: Users },
    { label: "Tasks", page: "tasks", icon: ListChecks },
    { label: "Messages", page: "messages", icon: MessageCircle },
  ],
  vendor: [
    { label: "Overview", page: "vendor-dashboard", icon: LayoutDashboard },
    { label: "Bookings", page: "vendor-bookings", icon: CalendarCheck2 },
    { label: "Calendar", page: "calendar", icon: CalendarDays },
    { label: "Services", page: "services", icon: Sparkles },
    { label: "Messages", page: "vendor-messages", icon: MessageCircle },
    { label: "Earnings", page: "earnings", icon: Wallet },
    { label: "Profile", page: "vendor-profile-management", icon: Users },
  ],
  admin: [
    { label: "Overview", page: "admin-dashboard", icon: LayoutDashboard },
    { label: "Users", page: "admin-users", icon: Users },
    { label: "Vendors", page: "admin-vendors", icon: ShieldCheck },
    { label: "Events", page: "admin-events", icon: CalendarDays },
    { label: "Bookings", page: "admin-bookings", icon: CreditCard },
    { label: "Transactions", page: "transactions", icon: Banknote },
    { label: "Analytics", page: "analytics", icon: Activity },
  ],
};

const formatCount = (value: number) => new Intl.NumberFormat("en-IN").format(value);

function renderHeadline(value: string) {
  return value.split(/(<em>.*?<\/em>)/g).map((part, index) =>
    part.startsWith("<em>") && part.endsWith("</em>")
      ? <em key={`${index}-${part}`}>{part.slice(4, -5)}</em>
      : part,
  );
}

function AppButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
  title,
}: AppButtonProps) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
    >
      {children}
    </button>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{renderHeadline(title)}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-intro-action">{action}</div>}
    </div>
  );
}

function ModalFrame({
  children,
  onClose,
  label,
  wide = false,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  wide?: boolean;
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={`modal-panel ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={label}>
        <button className="modal-close icon-button" type="button" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
        {children}
      </section>
    </div>
  );
}

function EventWizard({ onClose, onCreate, initial }: WizardProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<EventDetails>({
    ...initial,
    name: "",
    type: "",
    styles: [],
    requirements: [],
  });
  const [otherType, setOtherType] = useState("");
  const [customBudget, setCustomBudget] = useState(false);
  const steps = ["Event type", "Event details", "Your budget", "The vibe", "Your essentials"];
  const selectedType = draft.type === "Other" ? otherType : draft.type;
  const canContinue =
    step === 0
      ? Boolean(draft.type && (draft.type !== "Other" || otherType.trim()))
      : step === 1
        ? Boolean(draft.name.trim() && draft.date && draft.location.trim() && draft.guests > 0)
        : step === 2
          ? draft.budget >= 1
          : step === 3
            ? draft.styles.length > 0
            : draft.requirements.length > 0;

  const update = <K extends keyof EventDetails>(key: K, value: EventDetails[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggleValue = (key: "styles" | "requirements", value: string) => {
    const values = draft[key];
    update(key, (values.includes(value) ? values.filter((item) => item !== value) : [...values, value]) as EventDetails[typeof key]);
  };

  const finish = () => {
    onCreate({ ...draft, type: selectedType, name: draft.name.trim(), location: draft.location.trim() });
  };

  return (
    <ModalFrame onClose={onClose} label="Create your event" wide>
      <div className="wizard-layout">
        <aside className="wizard-aside">
          <div className="brand-mark brand-mark-light">
            <span>THE</span>
            <strong>EVENT AFFAIR</strong>
          </div>
          <div className="wizard-aside-copy">
            <span className="eyebrow eyebrow-light">A little something to celebrate</span>
            <h2>Let’s make it <em>yours.</em></h2>
            <p>Five thoughtful steps. One beautiful plan.</p>
          </div>
          <div className="wizard-step-list">
            {steps.map((label, index) => (
              <div key={label} className={`wizard-step-item ${index === step ? "is-current" : index < step ? "is-done" : ""}`}>
                <span>{index < step ? <Check size={14} /> : `0${index + 1}`}</span>
                {label}
              </div>
            ))}
          </div>
          <div className="wizard-aside-note"><ShieldCheck size={17} /> Your event details stay yours.</div>
        </aside>
        <div className="wizard-content">
          <div className="wizard-progress-mobile"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
          <div className="wizard-content-top">
            <span className="eyebrow">Step 0{step + 1} of 05</span>
            <span className="wizard-time">About 2 minutes <Clock3 size={13} /></span>
          </div>
          {step === 0 && (
            <div className="wizard-question">
              <h2>What are you <em>celebrating?</em></h2>
              <p>Every good plan starts with a reason to gather.</p>
              <div className="choice-grid choice-grid-types">
                {eventTypes.map((type, index) => {
                  const TypeIcon = [Flower2, PartyPopper, Sparkles, Music2, Award, Headphones, HeartIcon, Sparkles][index];
                  return (
                    <button
                      className={`choice-card ${draft.type === type ? "choice-selected" : ""}`}
                      type="button"
                      onClick={() => update("type", type)}
                      key={type}
                    >
                      <TypeIcon size={20} strokeWidth={1.6} />
                      <span>{type}</span>
                      {draft.type === type && <CheckCircle2 className="choice-check" size={16} />}
                    </button>
                  );
                })}
              </div>
              {draft.type === "Other" && (
                <label className="field-label wizard-custom-label">
                  Your celebration
                  <input className="text-input" autoFocus value={otherType} onChange={(event) => setOtherType(event.target.value)} placeholder="e.g. a reunion, a baby shower…" />
                </label>
              )}
            </div>
          )}
          {step === 1 && (
            <div className="wizard-question">
              <h2>The little <em>details.</em></h2>
              <p>Give your {selectedType.toLowerCase()} a name, a date, and a place to begin.</p>
              <div className="form-stack">
                <label className="field-label">What shall we call your event?
                  <input className="text-input" value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Meera & Arjun’s big day" autoFocus />
                </label>
                <div className="form-row">
                  <label className="field-label">Event date
                    <input className="text-input" type="date" value={draft.date} onChange={(event) => update("date", event.target.value)} />
                  </label>
                  <label className="field-label">Number of guests
                    <input className="text-input" type="number" min="1" max="10000" value={draft.guests || ""} onChange={(event) => update("guests", Number(event.target.value))} placeholder="150" />
                  </label>
                </div>
                <label className="field-label">Where is the magic happening?
                  <span className="input-with-icon"><MapPin size={17} /><input className="text-input" value={draft.location} onChange={(event) => update("location", event.target.value)} placeholder="City or neighbourhood" /></span>
                </label>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="wizard-question">
              <h2>A budget that feels <em>right.</em></h2>
              <p>Just an estimate for now. We’ll help you make every rupee count.</p>
              <div className="budget-choice-grid">
                {[25000, 50000, 100000, 200000, 500000].map((amount, index) => (
                  <button key={amount} className={`budget-choice ${!customBudget && draft.budget === amount ? "choice-selected" : ""}`} type="button" onClick={() => { setCustomBudget(false); update("budget", amount); }}>
                    <span className="budget-choice-label">{["A lovely little gathering", "Gather your favourites", "Room for a little extra", "Let’s make it special", "Go on, dream big"][index]}</span>
                    <strong>{currency(amount)}{amount === 500000 && <small>+</small>}</strong>
                  </button>
                ))}
                <button className={`budget-choice budget-choice-custom ${customBudget ? "choice-selected" : ""}`} type="button" onClick={() => setCustomBudget(true)}>
                  <span className="budget-choice-label">Have a number in mind?</span>
                  <strong>Custom amount</strong>
                </button>
              </div>
              {customBudget && (
                <label className="field-label wizard-custom-label">Your estimated budget
                  <span className="currency-input"><span>₹</span><input type="number" min="1000" step="1000" value={draft.budget} onChange={(event) => update("budget", Number(event.target.value))} /></span>
                </label>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="wizard-question">
              <h2>What’s the <em>feeling?</em></h2>
              <p>Pick every mood that feels like you. You can always change your mind.</p>
              <div className="choice-grid choice-grid-styles">
                {eventStyles.map((style, index) => {
                  const StyleIcon = [Sparkles, Flower2, Award, Star, PartyPopper, Music2, Flower2, Pencil][index];
                  const selected = draft.styles.includes(style);
                  return (
                    <button key={style} type="button" className={`choice-card style-card ${selected ? "choice-selected" : ""}`} onClick={() => toggleValue("styles", style)}>
                      <StyleIcon size={20} strokeWidth={1.6} />
                      <span>{style}</span>
                      {selected && <CheckCircle2 className="choice-check" size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="wizard-question">
              <h2>What can we help <em>with?</em></h2>
              <p>Choose the pieces you’re dreaming of. We’ll find your people.</p>
              <div className="requirements-grid">
                {requirementOptions.map((item) => {
                  const selected = draft.requirements.includes(item);
                  return (
                    <button key={item} type="button" className={`requirement-choice ${selected ? "requirement-selected" : ""}`} onClick={() => toggleValue("requirements", item)}>
                      <span className="requirement-check">{selected && <Check size={13} />}</span>
                      {item}
                    </button>
                  );
                })}
              </div>
              <div className="wizard-reassurance"><Sparkles size={16} /> You can add or remove services at any time.</div>
            </div>
          )}
          <div className="wizard-footer">
            {step > 0 ? <AppButton variant="quiet" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={16} /> Back</AppButton> : <button className="wizard-cancel" type="button" onClick={onClose}>Maybe later</button>}
            {step < 4 ? (
              <AppButton onClick={() => setStep((current) => current + 1)} disabled={!canContinue}>Continue <ArrowRight size={16} /></AppButton>
            ) : (
              <AppButton onClick={finish} disabled={!canContinue}><Sparkles size={16} /> Create my event</AppButton>
            )}
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}

function HeartIcon({ size = 20, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return <Flower2 size={size} strokeWidth={strokeWidth} />;
}

function VendorCard({
  vendor,
  onView,
  onBook,
}: {
  vendor: Vendor;
  onView: () => void;
  onBook: () => void;
}) {
  return (
    <article className="vendor-card">
      <button className="vendor-card-image" type="button" onClick={onView} aria-label={`View ${vendor.name}`} style={{ backgroundImage: `url("${vendor.image}")` }}>
        <span className="image-category">{vendor.category}</span>
        <span className="image-arrow"><ArrowUpRight size={17} /></span>
      </button>
      <div className="vendor-card-body">
        <div className="vendor-card-meta"><span><MapPin size={13} /> {vendor.location}</span><span className="rating"><Star size={13} fill="currentColor" /> {vendor.rating.toFixed(1)} <small>({vendor.reviews})</small></span></div>
        <button className="vendor-card-title" type="button" onClick={onView}>{vendor.name}</button>
        <p className="vendor-card-tagline">{vendor.tagline}</p>
        <div className="vendor-card-bottom">
          <div><span className="from-label">Starting from</span><strong>{currency(vendor.startingPrice)}</strong></div>
          <div className="vendor-card-actions">
            {vendor.verified && <span className="verified-mini" title="Verified vendor"><ShieldCheck size={15} /></span>}
            <AppButton variant="secondary" className="vendor-book-quick" onClick={onBook}>Book</AppButton>
          </div>
        </div>
      </div>
    </article>
  );
}

function BookingDialog({
  vendor,
  packageName,
  event,
  successId,
  onConfirm,
  onClose,
  onDone,
}: {
  vendor: Vendor;
  packageName: string;
  event: EventDetails;
  successId: string | null;
  onConfirm: () => void;
  onClose: () => void;
  onDone: () => void;
}) {
  const chosenPackage = vendor.packages.find((item) => item.name === packageName) ?? vendor.packages[1];
  const customerFee = Math.round(chosenPackage.price * 0.025);
  const vendorFee = Math.round(chosenPackage.price * 0.025);
  const total = chosenPackage.price + customerFee;
  const advance = Math.round(total * 0.1);
  const secondPayment = Math.round(total * 0.4);
  const finalPayment = total - advance - secondPayment;
  const beforeEvent = new Date(`${event.date}T12:00:00`);
  if (!Number.isNaN(beforeEvent.getTime())) beforeEvent.setDate(beforeEvent.getDate() - 14);
  const secondDate = Number.isNaN(beforeEvent.getTime()) ? "Before your event" : shortDate(beforeEvent.toISOString().slice(0, 10));

  return (
    <ModalFrame onClose={onClose} label={successId ? "Booking confirmed" : "Review your booking"} wide>
      {successId ? (
        <div className="booking-success">
          <span className="success-orbit"><CheckCircle2 size={34} /></span>
          <span className="eyebrow">It’s official (well, almost!)</span>
          <h2>Booking request <em>sent.</em></h2>
          <p>Your 10% simulated advance is noted. {vendor.name} will be asked to confirm your date.</p>
          <div className="booking-id-box"><span>Your booking reference</span><strong>{successId}</strong></div>
          <div className="success-note"><Sparkles size={16} /> No real payment has been taken in this demo.</div>
          <AppButton onClick={onDone}>View my bookings <ArrowRight size={16} /></AppButton>
        </div>
      ) : (
        <div className="checkout-layout">
          <div className="checkout-main">
            <span className="eyebrow">Almost there · 02 of 02</span>
            <h2>Make it <em>official.</em></h2>
            <p className="checkout-copy">Review the details, then send your booking request. Your advance is simulated—no real payment is collected.</p>
            <div className="checkout-vendor-card">
              <div className="checkout-vendor-photo" style={{ backgroundImage: `url("${vendor.image}")` }} />
              <div><span className="eyebrow">{vendor.category}</span><strong>{vendor.name}</strong><span>{packageName} package</span></div>
              {vendor.verified && <ShieldCheck size={19} className="verified-icon" />}
            </div>
            <div className="checkout-event-row"><span><CalendarDays size={16} /> {event.name}</span><span>{formattedDate(event.date)}</span></div>
            <div className="checkout-event-row"><span><MapPin size={16} /> {event.location}</span><span>{formatCount(event.guests)} guests</span></div>
            <h3 className="checkout-section-title">Your payment plan</h3>
            <div className="payment-milestones">
              <div className="milestone-item milestone-now"><span className="milestone-number">01</span><div><strong>Booking advance · 10%</strong><span>Due today to request your date</span></div><b>{currency(advance)}</b></div>
              <div className="milestone-item"><span className="milestone-number">02</span><div><strong>Before the event · 40%</strong><span>Due {secondDate}</span></div><b>{currency(secondPayment)}</b></div>
              <div className="milestone-item"><span className="milestone-number">03</span><div><strong>Final payment · 50%</strong><span>On {shortDate(event.date)}</span></div><b>{currency(finalPayment)}</b></div>
            </div>
          </div>
          <aside className="checkout-summary">
            <span className="eyebrow">A clear breakdown</span>
            <h3>Every rupee, <em>accounted for.</em></h3>
            <div className="checkout-price-row"><span>{packageName} package</span><strong>{currency(chosenPackage.price)}</strong></div>
            <div className="checkout-price-row"><span>Customer platform fee <small>2.5%</small></span><strong>{currency(customerFee)}</strong></div>
            <div className="checkout-total"><span>Total you pay</span><strong>{currency(total)}</strong></div>
            <div className="checkout-commission"><ShieldCheck size={17} /><div><strong>Simple, transparent pricing</strong><p>We also retain {currency(vendorFee)} (2.5%) from the vendor. Total platform commission: {currency(customerFee + vendorFee)} (5%).</p></div></div>
            <div className="checkout-demo"><CreditCard size={16} /><span>Prototype only · no real transaction</span></div>
            <AppButton className="checkout-confirm" onClick={onConfirm}>Pay {currency(advance)} advance & send <ArrowRight size={16} /></AppButton>
            <button className="text-button checkout-back" type="button" onClick={onClose}><ArrowLeft size={14} /> I’d like to review the package</button>
          </aside>
        </div>
      )}
    </ModalFrame>
  );
}

function CompactStat({ icon: Icon, label, value, note, tint = "sage" }: { icon: LucideIcon; label: string; value: string; note: string; tint?: string }) {
  return (
    <div className="compact-stat"><span className={`stat-icon tint-${tint}`}><Icon size={18} strokeWidth={1.7} /></span><span className="compact-stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div>
  );
}

function EventAffair() {
  const [page, setPage] = useState<PageKey>("home");
  const [role, setRole] = useState<Role>("customer");
  const [event, setEvent] = useState<EventDetails>(initialEvent);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [tasks, setTasks] = useState<EventTask[]>(initialTasks);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [profileName, setProfileName] = useState("Rahul Mehta");
  const [profileEmail, setProfileEmail] = useState("rahul.mehta@email.com");
  const [vendorBusinessName, setVendorBusinessName] = useState(vendors[0].name);
  const [vendorDescription, setVendorDescription] = useState(vendors[0].description);
  const [vendorLocation, setVendorLocation] = useState(vendors[0].location);
  const [vendorPrices, setVendorPrices] = useState<number[]>(vendors[0].packages.map((item) => item.price));
  const [vendorTakingEnquiries, setVendorTakingEnquiries] = useState(true);
  const [vendorServiceCategory, setVendorServiceCategory] = useState<Category>("Catering");
  const [vendorServices, setVendorServices] = useState<string[]>(vendors[0].services);
  const [vendorCancellationPolicy, setVendorCancellationPolicy] = useState("Booking advances are non-refundable within 14 days of the event. Please contact us to discuss any changes.");
  const [vendorContactEmail, setVendorContactEmail] = useState("hello@auraevents.in");
  const [hydrated, setHydrated] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0].id);
  const [selectedPackage, setSelectedPackage] = useState("Signature");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [priceFilter, setPriceFilter] = useState("Any budget");
  const [ratingFilter, setRatingFilter] = useState("Any rating");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState("All event types");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [guestSearch, setGuestSearch] = useState("");
  const [guestStatusFilter, setGuestStatusFilter] = useState("All guests");
  const [guestNameInput, setGuestNameInput] = useState("");
  const [guestEmailInput, setGuestEmailInput] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [messageHistory, setMessageHistory] = useState<string[]>([
    "Hi Rahul, we’ve received your event brief. The live counter menu sounds lovely—shall we chat through a few options?",
    "Absolutely! I’d love to explore the seasonal Gujarati menu. We’re expecting around 150 guests.",
  ]);
  const [verificationQueue, setVerificationQueue] = useState(["The Velvet Grove", "Citylights Transit"]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PersistedDemo>;
        if (saved.event) setEvent(saved.event);
        if (Array.isArray(saved.bookings)) setBookings(saved.bookings);
        if (Array.isArray(saved.guests)) setGuests(saved.guests);
        if (Array.isArray(saved.tasks)) setTasks(saved.tasks);
        if (Array.isArray(saved.budgetItems)) setBudgetItems(saved.budgetItems);
        if (saved.role) setRole(saved.role);
        if (saved.profileName) setProfileName(saved.profileName);
        if (saved.profileEmail) setProfileEmail(saved.profileEmail);
        if (saved.vendorBusinessName) setVendorBusinessName(saved.vendorBusinessName);
        if (saved.vendorDescription) setVendorDescription(saved.vendorDescription);
        if (saved.vendorLocation) setVendorLocation(saved.vendorLocation);
        if (Array.isArray(saved.vendorPrices)) setVendorPrices(saved.vendorPrices);
        if (typeof saved.vendorTakingEnquiries === "boolean") setVendorTakingEnquiries(saved.vendorTakingEnquiries);
        if (saved.vendorServiceCategory) setVendorServiceCategory(saved.vendorServiceCategory);
        if (Array.isArray(saved.vendorServices)) setVendorServices(saved.vendorServices);
        if (saved.vendorCancellationPolicy) setVendorCancellationPolicy(saved.vendorCancellationPolicy);
        if (saved.vendorContactEmail) setVendorContactEmail(saved.vendorContactEmail);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const saved: PersistedDemo = {
      event,
      bookings,
      guests,
      tasks,
      budgetItems,
      role,
      profileName,
      profileEmail,
      vendorBusinessName,
      vendorDescription,
      vendorLocation,
      vendorPrices,
      vendorTakingEnquiries,
      vendorServiceCategory,
      vendorServices,
      vendorCancellationPolicy,
      vendorContactEmail,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(saved));
  }, [hydrated, event, bookings, guests, tasks, budgetItems, role, profileName, profileEmail, vendorBusinessName, vendorDescription, vendorLocation, vendorPrices, vendorTakingEnquiries, vendorServiceCategory, vendorServices, vendorCancellationPolicy, vendorContactEmail]);

  useEffect(() => {
    if (!hydrated || role === "customer" || page !== "home") return;
    setPage(role === "vendor" ? "vendor-dashboard" : "admin-dashboard");
  }, [hydrated, role, page]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const appVendors = useMemo(() => vendors.map((vendor) => {
    if (vendor.id !== "aura-events") return vendor;
    return {
      ...vendor,
      name: vendorBusinessName,
      description: vendorDescription,
      location: vendorLocation,
      category: vendorServiceCategory,
      services: vendorServices,
      available: vendorTakingEnquiries,
      cancellationPolicy: vendorCancellationPolicy,
      contactEmail: vendorContactEmail,
      startingPrice: vendorPrices[0] ?? vendor.startingPrice,
      packages: vendor.packages.map((item, index) => ({ ...item, price: vendorPrices[index] ?? item.price })),
    };
  }), [vendorBusinessName, vendorDescription, vendorLocation, vendorPrices, vendorTakingEnquiries, vendorServiceCategory, vendorServices]);
  const activeVendor = appVendors.find((vendor) => vendor.id === selectedVendorId) ?? appVendors[0];
  const activeBookingVendor = appVendors.find((vendor) => vendor.id === bookingTarget?.vendorId) ?? appVendors[0];
  const activeBooking = bookings.find((booking) => booking.id === bookingSuccessId);
  const filteredVendors = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const priceCeiling = priceFilter === "Under ₹20,000" ? 20000 : priceFilter === "Under ₹40,000" ? 40000 : priceFilter === "Under ₹75,000" ? 75000 : Infinity;
    const ratingFloor = ratingFilter === "4.8+ stars" ? 4.8 : ratingFilter === "4.5+ stars" ? 4.5 : 0;
    return appVendors.filter((vendor) => {
      const searchable = [vendor.name, vendor.category, vendor.location, vendor.services.join(" "), vendor.tagline, vendor.description].join(" ").toLowerCase();
      return terms.every((term) => searchable.includes(term))
        && (categoryFilter === "All categories" || vendor.category === categoryFilter)
        && (locationFilter === "All locations" || vendor.location === locationFilter)
        && vendor.startingPrice <= priceCeiling
        && vendor.rating >= ratingFloor
        && (!availabilityOnly || vendor.available)
        && (eventTypeFilter === "All event types" || !allDemoEventTypes.includes(eventTypeFilter) || (eventCategories[eventTypeFilter]?.includes(vendor.category) ?? true));
    });
  }, [appVendors, query, categoryFilter, locationFilter, priceFilter, ratingFilter, availabilityOnly, eventTypeFilter]);
  const eventBookings = bookings.filter((booking) => booking.eventName === event.name && booking.status !== "Declined");
  const isSeedEvent = event.name === initialEvent.name && event.date === initialEvent.date;
  const bookingsCreatedForEvent = eventBookings.filter((booking) => booking.created).length;
  const committed = eventBookings.reduce((sum, booking) => sum + booking.baseAmount, 0);
  const remaining = event.budget - committed;
  const completedTasks = tasks.filter((task) => task.done).length;
  const guestCounts = guests.reduce((counts, guest) => {
    counts[guest.status] += 1;
    return counts;
  }, { Confirmed: 0, Pending: 0, Declined: 0 });
  const createdForEvent = bookingsCreatedForEvent;
  const planningProgress = isSeedEvent
    ? Math.max(8, Math.min(100, Math.round(35 + createdForEvent * 5 + (completedTasks - 18) * 1.5 + (guestCounts.Confirmed - 113) * 0.1)))
    : Math.round((Math.min(createdForEvent / Math.max(1, Math.min(event.requirements.length, 8)), 1) * 40) + (completedTasks / Math.max(tasks.length, 1) * 30) + (guestCounts.Confirmed / Math.max(event.guests, 1) * 30));

  const navigate = (next: PageKey) => {
    setPage(next);
    setMobileMenuOpen(false);
    setRoleMenuOpen(false);
    setNotificationsOpen(false);
  };

  const openVendor = (vendor: Vendor) => {
    setSelectedVendorId(vendor.id);
    setSelectedPackage(vendor.packages[1]?.name ?? vendor.packages[0].name);
    navigate("vendor-profile");
  };

  const openBooking = (vendor: Vendor, packageName?: string) => {
    if (!vendor.available) {
      setToast(`${vendor.name} is checking availability for new dates.`);
      return;
    }
    setSelectedVendorId(vendor.id);
    setSelectedPackage(packageName ?? vendor.packages[1]?.name ?? vendor.packages[0].name);
    setBookingTarget({ vendorId: vendor.id, packageName: packageName ?? vendor.packages[1]?.name ?? vendor.packages[0].name });
    setBookingSuccessId(null);
  };

  const createEvent = (createdEvent: EventDetails) => {
    setEvent(createdEvent);
    setBudgetItems(createBudgetItems(createdEvent.budget));
    const guestTotal = Math.max(0, Math.min(createdEvent.guests, 1000));
    const confirmedLimit = Math.round(guestTotal * (113 / 150));
    const pendingLimit = Math.round(guestTotal * (135 / 150));
    setGuests(Array.from({ length: guestTotal }, (_, index) => {
      const sample = initialGuests[index % initialGuests.length];
      const baseName = sample.name.split(" · ")[0];
      const number = String(index + 1).padStart(3, "0");
      return {
        id: `guest-${Date.now()}-${index}`,
        name: index < initialGuests.length ? sample.name : `${baseName} · ${number}`,
        email: `guest.${number}@example.com`,
        status: index < confirmedLimit ? "Confirmed" : index < pendingLimit ? "Pending" : "Declined",
      };
    }));
    setTasks(initialTasks.map((task) => ({ ...task, done: false })));
    setWizardOpen(false);
    setPage("dashboard");
    setToast(`${createdEvent.name} is ready for the good stuff.`);
  };

  const sendBookingRequest = () => {
    const chosenPackage = activeBookingVendor.packages.find((item) => item.name === bookingTarget?.packageName) ?? activeBookingVendor.packages[1];
    if (!chosenPackage) return;
    const customerFee = Math.round(chosenPackage.price * 0.025);
    const vendorFee = Math.round(chosenPackage.price * 0.025);
    const customerTotal = chosenPackage.price + customerFee;
    const advance = Math.round(customerTotal * 0.1);
    const nextPaymentDate = new Date(`${event.date}T12:00:00`);
    if (!Number.isNaN(nextPaymentDate.getTime())) nextPaymentDate.setDate(nextPaymentDate.getDate() - 14);
    const dueDate = Number.isNaN(nextPaymentDate.getTime()) ? event.date : nextPaymentDate.toISOString().slice(0, 10);
    const id = `TEA-${String(Date.now()).slice(-6)}`;
    const booking: Booking = {
      id,
      vendorId: activeBookingVendor.id,
      vendorName: activeBookingVendor.name,
      category: activeBookingVendor.category,
      eventName: event.name,
      date: event.date,
      location: event.location,
      guests: event.guests,
      packageName: bookingTarget?.packageName ?? "Signature",
      baseAmount: chosenPackage.price,
      customerFee,
      vendorFee,
      customerTotal,
      paid: advance,
      dueDate,
      status: "Pending vendor",
      created: true,
    };
    setBookings((current) => [booking, ...current]);
    setBookingSuccessId(id);
    setToast(`Your request is with ${activeBookingVendor.name}.`);
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const booking = bookings.find((item) => item.id === id);
    setBookings((current) => current.map((item) => item.id === id ? { ...item, status, ...(status === "Declined" ? { paid: 0 } : {}) } : item));
    if (booking) setToast(status === "Confirmed" ? `${booking.vendorName} booking confirmed. Wonderful!` : `${booking.vendorName} request declined. Your simulated advance has been returned.`);
  };

  const setUserRole = (nextRole: Role) => {
    setRole(nextRole);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
    setPage(nextRole === "customer" ? "home" : nextRole === "vendor" ? "vendor-dashboard" : "admin-dashboard");
    setToast(nextRole === "customer" ? "Welcome back, Rahul." : nextRole === "vendor" ? "Previewing the vendor studio." : "Admin workspace is ready.");
  };

  const updateGuestStatus = (id: string, status: Guest["status"]) => {
    setGuests((current) => current.map((guest) => guest.id === id ? { ...guest, status } : guest));
  };

  const addGuest = (eventForm: FormEvent<HTMLFormElement>) => {
    eventForm.preventDefault();
    if (!guestNameInput.trim() || !guestEmailInput.trim()) return;
    const guest: Guest = { id: `guest-${Date.now()}`, name: guestNameInput.trim(), email: guestEmailInput.trim(), status: "Pending" };
    setGuests((current) => [guest, ...current]);
    setGuestNameInput("");
    setGuestEmailInput("");
    setToast(`${guest.name} has been added to the guest list.`);
  };

  const sendMessage = (eventForm: FormEvent<HTMLFormElement>) => {
    eventForm.preventDefault();
    if (!messageDraft.trim()) return;
    setMessageHistory((current) => [...current, messageDraft.trim()]);
    setMessageDraft("");
    setToast("Your message has been sent.");
  };

  const pageTitle = role === "customer" ? "Rahul" : role === "vendor" ? "Aura Events & Catering" : "Affair admin";
  const currentNav = roleNavigation[role];
  const currentActive = page === "vendor-profile" ? "vendors" : page === "budget" ? "dashboard" : page === "profile" ? "" : page;
  const liveNotifications = [
    { icon: CheckCircle2, title: "Your booking is in good hands.", body: "Aura Events confirmed your catering booking.", time: "12 min ago" },
    { icon: Wallet, title: "A little payment reminder.", body: `${currency(24000)} due on ${shortDate("2026-12-01")} for Aura Events.`, time: "Today" },
    { icon: CalendarDays, title: "The date is getting closer.", body: "Your celebration is on 15 December 2026.", time: "Yesterday" },
    { icon: ListChecks, title: "Four lovely details still to do.", body: "A few tasks are waiting for your attention.", time: "Yesterday" },
  ];

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand-lockup" type="button" onClick={() => navigate(role === "customer" ? "home" : role === "vendor" ? "vendor-dashboard" : "admin-dashboard")} aria-label="The Event Affair home">
          <span className="brand-monogram">E<span>·</span>A</span>
          <span className="brand-words"><strong>THE EVENT AFFAIR</strong><small>PLAN. CONNECT. CELEBRATE.</small></span>
        </button>
        <nav className="desktop-navigation" aria-label={`${role} navigation`}>
          {currentNav.map((item) => {
            const Icon = item.icon;
            return <button className={`nav-link ${currentActive === item.page ? "nav-link-active" : ""}`} type="button" key={item.page} onClick={() => navigate(item.page)}><Icon size={15} strokeWidth={1.8} /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className="header-actions">
          <form className="global-search" onSubmit={(submitEvent) => { submitEvent.preventDefault(); setRole("customer"); navigate("vendors"); }}>
            <Search size={16} />
            <input aria-label="Search vendors, services, and locations" value={query} onChange={(changeEvent) => setQuery(changeEvent.target.value)} onFocus={() => { if (role !== "customer") setToast("Switch to the customer view to browse vendors."); }} placeholder="Find something lovely…" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={14} /></button>}
          </form>
          <div className="header-popover-anchor">
            <button className={`icon-button notification-button ${notificationsOpen ? "icon-button-active" : ""}`} type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setRoleMenuOpen(false); }}><Bell size={18} /><span className="notification-dot" /></button>
            {notificationsOpen && <div className="notifications-popover"><div className="popover-heading"><strong>The little updates</strong><button type="button" className="text-button" onClick={() => setNotificationsOpen(false)}>Close</button></div>{liveNotifications.map((notification) => { const Icon = notification.icon; return <div className="notification-row" key={notification.title}><span className="notification-icon"><Icon size={16} /></span><div><strong>{notification.title}</strong><p>{notification.body}</p><small>{notification.time}</small></div></div>; })}<button className="notifications-link" type="button" onClick={() => { setNotificationsOpen(false); navigate(role === "vendor" ? "vendor-messages" : "messages"); }}>Go to your messages <ArrowRight size={14} /></button></div>}
          </div>
          <div className="header-popover-anchor role-anchor">
            <button className="account-button" type="button" aria-expanded={roleMenuOpen} onClick={() => { setRoleMenuOpen((open) => !open); setNotificationsOpen(false); }}>
              <span className="avatar avatar-small">{role === "customer" ? "R" : role === "vendor" ? "A" : "E"}</span>
              <span className="account-name">{role === "customer" ? pageTitle : role === "vendor" ? "Aura Studio" : "Admin"}</span><ChevronDown size={14} />
            </button>
            {roleMenuOpen && <div className="role-popover"><span className="role-popover-label">DEMO EXPERIENCES</span><button type="button" onClick={() => setUserRole("customer")}><span className="role-menu-icon"><Users size={16} /></span><span><strong>Customer</strong><small>Plan & book an event</small></span>{role === "customer" && <Check size={15} />}</button><button type="button" onClick={() => setUserRole("vendor")}><span className="role-menu-icon"><Sparkles size={16} /></span><span><strong>Vendor studio</strong><small>Manage requests & profile</small></span>{role === "vendor" && <Check size={15} />}</button><button type="button" onClick={() => setUserRole("admin")}><span className="role-menu-icon"><ShieldCheck size={16} /></span><span><strong>Platform admin</strong><small>Review the marketplace</small></span>{role === "admin" && <Check size={15} />}</button>{role === "customer" && <button type="button" onClick={() => navigate("profile")}><span className="role-menu-icon"><Users size={16} /></span><span><strong>My profile</strong><small>Your details & preferences</small></span><ChevronRight size={15} /></button>}<div className="role-menu-note">One click to explore every side of the experience.</div></div>}
          </div>
          <button className="mobile-menu-toggle icon-button" type="button" aria-label="Open navigation" onClick={() => setMobileMenuOpen((open) => !open)}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {mobileMenuOpen && <div className="mobile-menu"><span className="mobile-menu-label">{role === "customer" ? "YOUR CELEBRATION" : role === "vendor" ? "VENDOR STUDIO" : "ADMINISTRATION"}</span>{currentNav.map((item) => { const Icon = item.icon; return <button type="button" key={item.page} onClick={() => navigate(item.page)} className={currentActive === item.page ? "mobile-nav-active" : ""}><Icon size={17} />{item.label}<ChevronRight size={15} /></button>; })}<button type="button" className="mobile-mode-switch" onClick={() => setRoleMenuOpen((open) => !open)}><Sparkles size={16} />Switch experience<ChevronDown size={14} /></button>{roleMenuOpen && <div className="mobile-role-switches"><button type="button" onClick={() => setUserRole("customer")}>Customer experience</button><button type="button" onClick={() => setUserRole("vendor")}>Vendor studio</button><button type="button" onClick={() => setUserRole("admin")}>Admin preview</button></div>}</div>}
      </header>

      <main className={`main-content ${page === "home" ? "main-home" : ""}`}>
        {role === "customer" && page === "home" && (
          <HomePage
            event={event}
            vendors={appVendors}
            onPlan={() => setWizardOpen(true)}
            onExplore={() => navigate("vendors")}
            onViewVendor={openVendor}
            onBookVendor={(vendor) => openBooking(vendor)}
          />
        )}

        {role === "customer" && page === "dashboard" && (
          <CustomerDashboard
            event={event}
            guestsConfirmed={guestCounts.Confirmed}
            completedTasks={completedTasks}
            taskCount={tasks.length}
            vendorCount={Math.min((isSeedEvent ? 5 : 0) + bookingsCreatedForEvent, 8)}
            committed={committed}
            remaining={remaining}
            progress={planningProgress}
            bookings={eventBookings}
            budgetItems={budgetItems}
            onStart={() => setWizardOpen(true)}
            onGo={navigate}
            onBudgetChange={(id, value) => setBudgetItems((current) => current.map((item) => item.id === id ? { ...item, amount: value } : item))}
            onBrowse={() => navigate("vendors")}
          />
        )}

        {role === "customer" && page === "budget" && (
          <BudgetPage event={event} budgetItems={budgetItems} committed={committed} onChange={(id, value) => setBudgetItems((current) => current.map((item) => item.id === id ? { ...item, amount: value } : item))} onBack={() => navigate("dashboard")} />
        )}

        {role === "customer" && page === "vendors" && (
          <Marketplace
            vendors={filteredVendors}
            query={query}
            onQuery={setQuery}
            category={categoryFilter}
            onCategory={setCategoryFilter}
            location={locationFilter}
            onLocation={setLocationFilter}
            price={priceFilter}
            onPrice={setPriceFilter}
            rating={ratingFilter}
            onRating={setRatingFilter}
            availability={availabilityOnly}
            onAvailability={setAvailabilityOnly}
            eventType={eventTypeFilter}
            onEventType={setEventTypeFilter}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            onClearFilters={() => { setQuery(""); setCategoryFilter("All categories"); setLocationFilter("All locations"); setPriceFilter("Any budget"); setRatingFilter("Any rating"); setAvailabilityOnly(false); setEventTypeFilter("All event types"); }}
            onView={openVendor}
            onBook={(vendor) => openBooking(vendor)}
          />
        )}

        {role === "customer" && page === "vendor-profile" && (
          <VendorProfile
            vendor={activeVendor}
            event={event}
            selectedPackage={selectedPackage}
            onSelectPackage={setSelectedPackage}
            onBook={() => openBooking(activeVendor, selectedPackage)}
            onMessage={() => navigate("messages")}
            onBack={() => navigate("vendors")}
          />
        )}

        {role === "customer" && page === "bookings" && (
          <CustomerBookings bookings={bookings} onBrowse={() => navigate("vendors")} />
        )}

        {role === "customer" && page === "guests" && (
          <GuestManagement
            guests={guests}
            counts={guestCounts}
            search={guestSearch}
            onSearch={setGuestSearch}
            filter={guestStatusFilter}
            onFilter={setGuestStatusFilter}
            name={guestNameInput}
            onName={setGuestNameInput}
            email={guestEmailInput}
            onEmail={setGuestEmailInput}
            onAdd={addGuest}
            onUpdateStatus={updateGuestStatus}
            onRemove={(id) => { setGuests((current) => current.filter((guest) => guest.id !== id)); setToast("Guest removed from your list."); }}
            onInvite={() => setToast("Your invitations are ready to send. This demo simulates delivery.")}
          />
        )}

        {role === "customer" && page === "tasks" && (
          <TasksPage tasks={tasks} onToggle={(id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task))} onAdd={() => { const label = window.prompt("What would you like to remember?"); if (label?.trim()) setTasks((current) => [...current, { id: `task-${Date.now()}`, label: label.trim(), done: false }]); }} />
        )}

        {(role === "customer" && page === "messages") || (role === "vendor" && page === "vendor-messages") ? (
          <MessagesPage role={role} messages={messageHistory} draft={messageDraft} onDraft={setMessageDraft} onSend={sendMessage} />
        ) : null}

        {role === "customer" && page === "profile" && (
          <ProfilePage name={profileName} email={profileEmail} onName={setProfileName} onEmail={setProfileEmail} onSave={() => setToast("Your profile has been updated.")} />
        )}

        {role === "vendor" && page === "vendor-dashboard" && (
          <VendorDashboard bookings={bookings} vendorName={vendorBusinessName} onNavigate={navigate} onStatus={updateBookingStatus} onMessage={() => navigate("vendor-messages")} />
        )}
        {role === "vendor" && page === "vendor-bookings" && (
          <VendorBookings bookings={bookings} onStatus={updateBookingStatus} />
        )}
        {role === "vendor" && page === "calendar" && (
          <CalendarPage event={event} bookings={bookings} />
        )}
        {role === "vendor" && page === "services" && (
          <VendorServices vendorName={vendorBusinessName} category={vendorServiceCategory} location={vendorLocation} prices={vendorPrices} onPrice={(index, value) => setVendorPrices((current) => current.map((price, itemIndex) => itemIndex === index ? value : price))} />
        )}
        {role === "vendor" && page === "earnings" && (
          <EarningsPage bookings={bookings} />
        )}
        {role === "vendor" && page === "vendor-profile-management" && (
          <VendorProfileManagement name={vendorBusinessName} description={vendorDescription} location={vendorLocation} prices={vendorPrices} availability={vendorTakingEnquiries} category={vendorServiceCategory} services={vendorServices} cancellationPolicy={vendorCancellationPolicy} contactEmail={vendorContactEmail} onName={setVendorBusinessName} onDescription={setVendorDescription} onLocation={setVendorLocation} onPrice={(index, value) => setVendorPrices((current) => current.map((price, itemIndex) => index === itemIndex ? value : price))} onAvailability={setVendorTakingEnquiries} onCategory={setVendorServiceCategory} onServices={setVendorServices} onCancellationPolicy={setVendorCancellationPolicy} onContactEmail={setVendorContactEmail} onSave={() => setToast("Your vendor profile is saved and live in the marketplace.")} />
        )}

        {role === "admin" && page === "admin-dashboard" && (
          <AdminDashboard bookings={bookings} onNavigate={navigate} />
        )}
        {role === "admin" && page === "admin-users" && <AdminUsers />}
        {role === "admin" && page === "admin-vendors" && <AdminVendors vendors={appVendors} queue={verificationQueue} onVerify={(name) => { setVerificationQueue((current) => current.filter((item) => item !== name)); setToast(`${name} has been verified.`); }} />}
        {role === "admin" && page === "admin-events" && <AdminEvents event={event} bookings={bookings} onOpen={() => { setRole("customer"); navigate("dashboard"); }} />}
        {role === "admin" && page === "admin-bookings" && <AdminBookings bookings={bookings} />}
        {role === "admin" && page === "transactions" && <TransactionsPage bookings={bookings} />}
        {role === "admin" && page === "analytics" && <AnalyticsPage bookings={bookings} />}
      </main>

      <footer className="site-footer"><button className="footer-brand" type="button" onClick={() => setUserRole("customer")}><span className="brand-monogram">E<span>·</span>A</span><strong>THE EVENT AFFAIR</strong></button><span>Plan. Connect. Celebrate.</span><button type="button" onClick={() => setToast("You’re in a prototype. No real payments are processed.")}><CircleHelp size={14} /> A little help</button><small>Thoughtfully made for the moments that matter. © 2026</small></footer>

      {wizardOpen && <EventWizard initial={event} onClose={() => setWizardOpen(false)} onCreate={createEvent} />}
      {bookingTarget && <BookingDialog vendor={activeBookingVendor} packageName={bookingTarget.packageName} event={event} successId={bookingSuccessId} onConfirm={sendBookingRequest} onClose={() => { setBookingTarget(null); setBookingSuccessId(null); }} onDone={() => { setBookingTarget(null); setBookingSuccessId(null); navigate("bookings"); }} />}
      {toast && <div className="toast-message" role="status"><span><Check size={15} /></span>{toast}<button type="button" onClick={() => setToast("")} aria-label="Dismiss notification"><X size={14} /></button></div>}
    </div>
  );
}

function HomePage({
  event,
  vendors: featuredVendors,
  onPlan,
  onExplore,
  onViewVendor,
  onBookVendor,
}: {
  event: EventDetails;
  vendors: Vendor[];
  onPlan: () => void;
  onExplore: () => void;
  onViewVendor: (vendor: Vendor) => void;
  onBookVendor: (vendor: Vendor) => void;
}) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-kicker"><span /> A NEW WAY TO GATHER <span /></span>
          <h1>Your entire event,<br />beautifully planned<br /><em>in one place.</em></h1>
          <p>Discover venues, vendors, and the little details that turn your idea into a memory you’ll keep.</p>
          <div className="hero-actions"><AppButton className="hero-primary" onClick={onPlan}>Plan my event <ArrowRight size={16} /></AppButton><AppButton variant="quiet" className="hero-secondary" onClick={onExplore}>Explore vendors <ArrowUpRight size={16} /></AppButton></div>
          <div className="hero-trust"><div className="avatar-stack"><span>R</span><span>M</span><span>A</span><span>+</span></div><div><span className="trust-stars">★★★★★</span><small>Made for the moments that matter</small></div></div>
        </div>
        <div className="hero-visual" role="img" aria-label="Warm, candlelit garden celebration under the evening sky">
          <div className="hero-visual-shade" />
          <div className="hero-photo-caption"><span className="caption-line" /><div><small>A night to remember</small><strong>Meera & Arjun · Ahmedabad</strong></div><span className="caption-year">’26</span></div>
          <div className="floating-note"><span className="floating-note-icon"><Check size={14} /></span><span><strong>One lovely plan.</strong><small>All together, finally.</small></span><Sparkles size={18} /></div>
          <div className="hero-image-index">01 <span /> 03</div>
        </div>
        <div className="hero-side-label">FOR THE MOMENTS THAT MATTER</div>
        <div className="hero-bottom-note"><span>01 — 03</span><span>Planning, made personal</span><ArrowDownRight size={16} /></div>
      </section>

      <section className="intro-strip"><span>THE DETAILS. THE PEOPLE. THE FEELING.</span><p>Everything that makes an event <em>yours.</em></p><span className="intro-strip-right">A good thing starts here <ArrowRight size={14} /></span></section>

      <section className="steps-section section-pad" id="how-it-works">
        <div className="section-heading-row"><div><span className="eyebrow">IT STARTS WITH A FEELING</span><h2>From “what if” to <em>what a night.</em></h2></div><p>The best celebrations don’t happen by chance. They happen when every little detail finds its place.</p></div>
        <div className="steps-grid">
          {[
            { n: "01", icon: Sparkles, title: "Tell us your vision", text: "Choose your event, budget, location, guests, and the feeling you want to create." },
            { n: "02", icon: Search, title: "Find your people", text: "Explore thoughtful vendors, compare packages, and discover the perfect fit." },
            { n: "03", icon: HeartIcon, title: "Make it a memory", text: "Book, manage the little details, and be wonderfully present on the day." },
          ].map((step) => { const Icon = step.icon; return <article className="step-card" key={step.n}><div className="step-number">{step.n}<span><Icon size={19} strokeWidth={1.5} /></span></div><h3>{step.title}</h3><p>{step.text}</p><span className="step-line" /></article>; })}
        </div>
      </section>

      <section className="featured-section section-pad">
        <div className="section-heading-row"><div><span className="eyebrow">GOOD PEOPLE, GOOD PARTIES</span><h2>A few of our <em>favourites.</em></h2></div><AppButton variant="quiet" onClick={onExplore}>Meet all our vendors <ArrowRight size={15} /></AppButton></div>
        <div className="vendor-grid vendor-grid-featured">{featuredVendors.slice(0, 3).map((vendor) => <VendorCard key={vendor.id} vendor={vendor} onView={() => onViewVendor(vendor)} onBook={() => onBookVendor(vendor)} />)}</div>
      </section>

      <section className="home-quote section-pad"><div className="quote-mark">“</div><p>Good celebrations aren’t about getting everything perfect. They’re about being there for every <em>perfectly imperfect moment.</em></p><div className="quote-credit"><span /> THE EVENT AFFAIR WAY</div><button className="quote-cta" type="button" onClick={onPlan}>Let’s make something lovely <ArrowRight size={15} /></button></section>

      <section className="home-plan-cta"><div><span className="eyebrow eyebrow-light">YOUR NEXT CHAPTER BEGINS HERE</span><h2>Shall we make <em>some memories?</em></h2><p>One place for all the things that make your event yours.</p></div><AppButton variant="secondary" onClick={onPlan}>Start planning <ArrowRight size={16} /></AppButton><span className="cta-flower cta-flower-one">✳</span><span className="cta-flower cta-flower-two">✳</span></section>
    </>
  );
}

function CustomerDashboard({
  event,
  guestsConfirmed,
  completedTasks,
  taskCount,
  vendorCount,
  committed,
  remaining,
  progress,
  bookings,
  budgetItems,
  onStart,
  onGo,
  onBudgetChange,
  onBrowse,
}: {
  event: EventDetails;
  guestsConfirmed: number;
  completedTasks: number;
  taskCount: number;
  vendorCount: number;
  committed: number;
  remaining: number;
  progress: number;
  bookings: Booking[];
  budgetItems: BudgetItem[];
  onStart: () => void;
  onGo: (page: PageKey) => void;
  onBudgetChange: (id: string, value: number) => void;
  onBrowse: () => void;
}) {
  const allocationTotal = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const chartSegments = budgetItems.map((item, index) => {
    const start = budgetItems.slice(0, index).reduce((sum, current) => sum + current.amount, 0) / Math.max(allocationTotal, 1) * 100;
    const end = (start * allocationTotal / 100 + item.amount) / Math.max(allocationTotal, 1) * 100;
    return `${item.color} ${start}% ${end}%`;
  }).join(", ");
  const nextTask = ["Review the guest list", "Confirm your favourite DJ", "Choose the flowers"];
  const pendingBooking = bookings.find((booking) => booking.status === "Pending vendor");
  const upcomingPayments = bookings.reduce((sum, booking) => sum + Math.max(0, booking.baseAmount - booking.paid), 0);
  return (
    <div className="page-wrap dashboard-wrap">
      <div className="dashboard-welcome"><div><span className="eyebrow">TUESDAY, 10 NOVEMBER · YOUR EVENT STUDIO</span><h1>It’s all coming <em>together.</em></h1><p>A lovely little overview of everything you’re planning.</p></div><AppButton variant="secondary" onClick={onStart}><Plus size={15} /> Plan another event</AppButton></div>
      <section className="event-hero-card">
        <div className="event-hero-image" style={{ backgroundImage: "linear-gradient(90deg, rgba(21, 32, 26, .96) 0%, rgba(21, 32, 26, .78) 49%, rgba(21, 32, 26, .1) 100%), url('/images/event-hero.jpg')" }}>
          <div className="event-hero-content"><span className="event-live-tag"><span /> YOUR NEXT BIG MOMENT</span><h2>{event.name}</h2><div className="event-hero-details"><span><CalendarDays size={15} /> {formattedDate(event.date)}</span><span><MapPin size={15} /> {event.location}</span><span><Users size={15} /> {formatCount(event.guests)} guests</span></div><div className="event-style-pills">{event.styles.map((style) => <span key={style}>{style}</span>)}<span>{event.type}</span></div></div>
          <button className="event-edit-button" type="button" onClick={onStart}><Pencil size={14} /> Edit event</button>
        </div>
        <div className="event-progress-line"><div><span>THE PLAN IS SHAPING UP</span><strong>{progress}%</strong></div><span className="event-progress-track"><i style={{ width: `${progress}%` }} /></span><small>Every little step gets you closer to the moment.</small></div>
      </section>
      <div className="dashboard-stat-grid">
        <button type="button" className="dashboard-stat-card" onClick={() => onGo("bookings")}><span className="stat-icon tint-sage"><Sparkles size={19} /></span><span className="dashboard-stat-label">Vendors booked</span><strong>{vendorCount}<small> / 8</small></strong><span className="stat-card-note">{pendingBooking ? "One request to confirm" : "Your trusted little team"}<ArrowUpRight size={14} /></span></button>
        <button type="button" className="dashboard-stat-card" onClick={() => onGo("guests")}><span className="stat-icon tint-rose"><Users size={19} /></span><span className="dashboard-stat-label">Guests confirmed</span><strong>{formatCount(guestsConfirmed)}<small> / {formatCount(event.guests)}</small></strong><span className="stat-card-note">The people who make it special <ArrowUpRight size={14} /></span></button>
        <button type="button" className="dashboard-stat-card" onClick={() => onGo("tasks")}><span className="stat-icon tint-gold"><ListChecks size={19} /></span><span className="dashboard-stat-label">Little details done</span><strong>{completedTasks}<small> / {taskCount}</small></strong><span className="stat-card-note">Look at you, getting things done <ArrowUpRight size={14} /></span></button>
        <button type="button" className="dashboard-stat-card" onClick={() => onGo("bookings")}><span className="stat-icon tint-blue"><Wallet size={19} /></span><span className="dashboard-stat-label">Paid to date</span><strong>{currency(bookings.reduce((sum, booking) => sum + booking.paid, 0))}</strong><span className="stat-card-note">{currency(upcomingPayments)} upcoming <ArrowUpRight size={14} /></span></button>
      </div>
      <div className="dashboard-content-grid">
        <section className="dashboard-card budget-dashboard-card">
          <div className="dashboard-card-heading"><div><span className="eyebrow">MIND ON YOUR MONEY</span><h2>Budget, without <em>the guesswork.</em></h2></div><button type="button" className="text-button" onClick={() => onGo("budget")}>See full breakdown <ArrowRight size={14} /></button></div>
          <div className="dashboard-budget-content"><div className="donut-wrap"><div className="budget-donut" style={{ background: `conic-gradient(${chartSegments || "#e9e4da 0 100%"})` }}><div><span>YOUR PLAN</span><strong>{currency(event.budget)}</strong><small>total budget</small></div></div><span className="donut-caption"><span /> Your total budget</span></div><div className="budget-breakdown-list"><BudgetBreakdown items={budgetItems.slice(0, 5)} onChange={onBudgetChange} editable /><button type="button" className="budget-list-more" onClick={() => onGo("budget")}>Adjust all categories <ArrowRight size={13} /></button></div></div>
          <div className={`budget-summary-strip ${remaining < 0 ? "budget-summary-warning" : ""}`}><div><span>Total committed</span><strong>{currency(committed)}</strong></div><span className="budget-summary-divider" /><div><span>{remaining < 0 ? "Over budget by" : "Still lovely & unspent"}</span><strong>{currency(Math.abs(remaining))}</strong></div>{remaining < 0 && <span className="over-budget-note"><ArrowUpRight size={14} /> A little over your plan</span>}</div>
        </section>
        <section className="dashboard-card next-step-card"><div className="dashboard-card-heading"><div><span className="eyebrow">ONE THING AT A TIME</span><h2>Your next <em>little steps.</em></h2></div><span className="count-pill">{taskCount - completedTasks} left</span></div><div className="mini-task-list">{nextTask.map((label, index) => <div className="mini-task-row" key={label}><span className={`mini-task-check ${index === 0 ? "mini-task-done" : ""}`}>{index === 0 && <Check size={12} />}</span><span>{index === 0 ? "Confirm your favourite DJ" : label}</span><span className="task-priority">{index === 0 ? "TODAY" : "SOON"}</span></div>)}</div><button className="next-step-button" type="button" onClick={() => onGo("tasks")}>A little more on your list <ArrowRight size={15} /></button><div className="task-nudge"><Sparkles size={14} /> You’re doing beautifully. One thing at a time.</div></section>
      </div>
      <section className="upcoming-bookings-section"><div className="section-heading-row section-heading-compact"><div><span className="eyebrow">GOOD PEOPLE, GOOD PLANS</span><h2>Your vendors <em>so far.</em></h2></div><button type="button" className="text-button" onClick={() => onGo("bookings")}>All bookings <ArrowRight size={14} /></button></div>{bookings.length ? <div className="dashboard-bookings-list">{bookings.slice(0, 3).map((booking) => <BookingListRow key={booking.id} booking={booking} />)}</div> : <EmptyState icon={Sparkles} title="Your first booking is waiting." text="Find your people, choose a package, and let the good things begin." action={<AppButton onClick={onBrowse}>Explore vendors <ArrowRight size={14} /></AppButton>} />}</section>
      <section className="dashboard-find-cta"><span className="cta-icon"><Search size={19} /></span><div><strong>Still searching for your kind of magic?</strong><span>There’s someone wonderful for every little detail.</span></div><AppButton variant="secondary" onClick={onBrowse}>Find your people <ArrowRight size={15} /></AppButton></section>
    </div>
  );
}

function BudgetBreakdown({ items, onChange, editable }: { items: BudgetItem[]; onChange: (id: string, value: number) => void; editable: boolean }) {
  const maxAmount = Math.max(...items.map((item) => item.amount), 1);
  return <div className="budget-breakdown-list-inner">{items.map((item) => <div className="budget-row" key={item.id}><span className="budget-color-dot" style={{ background: item.color }} /><span className="budget-row-name">{item.name}</span>{editable ? <label className="budget-row-input-wrap"><span className="sr-only">Budget for {item.name}</span><span>₹</span><input type="number" min="0" step="1000" value={item.amount} onChange={(event) => onChange(item.id, Number(event.target.value))} /></label> : <strong>{currency(item.amount)}</strong>}<span className="budget-row-bar"><i style={{ background: item.color, width: `${Math.max(4, (item.amount / maxAmount) * 100)}%` }} /></span></div>)}</div>;
}

function BudgetPage({ event, budgetItems, committed, onChange, onBack }: { event: EventDetails; budgetItems: BudgetItem[]; committed: number; onChange: (id: string, value: number) => void; onBack: () => void }) {
  const allocated = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const remaining = event.budget - committed;
  return <div className="page-wrap"><PageIntro eyebrow="YOUR EVENT · THE MONEY BIT" title="A budget with a little <em>breathing room.</em>" description="Thoughtful estimates, committed bookings, and what’s still yours to play with." action={<AppButton variant="secondary" onClick={onBack}><ArrowLeft size={15} /> Back to my event</AppButton>} /><div className="budget-overview-grid"><div className="budget-total-card"><span className="eyebrow eyebrow-light">YOUR TOTAL EVENT BUDGET</span><strong>{currency(event.budget)}</strong><div className="budget-available-track"><span style={{ width: `${Math.min(100, Math.max(0, (committed / Math.max(event.budget, 1)) * 100))}%` }} /></div><div><span>{currency(committed)} committed</span><span>{currency(Math.max(0, remaining))} still available</span></div>{remaining < 0 && <p className="budget-warning"><ArrowUpRight size={15} /> You’re {currency(Math.abs(remaining))} over your current plan.</p>}</div><div className="budget-summary-cards"><div><span className="eyebrow">ESTIMATED ALLOCATION</span><strong>{currency(allocated)}</strong><small>{allocated > event.budget ? `${currency(allocated - event.budget)} over the total budget` : `${currency(event.budget - allocated)} unallocated`}</small></div><div><span className="eyebrow">COMMITTED TO VENDORS</span><strong>{currency(committed)}</strong><small>Base booking value, excluding platform fees</small></div><div><span className="eyebrow">STILL AVAILABLE</span><strong className={remaining < 0 ? "negative-amount" : ""}>{currency(remaining)}</strong><small>Estimated budget less confirmed & requested bookings</small></div></div></div><div className="budget-detail-card"><div className="dashboard-card-heading"><div><span className="eyebrow">MAKE IT ADD UP</span><h2>Every little <em>line item.</em></h2></div><span className="small-note">Change an estimate any time.</span></div><div className="budget-detail-layout"><div className="budget-chart-card"><BudgetDonut items={budgetItems} total={event.budget} /><p>These are planning estimates, not fixed prices. Update them whenever your plans change.</p></div><div className="budget-detail-rows"><BudgetBreakdown items={budgetItems} onChange={onChange} editable /><div className="budget-detail-total"><span>Estimated line items</span><strong className={allocated > event.budget ? "negative-amount" : ""}>{currency(allocated)}</strong></div>{allocated > event.budget && <div className="inline-warning"><ArrowUpRight size={16} /> These estimates are {currency(allocated - event.budget)} above your total budget. Consider adjusting a category.</div>}</div></div></div><div className="commission-explainer"><ShieldCheck size={20} /><div><strong>Our fees are always clear.</strong><p>The customer fee (2.5%) is shown at checkout. The vendor fee (2.5%) is deducted from the vendor’s earnings. Together, that’s a 5% platform commission. No surprise charges, ever.</p></div></div></div>;
}

function BudgetDonut({ items, total }: { items: BudgetItem[]; total: number }) {
  const sum = items.reduce((current, item) => current + item.amount, 0);
  const segments = items.map((item, index) => {
    const start = items.slice(0, index).reduce((current, previous) => current + previous.amount, 0) / Math.max(sum, 1) * 100;
    const end = (items.slice(0, index + 1).reduce((current, previous) => current + previous.amount, 0) / Math.max(sum, 1)) * 100;
    return `${item.color} ${start}% ${end}%`;
  }).join(", ");
  return <div className="budget-donut budget-donut-large" style={{ background: `conic-gradient(${segments || "#e9e4da 0 100%"})` }}><div><span>ESTIMATED</span><strong>{currency(total)}</strong><small>total budget</small></div></div>;
}

function Marketplace({
  vendors: results,
  query,
  onQuery,
  category,
  onCategory,
  location,
  onLocation,
  price,
  onPrice,
  rating,
  onRating,
  availability,
  onAvailability,
  eventType,
  onEventType,
  filtersOpen,
  onToggleFilters,
  onClearFilters,
  onView,
  onBook,
}: {
  vendors: Vendor[];
  query: string;
  onQuery: (value: string) => void;
  category: string;
  onCategory: (value: string) => void;
  location: string;
  onLocation: (value: string) => void;
  price: string;
  onPrice: (value: string) => void;
  rating: string;
  onRating: (value: string) => void;
  availability: boolean;
  onAvailability: (value: boolean) => void;
  eventType: string;
  onEventType: (value: string) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onView: (vendor: Vendor) => void;
  onBook: (vendor: Vendor) => void;
}) {
  const [sortOrder, setSortOrder] = useState("Recommended");
  const sortedResults = useMemo(() => {
    const sorted = [...results];
    if (sortOrder === "Highest rated") sorted.sort((a, b) => b.rating - a.rating);
    if (sortOrder === "Price: low to high") sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    if (sortOrder === "Most reviewed") sorted.sort((a, b) => b.reviews - a.reviews);
    return sorted;
  }, [results, sortOrder]);
  return <div className="page-wrap marketplace-wrap"><div className="marketplace-banner"><div className="marketplace-banner-photo" /><div className="marketplace-banner-content"><span className="eyebrow eyebrow-light">THE GOOD PEOPLE DIRECTORY</span><h1>Find your perfect <em>people.</em></h1><p>Wonderful vendors, thoughtful details, and the very best kind of yes.</p></div><div className="marketplace-banner-seal"><Sparkles size={17} /><span>GOOD<br />THINGS<br />GATHER</span></div></div><div className="marketplace-intro"><div><span className="eyebrow">A LOVELY PLACE TO BEGIN</span><h2>A little something for <em>every detail.</em></h2></div><span>{results.length} wonderful {results.length === 1 ? "find" : "finds"} to explore</span></div><div className="marketplace-search-row"><label className="marketplace-search"><Search size={18} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Try “DJ Ahmedabad” or “wedding catering”…" /><kbd>⌘ K</kbd></label><button className={`filter-toggle ${filtersOpen ? "filter-toggle-active" : ""}`} type="button" onClick={onToggleFilters}><SlidersHorizontal size={16} /> A few filters <ChevronDown size={14} /></button></div><div className="marketplace-filter-row"><div className="category-scroll"><button type="button" className={category === "All categories" ? "category-filter-active" : ""} onClick={() => onCategory("All categories")}>Everything</button>{categories.map((item) => <button type="button" key={item} className={category === item ? "category-filter-active" : ""} onClick={() => onCategory(item)}>{item}</button>)}</div><label className="marketplace-sort">Sort by <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option>Recommended</option><option>Highest rated</option><option>Price: low to high</option><option>Most reviewed</option></select></label></div>{filtersOpen && <div className="advanced-filters"><label>Location<select value={location} onChange={(event) => onLocation(event.target.value)}><option>All locations</option><option>Ahmedabad</option><option>Mumbai</option><option>Jaipur</option></select></label><label>Starting price<select value={price} onChange={(event) => onPrice(event.target.value)}><option>Any budget</option><option>Under ₹20,000</option><option>Under ₹40,000</option><option>Under ₹75,000</option></select></label><label>Guest favourites<select value={rating} onChange={(event) => onRating(event.target.value)}><option>Any rating</option><option>4.5+ stars</option><option>4.8+ stars</option></select></label><label>For your kind of day<select value={eventType} onChange={(event) => onEventType(event.target.value)}><option>All event types</option>{eventTypes.filter((type) => type !== "Other").map((type) => <option key={type}>{type}</option>)}</select></label><label className="available-filter"><input type="checkbox" checked={availability} onChange={(event) => onAvailability(event.target.checked)} /><span className="custom-checkbox"><Check size={12} /></span> Available for my date</label><button className="text-button clear-filters" type="button" onClick={onClearFilters}>Clear all filters <X size={13} /></button></div>}<div className="results-heading"><span>{query ? <>Showing results for <strong>“{query}”</strong></> : "Chosen with care. Found with love."}</span><span><ShieldCheck size={15} /> Every featured vendor is reviewed</span></div>{sortedResults.length ? <div className="vendor-grid vendor-grid-marketplace">{sortedResults.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} onView={() => onView(vendor)} onBook={() => onBook(vendor)} />)}</div> : <EmptyState icon={Search} title="A little too specific?" text="Try a different search or clear a filter. Your perfect vendor is around here somewhere." action={<AppButton variant="secondary" onClick={onClearFilters}>Clear all filters <X size={14} /></AppButton>} />}</div>;
}

function VendorProfile({ vendor, event, selectedPackage, onSelectPackage, onBook, onMessage, onBack }: { vendor: Vendor; event: EventDetails; selectedPackage: string; onSelectPackage: (name: string) => void; onBook: () => void; onMessage: () => void; onBack: () => void }) {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("The details");
  return <div className="page-wrap vendor-profile-wrap"><button className="back-link" type="button" onClick={onBack}><ArrowLeft size={15} /> All the lovely vendors</button><div className="profile-gallery"><div className="profile-gallery-main" style={{ backgroundImage: `url("${vendor.image}")` }}><span className="image-category">{vendor.category}</span><span className="gallery-count"><Image size={14} /> 12 little moments</span></div><div className="profile-gallery-side"><div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80')" }} /><div style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80')" }} /></div></div><div className="profile-main-grid"><div className="profile-information"><div className="profile-title-row"><div><span className="eyebrow">A LITTLE ABOUT THIS LOVELY LOT</span><h1>{vendor.name}</h1><div className="profile-meta"><span><MapPin size={15} /> {vendor.location}</span><span className="rating"><Star size={14} fill="currentColor" /> {vendor.rating.toFixed(1)} <small>· {vendor.reviews} happy reviews</small></span></div></div><button type="button" className={`icon-button save-vendor ${liked ? "saved-vendor" : ""}`} aria-label={liked ? "Remove from favourites" : "Save vendor"} onClick={() => setLiked((current) => !current)}><HeartIcon size={19} /></button></div><div className="vendor-credentials"><span className="verified-badge"><ShieldCheck size={15} /> The Event Affair verified</span><span className={`availability-badge ${vendor.available ? "available" : "unavailable"}`}><span />{vendor.available ? "Available for your date" : "Check a different date"}</span></div><div className="profile-tabs">{["The details", "Packages", "Kind words"].map((tab) => <button key={tab} type="button" className={activeTab === tab ? "profile-tab-active" : ""} onClick={() => { setActiveTab(tab); if (tab === "Packages") document.getElementById("vendor-packages")?.scrollIntoView({ behavior: "smooth", block: "center" }); if (tab === "Kind words") document.getElementById("vendor-reviews")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>{tab}</button>)}</div><section className="profile-description"><h2>A good story, <em>in a few words.</em></h2><p>{vendor.description}</p><div className="service-tags">{vendor.services.map((service) => <span key={service}>{service}</span>)}</div></section><section className="vendor-package-section" id="vendor-packages"><div className="section-heading-row section-heading-compact"><div><span className="eyebrow">A FEW WAYS TO MAKE IT YOURS</span><h2>Choose your <em>kind of lovely.</em></h2></div></div><div className="package-grid">{vendor.packages.map((item, index) => <button className={`package-card ${selectedPackage === item.name ? "package-selected" : ""}`} type="button" key={item.name} onClick={() => onSelectPackage(item.name)}><span className="package-tier">{index === 0 ? "THE THOUGHTFUL ONE" : index === 1 ? "A LITTLE MORE MAGIC" : "THE WHOLE AFFAIR"}</span><strong className="package-name">{item.name}</strong><span className="package-price">{currency(item.price)}<small> / event</small></span><p>{item.description}</p><ul>{item.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul><span className="package-radio"><span /></span></button>)}</div></section><section className="review-section" id="vendor-reviews"><div><span className="eyebrow">KIND WORDS, FROM REAL PEOPLE</span><h2>A five-star <em>feeling.</em></h2></div><div className="review-card"><div className="review-stars">★★★★★</div><p>“Every little thing felt so considered, and the team just got what we wanted. Our guests are still talking about it.”</p><span><span className="review-avatar">N</span> Nisha P. · Celebration in Ahmedabad</span></div><div className="review-card"><div className="review-stars">★★★★★</div><p>“Professional without losing any warmth. It felt less like working with a vendor and more like having a friend on the inside.”</p><span><span className="review-avatar review-avatar-sage">A</span> Aditi K. · Family gathering</span></div></section><div className="policy-note"><ShieldCheck size={16} /><span><strong>A little peace of mind.</strong> {vendor.cancellationPolicy ?? "Booking advances reserve your date. Cancellation details are shared with you before you confirm."}</span></div></div><aside className="profile-booking-aside"><span className="eyebrow">YOUR CELEBRATION · {vendor.category.toUpperCase()}</span><h3>Let’s make it <em>official.</em></h3><p>Choose a package you love and we’ll take you through the little details.</p><div className="selected-package-summary"><span>Your selected package</span><strong>{selectedPackage}</strong><b>{currency(vendor.packages.find((item) => item.name === selectedPackage)?.price ?? vendor.startingPrice)}</b></div><div className="booking-availability-note"><CalendarCheck2 size={16} /><span>Your date: <strong>{shortDate(event.date)}</strong> · {vendor.available ? "Looking lovely" : "Date to confirm"}</span></div><AppButton onClick={onBook} disabled={!vendor.available}>Book this lovely vendor <ArrowRight size={16} /></AppButton><button type="button" className="contact-vendor-button" onClick={onMessage}><MessageCircle size={15} /> Send a little message</button>{vendor.contactEmail && <span className="vendor-contact-email"><Mail size={13} /> {vendor.contactEmail}</span>}<span className="aside-fineprint"><ShieldCheck size={13} /> Secure request · Transparent pricing · No hidden fees</span></aside></div><section className="similar-vendors"><div><span className="eyebrow">GOOD COMPANY</span><h2>Good things, <em>in good company.</em></h2></div><span>Explore more of our favourite people →</span></section></div>;
}

function BookingListRow({ booking }: { booking: Booking }) {
  return <article className="booking-list-row"><div className="booking-vendor-symbol"><Sparkles size={19} /></div><div className="booking-list-main"><strong>{booking.vendorName}</strong><span>{booking.category} · {booking.packageName} package</span></div><div className="booking-list-event"><span>YOUR EVENT</span><strong>{booking.eventName}</strong></div><div className="booking-list-price"><span>{currency(booking.customerTotal)}</span><BookingStatus status={booking.status} /></div><ChevronRight size={16} className="booking-chevron" /></article>;
}

function BookingStatus({ status }: { status: Booking["status"] }) {
  const statusClass = status === "Confirmed" ? "status-confirmed" : status === "Declined" ? "status-declined" : "status-pending";
  return <span className={`booking-status ${statusClass}`}><span />{status === "Pending vendor" ? "Awaiting vendor" : status}</span>;
}

function CustomerBookings({ bookings, onBrowse }: { bookings: Booking[]; onBrowse: () => void }) {
  const [filter, setFilter] = useState("All bookings");
  const visible = filter === "All bookings" ? bookings : bookings.filter((booking) => filter === "Confirmed" ? booking.status === "Confirmed" : booking.status === "Pending vendor");
  const totalPaid = bookings.reduce((sum, booking) => sum + booking.paid, 0);
  const totalCommitted = bookings.reduce((sum, booking) => sum + booking.customerTotal, 0);
  return <div className="page-wrap"><PageIntro eyebrow="THE DETAILS, TAKEN CARE OF" title="Your bookings, <em>beautifully in hand.</em>" description="A clear little home for every vendor, payment milestone, and happy plan." action={<AppButton onClick={onBrowse}><Plus size={15} /> Find another vendor</AppButton>} /><div className="booking-summary-strip"><div><span>Bookings in the diary</span><strong>{bookings.length}</strong></div><div><span>Payment milestones paid</span><strong>{currency(totalPaid)}</strong></div><div><span>Total across your bookings</span><strong>{currency(totalCommitted)}</strong></div><div><span>Up next</span><strong>{bookings.filter((booking) => booking.status === "Pending vendor").length || "All confirmed"}</strong></div></div><div className="booking-filter-bar">{["All bookings", "Confirmed", "Awaiting vendor"].map((item) => <button type="button" className={filter === item ? "booking-filter-active" : ""} key={item} onClick={() => setFilter(item)}>{item}{item === "All bookings" && <span>{bookings.length}</span>}</button>)}</div>{visible.length ? <div className="booking-card-grid">{visible.map((booking) => <BookingDetailCard booking={booking} key={booking.id} />)}</div> : <EmptyState icon={CalendarCheck2} title="Nothing on this page just yet." text="A good thing is right around the corner. Explore the vendors and send your first request." action={<AppButton onClick={onBrowse}>Find a vendor <ArrowRight size={14} /></AppButton>} />}<div className="commission-explainer"><ShieldCheck size={20} /><div><strong>Your money, clearly accounted for.</strong><p>Every booking shows its package price, the 2.5% customer service fee, the 10% booking advance, and each remaining milestone. All payments here are simulated.</p></div></div></div>;
}

function BookingDetailCard({ booking }: { booking: Booking }) {
  const balance = Math.max(0, booking.customerTotal - booking.paid);
  return <article className="booking-detail-card"><div className="booking-detail-top"><span className="booking-vendor-symbol"><Sparkles size={18} /></span><BookingStatus status={booking.status} /></div><span className="eyebrow">{booking.category.toUpperCase()} · {booking.id}</span><h3>{booking.vendorName}</h3><p>{booking.packageName} package for <strong>{booking.eventName}</strong></p><div className="booking-event-details"><span><CalendarDays size={14} /> {shortDate(booking.date)}</span><span><MapPin size={14} /> {booking.location}</span></div><div className="booking-detail-total"><span>Customer total <strong>{currency(booking.customerTotal)}</strong></span><span>Base package {currency(booking.baseAmount)}</span><span>2.5% customer platform fee {currency(booking.customerFee)}</span></div><div className="booking-paid-track"><span><i style={{ width: `${Math.min(100, booking.paid / Math.max(booking.customerTotal, 1) * 100)}%` }} /></span><div><span>Paid <strong>{currency(booking.paid)}</strong></span><span>{booking.status === "Declined" ? "No payment due · request declined" : booking.paid ? `Next · ${currency(balance)} due ${shortDate(booking.dueDate)}` : `Advance · ${currency(Math.round(booking.customerTotal * 0.1))} due on confirmation`}</span></div></div><div className="booking-card-bottom"><span className="demo-payment-tag"><CreditCard size={13} /> Simulated payments only</span>{booking.status === "Pending vendor" && <span className="waiting-note"><Clock3 size={13} /> Waiting for vendor</span>}</div></article>;
}

function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-state-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p>{action}</div>;
}

function GuestManagement({ guests, counts, search, onSearch, filter, onFilter, name, onName, email, onEmail, onAdd, onUpdateStatus, onRemove, onInvite }: { guests: Guest[]; counts: Record<Guest["status"], number>; search: string; onSearch: (value: string) => void; filter: string; onFilter: (value: string) => void; name: string; onName: (value: string) => void; email: string; onEmail: (value: string) => void; onAdd: (event: FormEvent<HTMLFormElement>) => void; onUpdateStatus: (id: string, status: Guest["status"]) => void; onRemove: (id: string) => void; onInvite: () => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const visibleGuests = guests.filter((guest) => (filter === "All guests" || guest.status === filter) && `${guest.name} ${guest.email}`.toLowerCase().includes(search.toLowerCase())).slice(0, 30);
  return <div className="page-wrap"><PageIntro eyebrow="THE PEOPLE WHO MAKE IT YOURS" title="Your people, <em>all together.</em>" description="Every name, every RSVP, and a gentle reminder when it’s time to follow up." action={<><AppButton variant="secondary" onClick={onInvite}><Send size={15} /> Send invitations</AppButton><AppButton onClick={() => setShowAdd((open) => !open)}><Plus size={15} /> Add a guest</AppButton></>} /><div className="guest-count-grid"><div className="guest-count-card"><span className="guest-count-indicator indicator-confirmed" /><span>HAPPILY CONFIRMED</span><strong>{counts.Confirmed}</strong><small>Can’t wait to celebrate</small></div><div className="guest-count-card"><span className="guest-count-indicator indicator-pending" /><span>STILL THINKING</span><strong>{counts.Pending}</strong><small>A little nudge, perhaps?</small></div><div className="guest-count-card"><span className="guest-count-indicator indicator-declined" /><span>CAN’T MAKE IT</span><strong>{counts.Declined}</strong><small>Sending them love</small></div><div className="guest-count-card guest-total-card"><span>YOUR LIST AT A GLANCE</span><strong>{counts.Confirmed + counts.Pending + counts.Declined}</strong><small>of {guests.length} on your invitation list</small><div className="guest-capacity-track"><span style={{ width: `${Math.min(100, (counts.Confirmed / Math.max(guests.length, 1)) * 100)}%` }} /></div></div></div>{showAdd && <form className="add-guest-form" onSubmit={(event) => { onAdd(event); setShowAdd(false); }}><div><span className="eyebrow">ONE MORE LOVELY FACE</span><h3>Add someone to your list.</h3></div><label className="field-label">Their name<input className="text-input" value={name} onChange={(event) => onName(event.target.value)} placeholder="e.g. Priya Shah" required /></label><label className="field-label">Email address<input className="text-input" type="email" value={email} onChange={(event) => onEmail(event.target.value)} placeholder="hello@example.com" required /></label><AppButton type="submit"><Plus size={14} /> Add to guest list</AppButton><button type="button" className="icon-button" aria-label="Close form" onClick={() => setShowAdd(false)}><X size={17} /></button></form>}<div className="guest-list-card"><div className="guest-list-top"><div><span className="eyebrow">A SEAT FOR EVERYONE</span><h2>The guest <em>list.</em></h2></div><span className="guest-list-total"><Users size={16} /> {guests.length} little hellos</span></div><div className="guest-list-controls"><label className="guest-search"><Search size={16} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search your people…" /></label><div className="guest-filter-tabs">{["All guests", "Confirmed", "Pending", "Declined"].map((status) => <button type="button" key={status} className={filter === status ? "guest-filter-active" : ""} onClick={() => onFilter(status)}>{status}</button>)}</div></div>{visibleGuests.length ? <div className="guest-table"><div className="guest-table-header"><span>A LOVELY PERSON</span><span>RSVP</span><span>EMAIL ADDRESS</span><span>ONE LAST THING</span></div>{visibleGuests.map((guest, index) => <div className="guest-table-row" key={guest.id}><span className="guest-person"><span className={`guest-avatar guest-avatar-${index % 5}`}>{guest.name.charAt(0)}</span><strong>{guest.name}</strong></span><span><span className={`rsvp-pill rsvp-${guest.status.toLowerCase()}`}><span />{guest.status}</span></span><span className="guest-email">{guest.email}</span><span className="guest-row-actions"><select aria-label={`Update RSVP status for ${guest.name}`} value={guest.status} onChange={(event) => onUpdateStatus(guest.id, event.target.value as Guest["status"])}><option>Confirmed</option><option>Pending</option><option>Declined</option></select><button className="icon-button guest-remove" type="button" aria-label={`Remove ${guest.name}`} onClick={() => onRemove(guest.id)}><Trash2 size={14} /></button></span></div>)}</div> : <EmptyState icon={Users} title="No lovely people found." text="Try another name or change the RSVP filter." />}<div className="guest-list-footer"><span>Showing {visibleGuests.length} of {guests.length} guests</span><span><ShieldCheck size={13} /> Your guest list is just for you</span></div></div><div className="invitation-demo-note"><Sparkles size={16} /><span><strong>A little invitation magic.</strong> “Send invitations” is simulated in this prototype—no emails are sent.</span><button type="button" onClick={onInvite}>Try it out <ArrowRight size={13} /></button></div></div>;
}

function TasksPage({ tasks, onToggle, onAdd }: { tasks: EventTask[]; onToggle: (id: string) => void; onAdd: () => void }) {
  const complete = tasks.filter((task) => task.done).length;
  const groups = [
    { title: "The early little things", range: [0, Math.min(8, tasks.length)] },
    { title: "Getting into the details", range: [8, Math.min(17, tasks.length)] },
    { title: "The final lovely touches", range: [17, tasks.length] },
  ];
  return <div className="page-wrap"><PageIntro eyebrow="ONE GOOD THING AT A TIME" title="Your list, without <em>the overwhelm.</em>" description="All the little details, gathered in one gentle place. You’ve got this." action={<AppButton variant="secondary" onClick={onAdd}><Plus size={15} /> Add a little task</AppButton>} /><section className="task-progress-card"><div className="task-progress-illustration"><span>✳</span><Sparkles size={22} /></div><div><span className="eyebrow">LOOK AT YOU GO</span><h2>{complete} of {tasks.length} details <em>taken care of.</em></h2><p>Every little step deserves a little celebration.</p></div><div className="task-progress-ring" style={{ background: `conic-gradient(#496455 ${(complete / Math.max(tasks.length, 1)) * 100}%, #e7e7de 0)` }}><div><strong>{Math.round(complete / Math.max(tasks.length, 1) * 100)}%</strong><small>there</small></div></div></section><div className="tasks-page-grid"><div className="tasks-list-panel">{groups.map((group) => { const groupTasks = tasks.slice(group.range[0], group.range[1]); if (!groupTasks.length) return null; return <section className="task-group" key={group.title}><div className="task-group-heading"><span>{group.title}</span><span>{groupTasks.filter((task) => task.done).length} / {groupTasks.length}</span></div>{groupTasks.map((task) => <button className={`task-row ${task.done ? "task-row-done" : ""}`} key={task.id} type="button" onClick={() => onToggle(task.id)}><span className="task-checkbox">{task.done && <Check size={13} />}</span><span>{task.label}</span><span className="task-row-arrow">{task.done ? "ALL SET" : "MARK DONE"}</span></button>)}</section>; })}</div><aside className="task-sidebar"><span className="task-sidebar-star">✳</span><span className="eyebrow">A GENTLE REMINDER</span><h3>You’re not behind. You’re exactly where you <em>need to be.</em></h3><p>There’s no rush to do it all at once. A little at a time is the whole point.</p><div><Sparkles size={14} /> One step at a time. Always.</div></aside></div></div>;
}

function MessagesPage({ role, messages, draft, onDraft, onSend }: { role: Role; messages: string[]; draft: string; onDraft: (value: string) => void; onSend: (event: FormEvent<HTMLFormElement>) => void }) {
  const recipient = role === "vendor" ? "Rahul Mehta" : "Aura Events & Catering";
  const sender = role === "vendor" ? "Aura Events" : "You";
  return <div className="page-wrap"><PageIntro eyebrow="GOOD THINGS START WITH A HELLO" title="A little <em>conversation.</em>" description="Your questions, your plans, and the people helping bring it all to life." /><div className="messages-shell"><aside className="conversation-list"><span className="conversation-list-title">YOUR CONVERSATIONS <span>2</span></span><button type="button" className="conversation-active"><span className="conversation-avatar"><Sparkles size={17} /></span><span><strong>{recipient}</strong><small>{role === "vendor" ? "Re: Farewell Party · Ahmedabad" : "Re: Seasonal Gujarati menu"}</small></span><span className="conversation-time">NOW</span></button><button type="button" className="conversation-item"><span className="conversation-avatar conversation-avatar-rose"><Flower2 size={17} /></span><span><strong>The Velvet Grove</strong><small>We’ve sent the venue brochure your way…</small></span><span className="conversation-time">YEST.</span></button><div className="message-safety"><ShieldCheck size={15} /><span>Keep your conversations here for a thoughtful, safe planning experience.</span></div></aside><section className="conversation-window"><div className="conversation-header"><span className="conversation-avatar"><Sparkles size={17} /></span><div><strong>{recipient}</strong><span><span className="online-dot" /> Usually replies within a few hours</span></div><button type="button" className="icon-button" title="Conversation details"><CircleHelp size={17} /></button></div><div className="conversation-event-context"><CalendarDays size={15} /><span>Talking about <strong>Farewell Party</strong> · 15 December 2026</span><span className="conversation-event-status">ACTIVE PLAN</span></div><div className="message-date-divider"><span>TODAY · A GOOD DAY TO GET PLANNING</span></div><div className="message-stack"><div className="message-bubble message-theirs">Hi Rahul, we’ve received your event brief. The live counter menu sounds lovely—shall we chat through a few options?<span>10:42 am</span></div><div className="message-bubble message-mine">Absolutely! I’d love to explore the seasonal Gujarati menu. We’re expecting around 150 guests.<span>10:48 am · Read</span></div>{messages.slice(2).map((message, index) => <div className={`message-bubble ${index % 2 === 0 ? "message-mine" : "message-theirs"}`} key={`${message}-${index}`}>{message}<span>Just now</span></div>)}</div><form className="message-composer" onSubmit={onSend}><input value={draft} onChange={(event) => onDraft(event.target.value)} placeholder={`Write a thoughtful note to ${recipient.split(" ")[0]}…`} aria-label="Write a message" /><button type="button" className="composer-attachment" title="Attach a file"><Plus size={17} /></button><button type="submit" className="send-message-button" disabled={!draft.trim()} aria-label="Send message"><Send size={16} /></button></form><span className="message-prototype-note">A real person is on the other side. This demo keeps things local.</span></section></div></div>;
}

function ProfilePage({ name, email, onName, onEmail, onSave }: { name: string; email: string; onName: (value: string) => void; onEmail: (value: string) => void; onSave: () => void }) {
  return <div className="page-wrap"><PageIntro eyebrow="A LITTLE ABOUT YOU" title="Your corner of <em>the affair.</em>" description="Your details, your preferences, and all the celebrations you hold dear." /><div className="profile-page-grid"><aside className="profile-summary-card"><div className="profile-avatar-large">{name.charAt(0) || "R"}</div><span className="eyebrow">THE PERSON BEHIND THE PLAN</span><h2>{name}</h2><p>{email}</p><span className="profile-member-since"><Sparkles size={14} /> Planning something lovely since 2026</span></aside><form className="profile-edit-card" onSubmit={(formEvent) => { formEvent.preventDefault(); onSave(); }}><div className="dashboard-card-heading"><div><span className="eyebrow">JUST THE BASICS</span><h2>Profile <em>details.</em></h2></div><span className="verified-badge"><ShieldCheck size={14} /> Your details stay private</span></div><label className="field-label">Your name<input className="text-input" value={name} onChange={(event) => onName(event.target.value)} required /></label><label className="field-label">Email address<input className="text-input" type="email" value={email} onChange={(event) => onEmail(event.target.value)} required /></label><label className="field-label">Phone number<input className="text-input" placeholder="+91 98765 43210" /></label><div className="form-preference-row"><span className="stat-icon tint-sage"><Bell size={17} /></span><div><strong>The occasional helpful reminder</strong><small>Payment milestones, kind nudges, and things you might miss.</small></div><input type="checkbox" defaultChecked aria-label="Receive useful planning reminders" /></div><AppButton type="submit"><Check size={15} /> Save my details</AppButton></form></div><div className="commission-explainer"><ShieldCheck size={20} /><div><strong>Your celebrations are yours.</strong><p>Your contact details and guest list are only used to support your event planning. No surprises, no sharing your information.</p></div></div></div>;
}

function VendorDashboard({ bookings, vendorName, onNavigate, onStatus, onMessage }: { bookings: Booking[]; vendorName: string; onNavigate: (page: PageKey) => void; onStatus: (id: string, status: Booking["status"]) => void; onMessage: () => void }) {
  const vendorBookings = bookings.filter((booking) => booking.vendorId === "aura-events");
  const requests = vendorBookings.filter((booking) => booking.status === "Pending vendor");
  const accepted = vendorBookings.filter((booking) => booking.status === "Confirmed");
  const revenue = accepted.reduce((sum, booking) => sum + booking.baseAmount - booking.vendorFee, 0);
  return <div className="page-wrap dashboard-wrap vendor-dashboard-wrap"><div className="dashboard-welcome"><div><span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET · VENDOR STUDIO</span><h1>Good morning, <em>{vendorName.split(" ")[0]}.</em></h1><p>Here’s what’s happening with your lovely little business.</p></div><AppButton variant="secondary" onClick={() => onNavigate("vendor-profile-management")}><Pencil size={14} /> Edit your profile</AppButton></div><div className="vendor-welcome-banner"><div className="vendor-welcome-icon"><Sparkles size={22} /></div><div><span className="eyebrow eyebrow-light">YOUR VENDOR STUDIO</span><h2>A good week to <em>make things happen.</em></h2><p>Your next celebration is on the calendar. Let’s make it a good one.</p></div><div className="vendor-completion"><span>PROFILE LOVELINESS</span><strong>86%</strong><div><span /></div><button type="button" onClick={() => onNavigate("vendor-profile-management")}>A few finishing touches <ArrowRight size={13} /></button></div><Sparkles className="vendor-banner-sparkle" size={90} />
      </div><div className="dashboard-stat-grid vendor-stat-grid"><CompactStat icon={CalendarCheck2} label="Total bookings" value={String(vendorBookings.length + 27)} note="A growing little list" tint="sage" /><CompactStat icon={CalendarDays} label="Upcoming events" value={String(accepted.length + 3)} note="Lovely days on the horizon" tint="rose" /><CompactStat icon={Wallet} label="Your earnings" value={currency(revenue + 428000)} note="After our 2.5% fee" tint="gold" /><CompactStat icon={Clock3} label="New requests" value={String(requests.length)} note={requests.length ? "One is waiting for you" : "You’re all caught up"} tint="blue" /></div><div className="vendor-dashboard-layout"><section className="dashboard-card vendor-request-card"><div className="dashboard-card-heading"><div><span className="eyebrow">A LITTLE SOMETHING NEW</span><h2>Booking <em>requests.</em></h2></div><span className="request-count-pill">{requests.length} waiting</span></div>{requests.length ? requests.map((booking) => <VendorRequestCard key={booking.id} booking={booking} onStatus={onStatus} />) : <EmptyState icon={CalendarCheck2} title="All caught up." text="New booking requests will land here. Until then, make yourself a little cup of tea." />}</section><aside className="dashboard-card vendor-upcoming-card"><div className="dashboard-card-heading"><div><span className="eyebrow">MARK IT ON THE CALENDAR</span><h2>Next <em>celebration.</em></h2></div><CalendarDays size={18} /></div><div className="upcoming-date-card"><div className="date-month">DEC</div><strong>15</strong><span>TUESDAY</span></div><div className="upcoming-event-info"><span>FAREWELL · AHMEDABAD</span><strong>Farewell Party</strong><small><Users size={14} /> 150 guests · Your Signature package</small></div><div className="upcoming-money"><span>YOUR NET EARNINGS</span><strong>{currency(60000 - 1500)}</strong><small>After 2.5% vendor commission</small></div><AppButton variant="secondary" onClick={() => onNavigate("calendar")}>See your calendar <ArrowRight size={14} /></AppButton></aside></div><section className="vendor-tools-grid"><button type="button" onClick={() => onNavigate("vendor-bookings")}><span className="stat-icon tint-sage"><CalendarCheck2 size={17} /></span><strong>Every booking, in order</strong><span>Manage requests and confirm your dates.</span><ArrowRight size={15} /></button><button type="button" onClick={onMessage}><span className="stat-icon tint-rose"><MessageCircle size={17} /></span><strong>Stay close to your clients</strong><span>A thoughtful reply goes a long way.</span><ArrowRight size={15} /></button><button type="button" onClick={() => onNavigate("earnings")}><span className="stat-icon tint-gold"><Wallet size={17} /></span><strong>Your numbers, in the open</strong><span>See fees, payments, and what you’ve earned.</span><ArrowRight size={15} /></button></section></div>;
}

function VendorRequestCard({ booking, onStatus }: { booking: Booking; onStatus: (id: string, status: Booking["status"]) => void }) {
  return <article className="vendor-request"><div className="request-topline"><span className="request-new"><span /> NEW BOOKING REQUEST</span><span className="request-ref">{booking.id}</span></div><div className="request-person"><span className="guest-avatar guest-avatar-2">{booking.created ? "R" : "A"}</span><div><strong>{booking.created ? "Rahul Mehta" : "Aditi Kapoor"}</strong><span>{booking.eventName} · {booking.location}</span></div><span className="request-date"><CalendarDays size={14} /> {shortDate(booking.date)}</span></div><div className="request-details-grid"><div><span>GUESTS</span><strong>{booking.guests}</strong></div><div><span>SERVICE</span><strong>{booking.category}</strong></div><div><span>PACKAGE</span><strong>{booking.packageName}</strong></div><div><span>BOOKING VALUE</span><strong>{currency(booking.baseAmount)}</strong></div></div><div className="request-actions"><AppButton className="request-accept" onClick={() => onStatus(booking.id, "Confirmed")}><Check size={15} /> Accept booking</AppButton><AppButton variant="quiet" onClick={() => onStatus(booking.id, "Declined")}><X size={15} /> Decline</AppButton><span>Confirm within 24 hours to give your client peace of mind.</span></div></article>;
}

function VendorBookings({ bookings, onStatus }: { bookings: Booking[]; onStatus: (id: string, status: Booking["status"]) => void }) {
  const [filter, setFilter] = useState("All bookings");
  const vendorBookings = bookings.filter((booking) => booking.vendorId === "aura-events");
  const visible = vendorBookings.filter((booking) => filter === "All bookings" || (filter === "Requests" ? booking.status === "Pending vendor" : filter === "Confirmed" ? booking.status === "Confirmed" : booking.status === "Declined"));
  return <div className="page-wrap"><PageIntro eyebrow="YOUR CLIENTS, YOUR CALENDAR" title="The bookings, <em>beautifully in order.</em>" description="Requests, confirmed dates, and the thoughtful details that make your service special." /><div className="booking-filter-bar vendor-booking-filters">{["All bookings", "Requests", "Confirmed", "Declined"].map((item) => <button type="button" key={item} className={filter === item ? "booking-filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>{visible.length ? <div className="vendor-booking-list">{visible.map((booking) => <article className="vendor-booking-card" key={booking.id}><div className="vendor-booking-heading"><span className="vendor-booking-icon"><Sparkles size={18} /></span><div><span className="eyebrow">{booking.category.toUpperCase()} · {booking.id}</span><h3>{booking.eventName}</h3></div><BookingStatus status={booking.status} /></div><div className="vendor-booking-details"><span><CalendarDays size={14} /> {formattedDate(booking.date)}</span><span><MapPin size={14} /> {booking.location}</span><span><Users size={14} /> {booking.guests} guests</span><span><Sparkles size={14} /> {booking.packageName}</span></div><div className="vendor-booking-revenue"><span>Customer package value<strong>{currency(booking.baseAmount)}</strong></span><span>Platform commission · 2.5%<strong>− {currency(booking.vendorFee)}</strong></span><span>Your net earnings<strong>{currency(booking.baseAmount - booking.vendorFee)}</strong></span></div>{booking.status === "Pending vendor" && <div className="request-actions"><AppButton className="request-accept" onClick={() => onStatus(booking.id, "Confirmed")}><Check size={15} /> Accept this booking</AppButton><AppButton variant="quiet" onClick={() => onStatus(booking.id, "Declined")}><X size={15} /> Decline</AppButton></div>}</article>)}</div> : <EmptyState icon={CalendarCheck2} title="No bookings here just yet." text="When your next customer request arrives, you’ll find it here." />}</div>;
}

function CalendarPage({ event, bookings }: { event: EventDetails; bookings: Booking[] }) {
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2026);
  const monthName = new Intl.DateTimeFormat("en-IN", { month: "long" }).format(new Date(year, month, 1));
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const calendarCells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  const eventDay = new Date(`${event.date}T12:00:00`).getMonth() === month && new Date(`${event.date}T12:00:00`).getFullYear() === year ? new Date(`${event.date}T12:00:00`).getDate() : 15;
  return <div className="page-wrap"><PageIntro eyebrow="A GOOD DAY, ON THE HORIZON" title="Your dates, <em>beautifully in view.</em>" description="An at-a-glance look at every celebration coming your way." /><div className="calendar-layout"><section className="calendar-card"><div className="calendar-card-header"><div><span className="eyebrow">YOUR STUDIO CALENDAR</span><h2>{monthName} <em>{year}</em></h2></div><div className="calendar-controls"><button type="button" className="icon-button" aria-label="Previous month" onClick={() => { if (month === 0) { setMonth(11); setYear((current) => current - 1); } else setMonth((current) => current - 1); }}><ArrowLeft size={16} /></button><button type="button" className="icon-button" aria-label="Next month" onClick={() => { if (month === 11) { setMonth(0); setYear((current) => current + 1); } else setMonth((current) => current + 1); }}><ArrowRight size={16} /></button></div></div><div className="calendar-grid calendar-weekdays">{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid calendar-days">{calendarCells.map((day, index) => <div className={`calendar-day ${day === eventDay ? "calendar-day-event" : ""} ${day === 15 ? "calendar-day-other-event" : ""}`} key={`${day ?? "space"}-${index}`}>{day && <><span>{day}</span>{day === eventDay && <i />}{day === 15 && day !== eventDay && <i className="calendar-dot-muted" />}</>}</div>)}</div><div className="calendar-legend"><span><i /> Your client's Farewell Party</span><span><i className="calendar-dot-muted" /> Another celebration</span></div></section><aside className="calendar-agenda"><span className="eyebrow">COMING UP, ALL LOVELY</span><h3>A good day <em>in the diary.</em></h3>{bookings.filter((booking) => booking.vendorId === "aura-events").map((booking) => <div className="agenda-card" key={booking.id}><div className="agenda-date"><span>{shortDate(booking.date).split(" ")[1]?.toUpperCase()}</span><strong>{shortDate(booking.date).split(" ")[0]}</strong></div><div><span className="agenda-category">{booking.category.toUpperCase()} · {booking.status}</span><strong>{booking.eventName}</strong><small>{booking.location} · {booking.guests} lovely people</small></div></div>)}<div className="calendar-availability"><CalendarCheck2 size={17} /><span><strong>Your availability</strong><small>Let clients know which dates are open.</small></span><button type="button" onClick={() => window.alert("Your calendar availability is up to date.")}>Open settings <ArrowRight size={13} /></button></div></aside></div></div>;
}

function VendorServices({ vendorName, category, location, prices, onPrice }: { vendorName: string; category: Category; location: string; prices: number[]; onPrice: (index: number, value: number) => void }) {
  const [editing, setEditing] = useState(false);
  return <div className="page-wrap"><PageIntro eyebrow="WHAT YOU BRING TO THE TABLE" title="Your work, <em>your way.</em>" description="Keep your packages fresh, your prices clear, and your offering unmistakably yours." action={<AppButton onClick={() => setEditing((value) => !value)}><Pencil size={14} /> {editing ? "Done editing" : "Edit packages"}</AppButton>} /><div className="services-profile-strip"><div className="services-business-icon"><Sparkles size={22} /></div><div><span className="eyebrow">YOUR PUBLIC OFFERING</span><strong>{vendorName}</strong><span>{category} · {location} · Verified vendor</span></div><span className="verified-badge"><ShieldCheck size={14} /> Live in marketplace</span></div><div className="service-packages-grid">{vendors[0].packages.map((item, index) => <article className="service-package-editor" key={item.name}><span className="package-tier">PACKAGE 0{index + 1}</span><h3>{item.name}</h3><p>{item.description}</p><div className="service-price-edit"><label className="field-label">Starting price {editing ? <input type="number" min="0" step="1000" className="text-input" value={prices[index] ?? item.price} onChange={(event) => onPrice(index, Number(event.target.value))} /> : <strong>{currency(prices[index] ?? item.price)}</strong>}</label></div><ul>{item.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul><button type="button" className="text-button" onClick={() => setEditing((value) => !value)}>{editing ? "Save these changes" : "Edit what’s included"} <Pencil size={13} /></button></article>)}</div><div className="commission-explainer"><ShieldCheck size={20} /><div><strong>Your rate is always clear.</strong><p>A 2.5% vendor commission is applied to each confirmed booking. You’ll see the exact net amount before you accept, with no other listing or subscription fees.</p></div></div></div>;
}

function EarningsPage({ bookings }: { bookings: Booking[] }) {
  const vendorBookings = bookings.filter((booking) => booking.vendorId === "aura-events" && booking.status === "Confirmed");
  const gross = vendorBookings.reduce((sum, booking) => sum + booking.baseAmount, 0) + 428000;
  const fees = vendorBookings.reduce((sum, booking) => sum + booking.vendorFee, 0) + 10700;
  return <div className="page-wrap"><PageIntro eyebrow="EVERY RUPEE, IN THE OPEN" title="The good work, <em>adding up.</em>" description="Confirmed bookings, platform fees, and a clear view of your earnings." /><div className="earnings-hero"><div><span className="eyebrow eyebrow-light">TOTAL EARNINGS · AFTER COMMISSION</span><strong>{currency(gross - fees)}</strong><span><TrendingUp size={15} /> Your earnings are growing, one happy client at a time.</span></div><div className="earnings-mini-chart"><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><div>{[30, 46, 38, 64, 54, 82, 69, 100, 76, 93, 72, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><small>YOUR LAST 12 WEEKS</small></div></div><div className="dashboard-stat-grid earnings-stat-grid"><CompactStat icon={Banknote} label="Gross booking value" value={currency(gross)} note="Confirmed bookings" tint="sage" /><CompactStat icon={Minus} label="Vendor platform fee" value={currency(fees)} note="2.5% · shown transparently" tint="rose" /><CompactStat icon={Wallet} label="Your net earnings" value={currency(gross - fees)} note="After platform commission" tint="gold" /><CompactStat icon={Clock3} label="Upcoming payouts" value={currency(60000 - 1500)} note="Next event · 15 December" tint="blue" /></div><section className="earnings-table-card"><div className="dashboard-card-heading"><div><span className="eyebrow">YOUR BOOKINGS, YOUR BUSINESS</span><h2>Every payout, <em>accounted for.</em></h2></div><span className="verified-badge"><ShieldCheck size={14} /> No listing fees</span></div><div className="commission-table"><div><span>BOOKING</span><span>PACKAGE VALUE</span><span>PLATFORM FEE · 2.5%</span><span>YOUR NET</span><span>STATUS</span></div>{vendorBookings.length ? vendorBookings.map((booking) => <div key={booking.id}><span><strong>{booking.eventName}</strong><small>{booking.id} · {shortDate(booking.date)}</small></span><strong>{currency(booking.baseAmount)}</strong><span>− {currency(booking.vendorFee)}</span><strong>{currency(booking.baseAmount - booking.vendorFee)}</strong><BookingStatus status={booking.status} /></div>) : <div className="commission-table-empty">Confirmed booking earnings will appear here.</div>}</div><div className="vendor-fee-disclaimer"><ShieldCheck size={15} /><span>Customer commission is 2.5%, collected separately. Your 2.5% vendor commission is deducted from the package value. Together, that’s a transparent 5% platform commission.</span></div></section></div>;
}

function VendorProfileManagement({ name, description, location, prices, availability, category, services, cancellationPolicy, contactEmail, onName, onDescription, onLocation, onPrice, onAvailability, onCategory, onServices, onCancellationPolicy, onContactEmail, onSave }: { name: string; description: string; location: string; prices: number[]; availability: boolean; category: Category; services: string[]; cancellationPolicy: string; contactEmail: string; onName: (value: string) => void; onDescription: (value: string) => void; onLocation: (value: string) => void; onPrice: (index: number, value: number) => void; onAvailability: (value: boolean) => void; onCategory: (value: Category) => void; onServices: (value: string[]) => void; onCancellationPolicy: (value: string) => void; onContactEmail: (value: string) => void; onSave: () => void }) {
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  return <div className="page-wrap"><PageIntro eyebrow="YOUR STORY, YOUR STUDIO" title="Make your profile <em>feel like you.</em>" description="An inviting little introduction is often all it takes to meet the right client." action={<AppButton onClick={onSave}><Check size={15} /> Save profile</AppButton>} /><div className="vendor-profile-manage-grid"><form className="vendor-profile-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><section className="vendor-manage-section"><div><span className="eyebrow">A GOOD FIRST IMPRESSION</span><h2>Tell the world <em>what you do.</em></h2></div><label className="field-label">Business name<input className="text-input" value={name} onChange={(event) => onName(event.target.value)} /></label><label className="field-label">A few words about your work<textarea className="text-input textarea-input" value={description} onChange={(event) => onDescription(event.target.value)} rows={5} /></label><label className="field-label">Your city<input className="text-input" value={location} onChange={(event) => onLocation(event.target.value)} /></label><label className="field-label">What do you do?<select className="text-input" value={category} onChange={(event) => onCategory(event.target.value as Category)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="field-label">Your services, separated by commas<input className="text-input" value={services.join(", ")} onChange={(event) => onServices(event.target.value.split(",").map((service) => service.trim()).filter(Boolean))} placeholder="Wedding catering, live counters…" /></label><div className="vendor-photo-manager"><span className="eyebrow">A LITTLE LOOK AT YOUR WORK</span><div className="vendor-photo-previews">{photoPreviews.map((photo, index) => <div className="vendor-photo-preview" key={`${photo}-${index}`} style={{ backgroundImage: `url("${photo}")` }}><button type="button" aria-label="Remove selected photo" onClick={() => setPhotoPreviews((current) => current.filter((_, photoIndex) => photoIndex !== index))}><X size={13} /></button></div>)}</div><div className="vendor-photo-manager-row"><span><Image size={16} /> Images stay on this device in the prototype.</span><label className="vendor-add-photo">Add photos<input type="file" accept="image/*" multiple onChange={(event) => { const photos = Array.from(event.currentTarget.files ?? []); setPhotoPreviews((current) => [...current, ...photos.map((photo) => URL.createObjectURL(photo))]); event.currentTarget.value = ""; }} /></label></div></div></section><section className="vendor-manage-section"><div><span className="eyebrow">WHAT YOU BRING TO THE TABLE</span><h2>Your packages, <em>your terms.</em></h2></div>{vendors[0].packages.map((item, index) => <label className="field-label" key={item.name}>{item.name} package pricing<span className="currency-input"><span>₹</span><input type="number" min="0" step="1000" value={prices[index] ?? item.price} onChange={(event) => onPrice(index, Number(event.target.value))} /></span></label>)}<button className="vendor-add-package" type="button" onClick={() => window.alert("A new package can be added in a future release. Your current packages are saved locally.")}><Plus size={14} /> Add another package</button></section><section className="vendor-manage-section"><div><span className="eyebrow">THE LITTLE DETAILS</span><h2>Here when you’re <em>ready.</em></h2></div><label className="availability-switch"><span><strong>Taking enquiries</strong><small>Let customers know you’re open for new dates.</small></span><input type="checkbox" checked={availability} onChange={(event) => onAvailability(event.target.checked)} /></label><label className="field-label">Cancellation policy<textarea className="text-input" rows={3} value={cancellationPolicy} onChange={(event) => onCancellationPolicy(event.target.value)} /></label><label className="field-label">Contact email<input className="text-input" type="email" value={contactEmail} onChange={(event) => onContactEmail(event.target.value)} /></label></section><AppButton type="submit"><Check size={15} /> Save your lovely profile</AppButton></form><aside className="vendor-profile-preview"><span className="eyebrow">A LITTLE SNEAK PEEK</span><h3>How you’ll <em>appear.</em></h3><div className="vendor-preview-image" style={{ backgroundImage: `url("${vendors[0].image}")` }}><span className="verified-badge"><ShieldCheck size={13} /> Verified</span></div><div className="vendor-preview-body"><span className="eyebrow">{category.toUpperCase()} · {location.toUpperCase()}</span><strong>{name}</strong><span className="rating"><Star size={13} fill="currentColor" /> 4.9 <small>· 128 kind words</small></span><p>{description.slice(0, 155)}…</p><span className="vendor-preview-price">Starting from <strong>{currency(prices[0] ?? 25000)}</strong></span></div><div className="verification-card"><ShieldCheck size={18} /><span><strong>Thoughtfully verified.</strong><small>Your documents have been reviewed by our team.</small></span><CheckCircle2 size={15} /></div></aside></div></div>;
}

function AdminDashboard({ bookings, onNavigate }: { bookings: Booking[]; onNavigate: (page: PageKey) => void }) {
  const bookingGmv = bookings.reduce((sum, booking) => sum + booking.baseAmount, 0);
  const platformRevenue = bookings.reduce((sum, booking) => sum + booking.customerFee + booking.vendorFee, 0);
  const stats = [
    { icon: Users, label: "Total users", value: "1,284", note: "+12% this month", color: "sage" },
    { icon: ShieldCheck, label: "Total vendors", value: "74", note: "2 awaiting review", color: "rose" },
    { icon: CalendarDays, label: "Total events", value: "128", note: "+18 this month", color: "gold" },
    { icon: CreditCard, label: "Total bookings", value: "342", note: "27 this month", color: "blue" },
    { icon: Banknote, label: "Booking value · GMV", value: "₹48.5L", note: `${currency(bookingGmv)} in this demo`, color: "sage" },
    { icon: TrendingUp, label: "Platform revenue", value: "₹2.42L", note: `${currency(platformRevenue)} · 5% total`, color: "rose" },
  ];
  return <div className="page-wrap admin-dashboard-wrap"><div className="dashboard-welcome"><div><span className="eyebrow">A LITTLE ORDER, BEHIND THE SCENES</span><h1>Good morning, <em>Affair.</em></h1><p>Here’s a thoughtful look at the people and plans bringing everyone together.</p></div><span className="admin-live-pill"><span /> ALL SYSTEMS LOOK LOVELY</span></div><div className="admin-metrics-grid">{stats.map((item) => { const Icon = item.icon; return <article className="admin-metric-card" key={item.label}><span className={`stat-icon tint-${item.color}`}><Icon size={18} /></span><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></article>; })}</div><div className="admin-main-grid"><section className="dashboard-card admin-recent-card"><div className="dashboard-card-heading"><div><span className="eyebrow">EVERY GOOD THING, RECENTLY</span><h2>Latest <em>bookings.</em></h2></div><button className="text-button" type="button" onClick={() => onNavigate("admin-bookings")}>All bookings <ArrowRight size={14} /></button></div>{bookings.slice(0, 5).map((booking) => <div className="admin-recent-row" key={booking.id}><span className="booking-vendor-symbol"><Sparkles size={16} /></span><span><strong>{booking.eventName}</strong><small>{booking.vendorName} · {booking.id}</small></span><strong>{currency(booking.baseAmount)}</strong><BookingStatus status={booking.status} /></div>)}</section><aside className="admin-attention-card"><span className="eyebrow eyebrow-light">A COUPLE OF THINGS TO SEE</span><h3>Good work, <em>in good hands.</em></h3><div className="attention-stat"><span><ShieldCheck size={17} /> Pending verification</span><strong>02</strong></div><p>Two lovely new vendors are waiting for their moment in the spotlight.</p><AppButton variant="secondary" onClick={() => onNavigate("admin-vendors")}>Review vendor profiles <ArrowRight size={14} /></AppButton><span className="admin-attention-spark">✳</span></aside></div><section className="commission-admin-card"><div className="commission-admin-icon"><Sparkles size={20} /></div><div><span className="eyebrow">TRANSPARENT BY DESIGN</span><h2>A fair 5%, <em>shared in the open.</em></h2><p>Each booking contributes 2.5% from the customer and 2.5% from the vendor. Clear for everyone, right from checkout.</p></div><div className="commission-split"><div><span>CUSTOMER</span><strong>2.5%</strong></div><span>+</span><div><span>VENDOR</span><strong>2.5%</strong></div><span>=</span><div><span>PLATFORM</span><strong>5%</strong></div></div><button className="commission-admin-link" type="button" onClick={() => onNavigate("transactions")}>See every transaction <ArrowRight size={14} /></button></section><div className="admin-quick-links"><button onClick={() => onNavigate("admin-users")} type="button"><Users size={17} /> The people <ArrowRight size={14} /></button><button onClick={() => onNavigate("admin-events")} type="button"><CalendarDays size={17} /> Celebrations <ArrowRight size={14} /></button><button onClick={() => onNavigate("analytics")} type="button"><Activity size={17} /> A little insight <ArrowRight size={14} /></button></div></div>;
}

function AdminUsers() {
  const users = [
    ["Rahul Mehta", "rahul.mehta@email.com", "Customer", "Farewell Party", "Active"],
    ["Aditi Kapoor", "aditi.k@email.com", "Customer", "Wedding", "Active"],
    ["Sameer Patel", "sameer@velvetgrove.in", "Vendor", "The Velvet Grove", "Active"],
    ["Nisha Shah", "nisha.shah@email.com", "Customer", "Birthday", "Active"],
    ["Priya Desai", "hello@afterglowsounds.in", "Vendor", "Afterglow Sounds", "Active"],
    ["Karan Joshi", "karan.j@email.com", "Customer", "Corporate event", "Active"],
  ];
  const [search, setSearch] = useState("");
  const visible = users.filter((user) => user.join(" ").toLowerCase().includes(search.toLowerCase()));
  return <div className="page-wrap"><PageIntro eyebrow="THE PEOPLE MAKING THINGS HAPPEN" title="A lovely lot, <em>all together.</em>" description="A thoughtful overview of the customers and vendors in the community." /><div className="admin-stat-strip"><span><Users size={17} /> <strong>1,284</strong> total community members</span><span>1,210 customers · 74 vendors</span><span className="admin-live-pill"><span /> HEALTHY & GROWING</span></div><div className="admin-table-card"><div className="admin-table-top"><div><span className="eyebrow">MEMBERS OF THE AFFAIR</span><h2>A few of <em>our people.</em></h2></div><label className="guest-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a person…" /></label></div><div className="admin-table"><div className="admin-table-heading"><span>A LOVELY PERSON</span><span>TYPE</span><span>THEIR CELEBRATION</span><span>STATUS</span><span>ONE LAST THING</span></div>{visible.map((user, index) => <div className="admin-table-row" key={user[1]}><span className="guest-person"><span className={`guest-avatar guest-avatar-${index % 5}`}>{user[0].charAt(0)}</span><span><strong>{user[0]}</strong><small>{user[1]}</small></span></span><span className="admin-role-pill">{user[2]}</span><span>{user[3]}</span><span><span className="booking-status status-confirmed"><span />{user[4]}</span></span><button type="button" className="text-button" onClick={() => window.alert(`${user[0]}'s membership is in good standing.`)}>View member <ArrowRight size={13} /></button></div>)}</div><div className="admin-table-footer">Showing {visible.length} of 1,284 community members <span>Thoughtfully, and privately, managed.</span></div></div></div>;
}

function AdminVendors({ vendors: allVendors, queue, onVerify }: { vendors: Vendor[]; queue: string[]; onVerify: (name: string) => void }) {
  const [view, setView] = useState("Everyone");
  const list = view === "Needs a look" ? queue.map((name) => allVendors.find((vendor) => vendor.name === name) ?? { ...allVendors[0], name, id: name }) : allVendors;
  return <div className="page-wrap"><PageIntro eyebrow="THE PEOPLE BEHIND THE CELEBRATIONS" title="Good work deserves <em>a good spotlight.</em>" description="Review vendor profiles, celebrate the verified community, and keep the good people close." /><div className="vendor-admin-stats"><span><ShieldCheck size={17} /> 74 lovely vendors</span><span><Star size={15} fill="currentColor" /> 4.8 average rating</span><span><Clock3 size={15} /> {queue.length} awaiting verification</span></div><div className="booking-filter-bar">{["Everyone", "Needs a look"].map((tab) => <button type="button" key={tab} className={view === tab ? "booking-filter-active" : ""} onClick={() => setView(tab)}>{tab}{tab === "Needs a look" && <span>{queue.length}</span>}</button>)}</div>{list.length ? <div className="admin-vendor-grid">{list.map((vendor) => <article className="admin-vendor-card" key={vendor.id}><div className="admin-vendor-image" style={{ backgroundImage: `url("${vendor.image}")` }} /><div className="admin-vendor-body"><span className="eyebrow">{vendor.category.toUpperCase()} · {vendor.location.toUpperCase()}</span><h3>{vendor.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {vendor.rating} · {vendor.reviews} reviews</span><p>{vendor.tagline}</p><div className="admin-vendor-bottom">{vendor.verified && !queue.includes(vendor.name) ? <span className="verified-badge"><ShieldCheck size={14} /> Verified</span> : <span className="verification-needed"><Clock3 size={14} /> Needs a little look</span>}{queue.includes(vendor.name) ? <AppButton onClick={() => onVerify(vendor.name)}><Check size={14} /> Verify profile</AppButton> : <AppButton variant="secondary" onClick={() => window.alert(`${vendor.name}: business profile, services, packages, and contact details are ready to review.`)}>Review profile <ArrowRight size={13} /></AppButton>}</div></div></article>)}</div> : <EmptyState icon={ShieldCheck} title="All caught up." text="Every vendor profile is thoughtfully reviewed." />}</div>;
}

function AdminEvents({ event, bookings, onOpen }: { event: EventDetails; bookings: Booking[]; onOpen: () => void }) {
  const events = [{ ...event, owner: "Rahul Mehta", status: "In progress", value: bookings.filter((booking) => booking.eventName === event.name).reduce((sum, booking) => sum + booking.baseAmount, 0) }, { name: "Meera & Arjun’s Celebration", type: "Wedding", date: "2027-02-14", location: "Udaipur", guests: 240, budget: 800000, styles: ["Elegant", "Traditional"], requirements: ["Venue", "Catering"], owner: "Meera Joshi", status: "Planning", value: 415000 }, { name: "Sana’s 30th", type: "Birthday", date: "2027-01-22", location: "Mumbai", guests: 65, budget: 125000, styles: ["Party"], requirements: ["DJ"], owner: "Sana Trivedi", status: "Planning", value: 72000 }];
  return <div className="page-wrap"><PageIntro eyebrow="EVERY REASON TO GET TOGETHER" title="Celebrations, <em>big and small.</em>" description="A little window into the moments our community is planning." /><div className="admin-stat-strip"><span><CalendarDays size={17} /> <strong>128</strong> events and counting</span><span>+18 celebrations this month</span><span>Average event budget <strong>₹3.78L</strong></span></div><div className="admin-events-grid">{events.map((item) => <article className="admin-event-card" key={item.name}><div className="admin-event-card-top"><span className="event-type-icon"><Sparkles size={18} /></span><span className={`event-admin-status ${item.status === "In progress" ? "" : ""}`}><span />{item.status}</span></div><span className="eyebrow">{item.type.toUpperCase()} · {item.location.toUpperCase()}</span><h3>{item.name}</h3><div className="admin-event-facts"><span><CalendarDays size={14} /> {shortDate(item.date)}</span><span><Users size={14} /> {formatCount(item.guests)} guests</span></div><div className="admin-event-owner">Planned with love by <strong>{item.owner}</strong></div><div className="admin-event-footer"><span>Booked value <strong>{currency(item.value)}</strong></span><button type="button" className="text-button" onClick={onOpen}>View celebration <ArrowRight size={13} /></button></div></article>)}</div></div>;
}

function AdminBookings({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState("All bookings");
  const visible = filter === "All bookings" ? bookings : bookings.filter((booking) => filter === "Confirmed" ? booking.status === "Confirmed" : booking.status !== "Confirmed");
  return <div className="page-wrap"><PageIntro eyebrow="THE DETAILS, DONE PROPERLY" title="Every booking, <em>in good order.</em>" description="A clear view of every package, platform fee, and vendor request." /><div className="admin-stat-strip"><span><CreditCard size={17} /> <strong>342</strong> total bookings</span><span><CheckCircle2 size={16} /> 318 confirmed</span><span><Clock3 size={16} /> 24 waiting for a vendor</span></div><div className="booking-filter-bar">{["All bookings", "Confirmed", "Awaiting review"].map((item) => <button type="button" key={item} className={filter === item ? "booking-filter-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="admin-table-card"><div className="admin-table"><div className="admin-booking-table-heading"><span>CELEBRATION & REFERENCE</span><span>VENDOR</span><span>PACKAGE VALUE</span><span>PLATFORM REVENUE</span><span>STATUS</span></div>{visible.map((booking) => <div className="admin-booking-table-row" key={booking.id}><span><strong>{booking.eventName}</strong><small>{booking.id} · {shortDate(booking.date)}</small></span><span>{booking.vendorName}</span><strong>{currency(booking.baseAmount)}</strong><strong>{currency(booking.customerFee + booking.vendorFee)}</strong><BookingStatus status={booking.status} /></div>)}</div><div className="admin-table-footer">Showing {visible.length} demo bookings <span>All transactions in the demo are simulated.</span></div></div></div>;
}

function TransactionsPage({ bookings }: { bookings: Booking[] }) {
  const totalGmv = bookings.reduce((sum, booking) => sum + booking.baseAmount, 0);
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.customerFee + booking.vendorFee, 0);
  return <div className="page-wrap"><PageIntro eyebrow="TRANSPARENT, FROM BOTH SIDES" title="Our little corner of <em>every booking.</em>" description="A clear accounting of customer fees, vendor fees, and the fair 5% that keeps us going." /><div className="commission-hero-card"><div className="commission-hero-copy"><span className="eyebrow eyebrow-light">THE EVENT AFFAIR MODEL</span><h2>Good for customers.<br /><em>Good for vendors.</em></h2><p>No paywalls to list. No mystery deductions. Just one simple, shared commission on every confirmed booking.</p></div><div className="commission-circles"><div><span>FROM THE<br />CUSTOMER</span><strong>2.5<small>%</small></strong></div><span>+</span><div><span>FROM THE<br />VENDOR</span><strong>2.5<small>%</small></strong></div><span>=</span><div className="commission-circle-total"><span>THE PLATFORM<br />EARNS</span><strong>5<small>%</small></strong></div></div></div><div className="commission-example-card"><div><span className="eyebrow">ONE BOOKING, BROKEN DOWN</span><h2>A ₹40,000 booking, <em>in the open.</em></h2><p>Here’s exactly how the commissions work, with no real money changing hands in this prototype.</p><AppButton variant="secondary" onClick={() => window.alert("This prototype never processes real payments or card details.")}><ShieldCheck size={14} /> Prototype only · no real payments</AppButton></div><div className="commission-example-lines"><div><span>Base booking value</span><strong>₹40,000</strong></div><div><span>Customer commission · 2.5%</span><strong>₹1,000</strong></div><div><span>Vendor commission · 2.5%</span><strong>₹1,000</strong></div><div className="commission-example-platform"><span>Total platform revenue · 5%</span><strong>₹2,000</strong></div><div><span>Customer pays (package + customer fee)</span><strong>₹41,000</strong></div><div><span>Vendor receives (less their fee)</span><strong>₹39,000</strong></div></div></div><div className="commission-stat-grid"><CompactStat icon={Banknote} label="Demo booking value" value={currency(totalGmv)} note="Across the sample bookings below" tint="sage" /><CompactStat icon={TrendingUp} label="Demo platform revenue" value={currency(totalRevenue)} note="2.5% from each side" tint="rose" /><CompactStat icon={ShieldCheck} label="The total commission" value="5%" note="2.5% customer + 2.5% vendor" tint="gold" /></div><section className="earnings-table-card"><div className="dashboard-card-heading"><div><span className="eyebrow">THE MATH, NOT THE MYSTERY</span><h2>What every booking <em>contributes.</em></h2></div></div><div className="commission-table"><div><span>BOOKING</span><span>BASE VALUE</span><span>CUSTOMER · 2.5%</span><span>VENDOR · 2.5%</span><span>TOTAL · 5%</span></div>{bookings.map((booking) => <div key={booking.id}><span><strong>{booking.eventName}</strong><small>{booking.vendorName} · {booking.id}</small></span><strong>{currency(booking.baseAmount)}</strong><span>{currency(booking.customerFee)}</span><span>{currency(booking.vendorFee)}</span><strong>{currency(booking.customerFee + booking.vendorFee)}</strong></div>)}</div></section></div>;
}

function AnalyticsPage({ bookings }: { bookings: Booking[] }) {
  const bars = [28, 38, 31, 52, 47, 62, 50, 75, 66, 91, 73, 100];
  return <div className="page-wrap"><PageIntro eyebrow="A LITTLE INSIGHT, WELL SPENT" title="Good things are <em>growing.</em>" description="A thoughtful view of the activity, momentum, and small wins across the platform." /><div className="analytics-overview"><section className="analytics-chart-card"><div><span className="eyebrow">CELEBRATIONS, OVER TIME</span><h2>A little more to <em>celebrate.</em></h2></div><div className="analytics-chart-legend"><span><i /> Events created</span><span><i /> New vendors</span></div><div className="analytics-chart-bars">{bars.map((bar, index) => <div key={index}><span><i style={{ height: `${bar}%` }} /><i style={{ height: `${Math.max(10, bar * 0.62)}%` }} /></span><small>{["MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB"][index]}</small></div>)}</div></section><aside className="analytics-highlight-card"><span className="eyebrow eyebrow-light">THE YEAR IN GATHERING</span><strong>+28<small>%</small></strong><h3>More reasons to <em>get together.</em></h3><p>Event planning grew by 28% this year, with weddings and birthday celebrations leading the way.</p><span className="analytics-highlight-note"><TrendingUp size={14} /> 18 new events this month</span></aside></div><div className="admin-metrics-grid analytics-metrics"><article className="admin-metric-card"><span className="stat-icon tint-sage"><CalendarDays size={17} /></span><span>Total events</span><strong>128</strong><small>↑ 18 new this month</small></article><article className="admin-metric-card"><span className="stat-icon tint-rose"><Users size={17} /></span><span>Community members</span><strong>1,284</strong><small>↑ 124 new this month</small></article><article className="admin-metric-card"><span className="stat-icon tint-gold"><ShieldCheck size={17} /></span><span>Verified vendors</span><strong>74</strong><small>89% response rate</small></article><article className="admin-metric-card"><span className="stat-icon tint-blue"><CreditCard size={17} /></span><span>Booking conversion</span><strong>68%</strong><small>Requests become confirmed</small></article></div><section className="analytics-category-card"><div className="dashboard-card-heading"><div><span className="eyebrow">THE MOMENTS PEOPLE ARE MAKING</span><h2>Everyone’s <em>gathering for something.</em></h2></div></div><div className="category-demand-grid">{[{ label: "Weddings", value: 82, icon: Flower2 }, { label: "Birthdays", value: 68, icon: PartyPopper }, { label: "Corporate", value: 46, icon: Award }, { label: "College events", value: 38, icon: Music2 }].map((item) => { const Icon = item.icon; return <div key={item.label}><span className="demand-icon"><Icon size={17} /></span><span>{item.label}</span><strong>{item.value}%</strong><div><i style={{ width: `${item.value}%` }} /></div></div>; })}</div></section>{bookings.length > 0 && <div className="analytics-footnote"><Activity size={15} /> This preview combines realistic simulated platform-wide metrics with live demo bookings ({bookings.length}).</div>}</div>;
}

export default EventAffair;
