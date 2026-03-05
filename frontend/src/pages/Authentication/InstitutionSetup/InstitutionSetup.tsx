import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import institutionService, { type InstitutionFormData } from '../../../services/institutionService'

// ─── STEPS ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id:1,  label:'Basic Info',  icon:'ti ti-building'        },
  { id:2,  label:'Address',     icon:'ti ti-map-pin'         },
  { id:3,  label:'Admin',       icon:'ti ti-user-shield'     },
  { id:4,  label:'Plan',        icon:'ti ti-crown'           },
  { id:5,  label:'Modules',     icon:'ti ti-puzzle'          },
  { id:6,  label:'Academic',    icon:'ti ti-school'          },
  { id:7,  label:'System',      icon:'ti ti-settings'        },
  { id:8,  label:'Branding',    icon:'ti ti-palette'         },
  { id:9,  label:'Security',    icon:'ti ti-shield-lock'     },
  { id:10, label:'Status',      icon:'ti ti-toggle-right'    },
  { id:11, label:'Review',      icon:'ti ti-clipboard-check' },
]

const INIT: any = {
  institutionName:'', institutionCode:'', institutionType:'School',
  email:'', phoneNumber:'', alternatePhone:'', website:'',
  country:'', state:'', district:'', city:'', area:'', fullAddress:'', pincode:'', googleMapsLocation:'',
  adminName:'', adminEmail:'', adminPhone:'', password:'', confirmPassword:'',
  autoGeneratePassword:false, sendCredentialsByEmail:true,
  selectedPlan:'Basic', billingType:'Monthly',
  startDate: new Date().toISOString().split('T')[0], endDate:'',
  isTrial:false, trialExpiryDate:'', maxStudentsLimit:500, maxStaffLimit:50, storageLimit:50,
  selectedModules:[],
  board:'CBSE', classes:['1','2','3','4','5','6','7','8','9','10'], sections:'A,B,C', academicYearFormat:'YYYY-YY',
  streams:['MPC','BIPC','CEC','MEC'], yearStructure:['1st Year','2nd Year'],
  universityAffiliation:'', coursesOffered:[], departments:[], semesterSystem:true,
  timezone:'Asia/Kolkata', currency:'INR', dateFormat:'DD/MM/YYYY', language:'English',
  gradingSystem:'Percentage', attendanceCalculationType:'Daily',
  primaryColor:'#1A6FA8', secondaryColor:'#10b981', customDomain:'', subdomain:'',
  allowStudentLogin:true, allowParentLogin:true, require2FA:false,
  passwordPolicy:'Medium', sessionTimeoutDuration:30,
  status:'Active', suspensionReason:'', allowImpersonation:false, allowAPIAccess:false,
  logo:'', favicon:'',
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
const validate = (step: number, data: any) => {
  const errs: any = {}
  const req  = (f: string, l: string) => { if (!data[f]?.toString().trim()) errs[f] = `${l} is required` }
  const emailV = (f: string, l: string) => { req(f,l); if (data[f] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[f])) errs[f]='Invalid email' }
  const phoneV = (f: string, l: string) => { req(f,l); if (data[f] && !/^[+\d][\d\s\-()]{7,14}$/.test(data[f])) errs[f]='Invalid phone' }
  const urlV   = (f: string)    => { if (data[f] && !/^https?:\/\/.+/.test(data[f])) errs[f]='Must start with http:// or https://' }

  switch (step) {
    case 1:
      req('institutionName','Institution name')
      if (data.institutionName?.length > 0 && data.institutionName.length < 3) errs.institutionName='Name must be at least 3 characters'
      req('institutionCode','Institution code')
      if (data.institutionCode && !/^[A-Z0-9_-]{3,12}$/i.test(data.institutionCode)) errs.institutionCode='Code: 3–12 alphanumeric/dash/underscore'
      emailV('email','Email'); phoneV('phoneNumber','Phone number'); urlV('website')
      break
    case 2:
      req('country','Country'); req('state','State'); req('district','District')
      req('city','City'); req('fullAddress','Full address'); req('pincode','Pincode')
      if (data.pincode && !/^\d{5,10}$/.test(data.pincode)) errs.pincode='Pincode must be 5–10 digits'
      break
    case 3:
      req('adminName','Admin name')
      if (data.adminName && data.adminName.trim().split(' ').length < 2) errs.adminName='Enter full name (first & last)'
      emailV('adminEmail','Admin email'); phoneV('adminPhone','Admin phone')
      if (!data.autoGeneratePassword) {
        req('password','Password')
        if (data.password?.length > 0 && data.password.length < 8) errs.password='At least 8 characters'
        if (data.password && !/(?=.*[A-Z])(?=.*\d)/.test(data.password)) errs.password='Include uppercase + number'
        req('confirmPassword','Confirm password')
        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) errs.confirmPassword='Passwords do not match'
      }
      break
    case 4:
      req('selectedPlan','Plan'); req('billingType','Billing type')
      req('startDate','Start date'); req('endDate','End date')
      if (data.startDate && data.endDate && data.endDate <= data.startDate) errs.endDate='Must be after start date'
      if (data.isTrial) req('trialExpiryDate','Trial expiry date')
      if (data.maxStudentsLimit < 1) errs.maxStudentsLimit='Must be at least 1'
      if (data.maxStaffLimit < 1)    errs.maxStaffLimit='Must be at least 1'
      if (data.storageLimit < 1)     errs.storageLimit='Must be at least 1 GB'
      break
    case 6:
      if (data.institutionType === 'Degree College') req('universityAffiliation','University affiliation')
      break
    case 7: req('timezone','Timezone'); req('currency','Currency'); break
    case 8: if (data.customDomain) urlV('customDomain'); break
    case 9:
      if (data.sessionTimeoutDuration < 5 || data.sessionTimeoutDuration > 480)
        errs.sessionTimeoutDuration = 'Timeout must be 5–480 minutes'
      break
    case 10:
      req('status','Status')
      if (data.status === 'Suspended') req('suspensionReason','Suspension reason')
      break
    default: break
  }
  return errs
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
const Field = ({ label, error, required, children, hint }: any) => (
  <div className="wiz-field">
    {label && (
      <label className="wiz-label">
        {label}{required && <span className="wiz-req">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="wiz-hint">{hint}</p>}
    {error && (
      <p className="wiz-error"><i className="ti ti-alert-circle" /> {error}</p>
    )}
  </div>
)

const Input = ({ field, formData, update, errors, type='text', placeholder='', disabled=false }: any) => (
  <input
    type={type}
    className={`wiz-input${errors[field] ? ' wiz-input--err' : formData[field] ? ' wiz-input--ok' : ''}`}
    value={formData[field] ?? ''}
    onChange={e => update(field, e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
  />
)

// Legacy Select kept for multi-selects only
// ─── DROPDOWN OPTIONS CONFIG (with icons) ─────────────────────────────────────
const DROPDOWN_OPTIONS = {
  institutionType: [
    { v:'School',       l:'School',                    icon:'ti-school',          desc:'Primary & secondary education' },
    { v:'Intermediate', l:'Intermediate',              icon:'ti-book',            desc:'Inter / Junior college'        },
    { v:'Degree College',l:'Degree College',           icon:'ti-certificate',     desc:'Undergraduate programs'        },
    { v:'Engineering',  l:'Engineering College',       icon:'ti-tools',           desc:'Technical & engineering'       },
  ],
  country: [
    { v:'',             l:'Select country…',           icon:'ti-globe',           desc:''                              },
    { v:'India',        l:'India',                     icon:'ti-map-pin',         desc:'South Asia'                    },
    { v:'United States',l:'United States',             icon:'ti-map-pin',         desc:'North America'                 },
    { v:'United Kingdom',l:'United Kingdom',           icon:'ti-map-pin',         desc:'Europe'                        },
    { v:'UAE',          l:'UAE',                       icon:'ti-map-pin',         desc:'Middle East'                   },
    { v:'Other',        l:'Other',                     icon:'ti-map-2',           desc:''                              },
  ],
  billingType: [
    { v:'Monthly',      l:'Monthly',                   icon:'ti-calendar',        desc:'Billed every month'            },
    { v:'Yearly',       l:'Yearly (Save 20%)',          icon:'ti-calendar-stats',  desc:'Best value, annual billing'    },
  ],
  board: [
    { v:'CBSE',         l:'CBSE',                      icon:'ti-certificate',     desc:'Central Board'                 },
    { v:'ICSE',         l:'ICSE',                      icon:'ti-certificate',     desc:'Council for Indian Schools'    },
    { v:'State',        l:'State Board',               icon:'ti-building',        desc:'State curriculum'              },
  ],
  timezone: [
    { v:'Asia/Kolkata',       l:'Asia/Kolkata (IST)',        icon:'ti-clock',     desc:'UTC +5:30'   },
    { v:'Asia/Dubai',         l:'Asia/Dubai (GST)',          icon:'ti-clock',     desc:'UTC +4:00'   },
    { v:'Europe/London',      l:'Europe/London (GMT)',       icon:'ti-clock',     desc:'UTC +0:00'   },
    { v:'America/New_York',   l:'America/New_York (EST)',    icon:'ti-clock',     desc:'UTC -5:00'   },
    { v:'America/Los_Angeles',l:'America/LA (PST)',          icon:'ti-clock',     desc:'UTC -8:00'   },
  ],
  currency: [
    { v:'INR', l:'INR (₹) – Indian Rupee',   icon:'ti-currency-rupee',  desc:'India'         },
    { v:'USD', l:'USD ($) – US Dollar',       icon:'ti-currency-dollar', desc:'United States' },
    { v:'EUR', l:'EUR (€) – Euro',            icon:'ti-currency-euro',   desc:'Europe'        },
    { v:'GBP', l:'GBP (£) – British Pound',  icon:'ti-currency-pound',  desc:'United Kingdom'},
    { v:'AED', l:'AED – UAE Dirham',          icon:'ti-currency',        desc:'UAE'           },
  ],
  dateFormat: [
    { v:'DD/MM/YYYY', l:'DD/MM/YYYY', icon:'ti-calendar',      desc:'Day first (common in India)' },
    { v:'MM/DD/YYYY', l:'MM/DD/YYYY', icon:'ti-calendar',      desc:'Month first (US format)'     },
    { v:'YYYY-MM-DD', l:'YYYY-MM-DD', icon:'ti-calendar',      desc:'ISO 8601 standard'           },
    { v:'DD-MM-YYYY', l:'DD-MM-YYYY', icon:'ti-calendar',      desc:'Hyphenated day first'        },
  ],
  language: [
    { v:'English', l:'English', icon:'ti-language',  desc:'' },
    { v:'Hindi',   l:'Hindi',   icon:'ti-language',  desc:'' },
    { v:'Telugu',  l:'Telugu',  icon:'ti-language',  desc:'' },
    { v:'Tamil',   l:'Tamil',   icon:'ti-language',  desc:'' },
    { v:'Spanish', l:'Spanish', icon:'ti-language',  desc:'' },
    { v:'French',  l:'French',  icon:'ti-language',  desc:'' },
    { v:'Arabic',  l:'Arabic',  icon:'ti-language',  desc:'' },
  ],
  gradingSystem: [
    { v:'Percentage', l:'Percentage (%)',    icon:'ti-percent',     desc:'0–100 scale'       },
    { v:'GPA',        l:'GPA (4.0 Scale)',   icon:'ti-star',        desc:'Grade point avg'   },
  ],
  attendanceCalculationType: [
    { v:'Daily',        l:'Daily',         icon:'ti-calendar-day',   desc:'Per day basis'      },
    { v:'Hourly',       l:'Hourly',        icon:'ti-clock-hour-4',   desc:'Per period/hour'    },
    { v:'Subject-wise', l:'Subject-wise',  icon:'ti-books',          desc:'Per subject'        },
  ],
  passwordPolicy: [
    { v:'Weak',   l:'Weak',   icon:'ti-lock-open',    desc:'6 characters minimum'            },
    { v:'Medium', l:'Medium', icon:'ti-lock',         desc:'8 chars + uppercase + number'    },
    { v:'Strong', l:'Strong', icon:'ti-lock-bolt',    desc:'10 chars + special character'    },
  ],
}

const WizCustomSelect = ({ field, formData, update, errors, options = [], placeholder = 'Select…' }: any) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // If inline options have icons/desc already use them; else fall back to DROPDOWN_OPTIONS config
  const hasRichOptions = options && options.length > 0 && (options[0].icon || options[0].desc)
  const resolvedOptions = hasRichOptions
    ? options.map((o: any) => ({ v: o.v ?? o, l: o.l ?? o, icon: o.icon || 'ti-circle', desc: o.desc || '' }))
    : DROPDOWN_OPTIONS[field as keyof typeof DROPDOWN_OPTIONS] || options.map((o: any) => ({ v: o.v ?? o, l: o.l ?? o, icon: 'ti-circle', desc: '' }))

  const selected = resolvedOptions.find((o: any) => o.v === formData[field])

  useEffect(() => {
    const handler = (e: any) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position:'relative', zIndex: open ? 999 : 'auto' }}>
      {/* Trigger */}
      <div
        className={`wiz-csel${open ? ' wiz-csel--open' : ''}${errors[field] ? ' wiz-csel--err' : ''}`}
        onClick={() => setOpen(p => !p)}
      >
        <span className="wiz-csel__left">
          {selected && selected.icon && (
            <span className="wiz-csel__icon"><i className={`ti ${selected.icon}`} /></span>
          )}
          {selected && selected.v !== '' ? (
            <span className="wiz-csel__value">{selected.l}</span>
          ) : (
            <span className="wiz-csel__placeholder">{placeholder}</span>
          )}
        </span>
        <i className={`ti ti-chevron-down wiz-csel__arrow${open ? ' wiz-csel__arrow--open' : ''}`} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="wiz-csel__dropdown">
          {resolvedOptions.filter((o: any) => o.v !== '').map((opt: any) => (
            <div
              key={opt.v}
              className={`wiz-csel__item${formData[field] === opt.v ? ' wiz-csel__item--selected' : ''}`}
              onClick={() => { update(field, opt.v); setOpen(false) }}
            >
              <span className="wiz-csel__item-icon">
                <i className={`ti ${opt.icon || 'ti-circle'}`} />
              </span>
              <span className="wiz-csel__item-text">
                <span className="wiz-csel__item-label">{opt.l}</span>
                {opt.desc && <span className="wiz-csel__item-desc">{opt.desc}</span>}
              </span>
              {formData[field] === opt.v && <i className="ti ti-check wiz-csel__check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// CustomSelect = WizCustomSelect (defined above)
const CustomSelect = WizCustomSelect

const Check = ({ id, field, formData, update, label }: any) => (
  <label className="wiz-check" htmlFor={id}>
    <input type="checkbox" id={id} checked={formData[field]} onChange={e => update(field, e.target.checked)} />
    <span className="wiz-check__box"><i className="ti ti-check" /></span>
    <span className="wiz-check__label">{label}</span>
  </label>
)

const SectionHeader = ({ icon, title, desc }: any) => (
  <div className="wiz-section-header">
    <div className="wiz-section-header__icon"><i className={icon} /></div>
    <div>
      <h3 className="wiz-section-header__title">{title}</h3>
      {desc && <p className="wiz-section-header__desc">{desc}</p>}
    </div>
  </div>
)

const ReviewRow = ({ label, value, badge }: any) => (
  <div className="wiz-review-row">
    <span className="wiz-review-row__label">{label}</span>
    {badge
      ? <span className={`wiz-badge wiz-badge--${badge}`}>{value}</span>
      : <span className="wiz-review-row__value">{value || <em style={{color:'#94a3b8'}}>—</em>}</span>
    }
  </div>
)

const PlanCard = ({ plan, selected, onSelect }: any) => {
  const meta: any = {
    Basic:        { color:'info',    icon:'ti ti-package',  price:'$29/mo',  features:['Up to 500 Students','Core Modules','50GB Storage','Email Support'] },
    Professional: { color:'warning', icon:'ti ti-star',     price:'$79/mo',  features:['Up to 1500 Students','All + Library','100GB Storage','Priority Support'] },
    Premium:      { color:'success', icon:'ti ti-crown',    price:'$199/mo', features:['Unlimited Students','All Modules','500GB Storage','24/7 Dedicated'] },
  }
  const m = meta[plan]
  return (
    <div className={`wiz-plan-card${selected ? ' wiz-plan-card--selected' : ''} wiz-plan-card--${m.color}`} onClick={() => onSelect(plan)}>
      <div className="wiz-plan-card__icon"><i className={m.icon} /></div>
      <h4 className="wiz-plan-card__name">{plan}</h4>
      <p className="wiz-plan-card__price">{m.price}</p>
      <ul className="wiz-plan-card__features">
        {m.features.map((f: string) => <li key={f}><i className="ti ti-check" />{f}</li>)}
      </ul>
      {selected && <div className="wiz-plan-card__badge"><i className="ti ti-check" /> Selected</div>}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const InstitutionSetup = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData]       = useState<any>(INIT)
  const [errors, setErrors]           = useState<any>({})
  const [submitted, setSubmitted]     = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const update = (field: string, value: any) => {
    const next = { ...formData, [field]: value }
    setFormData(next)
    if (errors[field]) {
      const newErrs = validate(currentStep, next)
      setErrors(newErrs)
    }
  }

  const goNext = () => {
    const errs = validate(currentStep, formData)
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setCurrentStep(s => Math.min(s + 1, 11))
      setErrors({})
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    setCurrentStep(s => Math.max(s - 1, 1))
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    const errs = validate(10, formData)
    if (Object.keys(errs).length > 0) { 
      setErrors(errs)
      toast.error('Please fix all errors before submitting')
      return 
    }
    
    try {
      setSubmitting(true)
      
      // Create institution via API
      await institutionService.createInstitution(formData as InstitutionFormData)
      
      toast.success('Institution created successfully!')
      setSubmitted(true)
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (error: any) {
      console.error('Error creating institution:', error)
      toast.error(error.message || 'Failed to create institution')
      setSubmitting(false)
    }
  }

  const errCount = Object.keys(errors).length
  const progress = Math.round(((currentStep - 1) / 10) * 100)

  // ── STEP RENDERS ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {

      case 1: return (
        <>
          <SectionHeader icon="ti ti-building" title="Basic Information" desc="Core details that identify your institution" />
          <div className="wiz-grid">
            <Field label="Institution Name" required error={errors.institutionName} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-building wiz-input-icon" />
                <Input field="institutionName" formData={formData} update={update} errors={errors} placeholder="e.g. Springfield High School" />
              </div>
            </Field>
            <Field label="Institution Code" required error={errors.institutionCode} hint="3–12 chars · alphanumeric, dash or underscore">
              <div className="wiz-input-wrap"><i className="ti ti-hash wiz-input-icon" />
                <Input field="institutionCode" formData={formData} update={update} errors={errors} placeholder="e.g. SPFLD001" />
              </div>
            </Field>
            <Field label="Institution Type" required error={errors.institutionType} hint="">
                              <CustomSelect field="institutionType" formData={formData} update={update} errors={errors}
                  icon="ti-building" placeholder="Select institution type..."
                  options={[
                    {v:'School',        l:'School',                 icon:'ti-school',      desc:'Primary & secondary education'},
                    {v:'Intermediate',  l:'Intermediate',           icon:'ti-book',        desc:'Inter / Junior college'},
                    {v:'Degree College',l:'Degree College',         icon:'ti-certificate', desc:'Undergraduate programs'},
                    {v:'Engineering',   l:'Engineering College',    icon:'ti-tools',       desc:'Technical & engineering'},
                  ]} />
            </Field>
            <Field label="Official Email" required error={errors.email} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-mail wiz-input-icon" />
                <Input field="email" formData={formData} update={update} errors={errors} type="email" placeholder="school@example.com" />
              </div>
            </Field>
            <Field label="Phone Number" required error={errors.phoneNumber} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-phone wiz-input-icon" />
                <Input field="phoneNumber" formData={formData} update={update} errors={errors} type="tel" placeholder="+91-9876543210" />
              </div>
            </Field>
            <Field label="Alternate Phone" error={errors.alternatePhone} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-phone-plus wiz-input-icon" />
                <Input field="alternatePhone" formData={formData} update={update} errors={errors} type="tel" placeholder="+91-9876543211" />
              </div>
            </Field>
            <div className="wiz-grid__full">
              <Field label="Website" error={errors.website} hint="Must start with https://">
                <div className="wiz-input-wrap"><i className="ti ti-world wiz-input-icon" />
                  <Input field="website" formData={formData} update={update} errors={errors} type="url" placeholder="https://www.school.edu" />
                </div>
              </Field>
            </div>
          </div>
        </>
      )

      case 2: return (
        <>
          <SectionHeader icon="ti ti-map-pin" title="Address Details" desc="Physical location of the institution" />
          <div className="wiz-grid">
            <Field label="Country" required error={errors.country} hint="">
                              <CustomSelect field="country" formData={formData} update={update} errors={errors}
                  icon="ti-globe" placeholder="Select country..."
                  options={[
                    {v:'India',         l:'India',          icon:'ti-map-pin'},
                    {v:'United States', l:'United States',  icon:'ti-map-pin'},
                    {v:'United Kingdom',l:'United Kingdom', icon:'ti-map-pin'},
                    {v:'UAE',           l:'UAE',            icon:'ti-map-pin'},
                    {v:'Other',         l:'Other',          icon:'ti-map-pin'},
                  ]} />
            </Field>
            <Field label="State" required error={errors.state} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-map wiz-input-icon" />
                <Input field="state" formData={formData} update={update} errors={errors} placeholder="e.g. Telangana" />
              </div>
            </Field>
            <Field label="District" required error={errors.district} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-map-2 wiz-input-icon" />
                <Input field="district" formData={formData} update={update} errors={errors} placeholder="e.g. Hyderabad" />
              </div>
            </Field>
            <Field label="City" required error={errors.city} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-building-skyscraper wiz-input-icon" />
                <Input field="city" formData={formData} update={update} errors={errors} placeholder="e.g. Hyderabad" />
              </div>
            </Field>
            <Field label="Area / Locality" error={errors.area} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-location wiz-input-icon" />
                <Input field="area" formData={formData} update={update} errors={errors} placeholder="e.g. Banjara Hills" />
              </div>
            </Field>
            <Field label="Pincode" required error={errors.pincode} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-mail-pin wiz-input-icon" />
                <Input field="pincode" formData={formData} update={update} errors={errors} placeholder="e.g. 500034" />
              </div>
            </Field>
            <div className="wiz-grid__full">
              <Field label="Full Address" required error={errors.fullAddress} hint="">
                <textarea className={`wiz-input wiz-textarea${errors.fullAddress ? ' wiz-input--err' : formData.fullAddress ? ' wiz-input--ok' : ''}`}
                  value={formData.fullAddress} onChange={e => update('fullAddress', e.target.value)}
                  placeholder="Door no, Street, Landmark…" rows={3} />
              </Field>
            </div>
            <div className="wiz-grid__full">
              <Field label="Google Maps Link" error={errors.googleMapsLocation} hint="Paste Google Maps URL (optional)">
                <div className="wiz-input-wrap"><i className="ti ti-brand-google-maps wiz-input-icon" />
                  <Input field="googleMapsLocation" formData={formData} update={update} errors={errors} placeholder="https://maps.google.com/…" />
                </div>
              </Field>
            </div>
          </div>
        </>
      )

      case 3: return (
        <>
          <SectionHeader icon="ti ti-user-shield" title="Admin Account" desc="Primary admin who will manage this institution" />
          <div className="wiz-grid">
            <Field label="Admin Full Name" required error={errors.adminName} hint="First and last name">
              <div className="wiz-input-wrap"><i className="ti ti-user wiz-input-icon" />
                <Input field="adminName" formData={formData} update={update} errors={errors} placeholder="e.g. John Smith" />
              </div>
            </Field>
            <Field label="Admin Email" required error={errors.adminEmail} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-mail wiz-input-icon" />
                <Input field="adminEmail" formData={formData} update={update} errors={errors} type="email" placeholder="admin@school.com" />
              </div>
            </Field>
            <Field label="Admin Phone" required error={errors.adminPhone} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-phone wiz-input-icon" />
                <Input field="adminPhone" formData={formData} update={update} errors={errors} type="tel" placeholder="+91-9876543210" />
              </div>
            </Field>
            <div className="wiz-toggle-card">
              <Check id="autoGen" field="autoGeneratePassword" formData={formData} update={update} label="Auto-generate password" />
              <p className="wiz-toggle-card__desc">A secure password will be created and sent to admin email</p>
            </div>
            {!formData.autoGeneratePassword && (<>
              <Field label="Password" required error={errors.password} hint="Min 8 chars · 1 uppercase · 1 number">
                <div className="wiz-input-wrap"><i className="ti ti-lock wiz-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`wiz-input${errors.password ? ' wiz-input--err' : formData.password ? ' wiz-input--ok' : ''}`}
                    value={formData.password ?? ''}
                    onChange={e => update('password', e.target.value)}
                    placeholder="••••••••"
                  />
                  <span
                    className={`ti ${showPassword ? 'ti-eye' : 'ti-eye-off'} wiz-eye-toggle`}
                    onClick={() => setShowPassword(p => !p)}
                  />
                </div>
                {formData.password && (
                  <div className="wiz-pwd-chips">
                    {[['Length ≥8', formData.password.length>=8],['Uppercase',/[A-Z]/.test(formData.password)],['Number',/\d/.test(formData.password)]].map(([r,ok]: any) => (
                      <span key={String(r)} className={`wiz-pwd-chip${ok?' wiz-pwd-chip--pass':''}`}><i className={`ti ti-${ok?'check':'x'}`} />{r}</span>
                    ))}
                  </div>
                )}
              </Field>
              <Field label="Confirm Password" required error={errors.confirmPassword} hint="">
                <div className="wiz-input-wrap"><i className="ti ti-lock-check wiz-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`wiz-input${errors.confirmPassword ? ' wiz-input--err' : formData.confirmPassword ? ' wiz-input--ok' : ''}`}
                    value={formData.confirmPassword ?? ''}
                    onChange={e => update('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                  />
                  <span
                    className={`ti ${showConfirmPassword ? 'ti-eye' : 'ti-eye-off'} wiz-eye-toggle`}
                    onClick={() => setShowConfirmPassword(p => !p)}
                  />
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="wiz-match"><i className="ti ti-circle-check" /> Passwords match</p>
                )}
              </Field>
            </>)}
            <div className="wiz-grid__full">
              <div className="wiz-toggle-card">
                <Check id="sendCreds" field="sendCredentialsByEmail" formData={formData} update={update} label="Send login credentials to admin email" />
                <p className="wiz-toggle-card__desc">Admin will receive their username and password via email on creation</p>
              </div>
            </div>
          </div>
        </>
      )

      case 4: return (
        <>
          <SectionHeader icon="ti ti-crown" title="Plan & Subscription" desc="Choose the right plan for this institution" />
          <div className="wiz-plan-grid">
            {['Basic','Professional','Premium'].map((p: string) => (
              <PlanCard key={p} plan={p} selected={formData.selectedPlan===p} onSelect={(v: any)=>update('selectedPlan',v)} />
            ))}
          </div>
          <div className="wiz-grid" style={{marginTop:24}}>
            <Field label="Billing Type" required error={errors.billingType} hint="">
                              <CustomSelect field="billingType" formData={formData} update={update} errors={errors}
                  icon="ti-credit-card" placeholder="Select billing type..."
                  options={[
                    {v:'Monthly', l:'Monthly',            icon:'ti-calendar'},
                    {v:'Yearly',  l:'Yearly (Save 20%)',  icon:'ti-calendar-stats'},
                  ]} />
            </Field>
            <Field label="Start Date" required error={errors.startDate} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-calendar wiz-input-icon" />
                <input type="date" className={`wiz-input${errors.startDate?' wiz-input--err':''}`}
                  value={formData.startDate} onChange={e=>update('startDate',e.target.value)} />
              </div>
            </Field>
            <Field label="End Date" required error={errors.endDate} hint="">
              <div className="wiz-input-wrap"><i className="ti ti-calendar-off wiz-input-icon" />
                <input type="date" className={`wiz-input${errors.endDate?' wiz-input--err':''}`}
                  value={formData.endDate} onChange={e=>update('endDate',e.target.value)} />
              </div>
            </Field>
            <div className="wiz-toggle-card">
              <Check id="isTrial" field="isTrial" formData={formData} update={update} label="Enable Trial Period" />
              <p className="wiz-toggle-card__desc">Institution will have limited access during trial</p>
            </div>
            {formData.isTrial && (
              <Field label="Trial Expiry Date" required error={errors.trialExpiryDate} hint="">
                <div className="wiz-input-wrap"><i className="ti ti-calendar-x wiz-input-icon" />
                  <input type="date" className={`wiz-input${errors.trialExpiryDate?' wiz-input--err':''}`}
                    value={formData.trialExpiryDate} onChange={e=>update('trialExpiryDate',e.target.value)} />
                </div>
              </Field>
            )}
            <div className="wiz-grid__full">
              <div className="wiz-resource-box">
                <div className="wiz-resource-box__header"><i className="ti ti-adjustments-horizontal" /> Resource Limits</div>
                <div className="wiz-grid" style={{padding:0}}>
                  <Field label="Max Students" required error={errors.maxStudentsLimit} hint="">
                    <div className="wiz-input-wrap"><i className="ti ti-users wiz-input-icon" />
                      <input type="number" className={`wiz-input${errors.maxStudentsLimit?' wiz-input--err':''}`}
                        value={formData.maxStudentsLimit} onChange={e=>update('maxStudentsLimit',+e.target.value)} min={1} />
                    </div>
                  </Field>
                  <Field label="Max Staff" required error={errors.maxStaffLimit} hint="">
                    <div className="wiz-input-wrap"><i className="ti ti-briefcase wiz-input-icon" />
                      <input type="number" className={`wiz-input${errors.maxStaffLimit?' wiz-input--err':''}`}
                        value={formData.maxStaffLimit} onChange={e=>update('maxStaffLimit',+e.target.value)} min={1} />
                    </div>
                  </Field>
                  <Field label="Storage Limit (GB)" required error={errors.storageLimit} hint="">
                    <div className="wiz-input-wrap"><i className="ti ti-database wiz-input-icon" />
                      <input type="number" className={`wiz-input${errors.storageLimit?' wiz-input--err':''}`}
                        value={formData.storageLimit} onChange={e=>update('storageLimit',+e.target.value)} min={1} />
                    </div>
                  </Field>
                </div>
              </div>
            </div>
          </div>
        </>
      )

      case 5: return (
        <>
          <SectionHeader icon="ti ti-puzzle" title="Module Assignment" desc={`Modules for ${formData.selectedPlan} plan`} />
          <div className="wiz-modules-section">
            <div className="wiz-modules-group">
              <div className="wiz-modules-group__header wiz-modules-group__header--primary">
                <i className="ti ti-lock" /> Core Modules — Always Included
              </div>
              <div className="wiz-modules-grid">
                {['Dashboard','Student Management','Teacher Management','Fee Management','Attendance','Examination'].map(m => (
                  <div key={m} className="wiz-module-chip wiz-module-chip--active">
                    <i className="ti ti-circle-check" /> {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="wiz-modules-group">
              <div className="wiz-modules-group__header wiz-modules-group__header--secondary">
                <i className="ti ti-adjustments" /> Optional Modules — Based on Plan
              </div>
              <div className="wiz-modules-grid">
                {[
                  { label:'Library',             avail: formData.selectedPlan!=='Basic',   plans:'Pro & Premium' },
                  { label:'Reports & Analytics', avail: formData.selectedPlan!=='Basic',   plans:'Pro & Premium' },
                  { label:'Transport',           avail: formData.selectedPlan==='Premium', plans:'Premium only'  },
                  { label:'Hostel',              avail: formData.selectedPlan==='Premium', plans:'Premium only'  },
                  { label:'Mobile App',          avail: formData.selectedPlan==='Premium', plans:'Premium only'  },
                  { label:'API Access',          avail: formData.selectedPlan==='Premium', plans:'Premium only'  },
                ].map(m => (
                  <div key={m.label} className={`wiz-module-chip${m.avail?' wiz-module-chip--active':' wiz-module-chip--locked'}`}>
                    <i className={`ti ti-${m.avail?'circle-check':'lock'}`} />
                    <span>{m.label}</span>
                    <small>{m.plans}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )

      case 6: return (
        <>
          <SectionHeader icon="ti ti-school" title="Academic Configuration" desc={`Settings for ${formData.institutionType}`} />
          <div className="wiz-grid">
            {formData.institutionType === 'School' && (<>
              <Field label="Board" required error={errors.board}>
                                  <CustomSelect field="board" formData={formData} update={update} errors={errors}
                    icon="ti-certificate" placeholder="Select board..."
                    options={[
                      {v:'CBSE',  l:'CBSE',        icon:'ti-school'},
                      {v:'ICSE',  l:'ICSE',        icon:'ti-school'},
                      {v:'State', l:'State Board',  icon:'ti-building'},
                    ]} />
              </Field>
              <Field label="Academic Year Format" error={errors.academicYearFormat} hint="e.g. YYYY-YY or YYYY-YYYY">
                <div className="wiz-input-wrap"><i className="ti ti-calendar wiz-input-icon" />
                  <Input field="academicYearFormat" formData={formData} update={update} errors={errors} placeholder="YYYY-YY" />
                </div>
              </Field>
              <Field label="Classes" error={errors.classes} hint="Ctrl+Click to multi-select">
                <select className="wiz-input wiz-multiselect" multiple value={formData.classes} style={{height:160}}
                  onChange={e=>update('classes',Array.from(e.target.selectedOptions,o=>o.value))}>
                  {['1','2','3','4','5','6','7','8','9','10','11','12'].map(c=><option key={c} value={c}>Class {c}</option>)}
                </select>
              </Field>
              <Field label="Sections" error={errors.sections} hint="Comma separated, e.g. A,B,C,D">
                <div className="wiz-input-wrap"><i className="ti ti-layout-grid wiz-input-icon" />
                  <Input field="sections" formData={formData} update={update} errors={errors} placeholder="A,B,C,D" />
                </div>
              </Field>
            </>)}
            {formData.institutionType === 'Intermediate' && (<>
              <Field label="Streams" error={errors.streams} hint="Ctrl+Click to multi-select">
                <select className="wiz-input wiz-multiselect" multiple value={formData.streams} style={{height:130}}
                  onChange={e=>update('streams',Array.from(e.target.selectedOptions,o=>o.value))}>
                  {['MPC','BIPC','CEC','MEC','HEC'].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Year Structure" error={errors.yearStructure}>
                <select className="wiz-input wiz-multiselect" multiple value={formData.yearStructure} style={{height:130}}
                  onChange={e=>update('yearStructure',Array.from(e.target.selectedOptions,o=>o.value))}>
                  {['1st Year','2nd Year'].map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
            </>)}
            {formData.institutionType === 'Degree College' && (<>
              <Field label="University Affiliation" required error={errors.universityAffiliation}>
                <div className="wiz-input-wrap"><i className="ti ti-school wiz-input-icon" />
                  <Input field="universityAffiliation" formData={formData} update={update} errors={errors} placeholder="e.g. Osmania University" />
                </div>
              </Field>
              <div className="wiz-toggle-card">
                <Check id="semSys" field="semesterSystem" formData={formData} update={update} label="Semester System" />
                <p className="wiz-toggle-card__desc">Enable if college follows semester-based academics</p>
              </div>
              <Field label="Courses Offered" error={errors.coursesOffered} hint="Ctrl+Click to select multiple">
                <select className="wiz-input wiz-multiselect" multiple value={formData.coursesOffered} style={{height:150}}
                  onChange={e=>update('coursesOffered',Array.from(e.target.selectedOptions,o=>o.value))}>
                  {['BSc','BCom','BA','BTech','BBA','MSc','MCom','MA','MTech','MBA'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Departments" error={errors.departments} hint="Comma separated">
                <div className="wiz-input-wrap"><i className="ti ti-layout-list wiz-input-icon" />
                  <input type="text" className="wiz-input"
                    value={formData.departments?.join(', ')}
                    onChange={e=>update('departments',e.target.value.split(',').map(d=>d.trim()).filter(Boolean))}
                    placeholder="Science, Commerce, Arts" />
                </div>
              </Field>
            </>)}
          </div>
        </>
      )

      case 7: return (
        <>
          <SectionHeader icon="ti ti-settings" title="System Settings" desc="Regional and operational configuration" />
          <div className="wiz-grid">
            <Field label="Timezone" required error={errors.timezone}>
                              <CustomSelect field="timezone" formData={formData} update={update} errors={errors}
                  icon="ti-clock" placeholder="Select timezone..."
                  options={[
                    {v:'Asia/Kolkata',       l:'Asia/Kolkata (IST)',    icon:'ti-clock'},
                    {v:'Asia/Dubai',         l:'Asia/Dubai (GST)',      icon:'ti-clock'},
                    {v:'Europe/London',      l:'Europe/London (GMT)',   icon:'ti-clock'},
                    {v:'America/New_York',   l:'America/New York (EST)',icon:'ti-clock'},
                    {v:'America/Los_Angeles',l:'America/LA (PST)',      icon:'ti-clock'},
                  ]} />
            </Field>
            <Field label="Currency" required error={errors.currency}>
                              <CustomSelect field="currency" formData={formData} update={update} errors={errors}
                  icon="ti-currency-rupee" placeholder="Select currency..."
                  options={[
                    {v:'INR', l:'INR (₹) – Indian Rupee',  icon:'ti-currency-rupee'},
                    {v:'USD', l:'USD ($) – US Dollar',      icon:'ti-currency-dollar'},
                    {v:'EUR', l:'EUR (€) – Euro',           icon:'ti-currency-euro'},
                    {v:'GBP', l:'GBP (£) – British Pound',  icon:'ti-currency-pound'},
                    {v:'AED', l:'AED – UAE Dirham',          icon:'ti-currency'},
                  ]} />
            </Field>
            <Field label="Date Format" error={errors.dateFormat}>
                              <CustomSelect field="dateFormat" formData={formData} update={update} errors={errors}
                  icon="ti-calendar" placeholder="Select date format..."
                  options={[
                    {v:'DD/MM/YYYY', l:'DD/MM/YYYY', icon:'ti-calendar'},
                    {v:'MM/DD/YYYY', l:'MM/DD/YYYY', icon:'ti-calendar'},
                    {v:'YYYY-MM-DD', l:'YYYY-MM-DD', icon:'ti-calendar'},
                    {v:'DD-MM-YYYY', l:'DD-MM-YYYY', icon:'ti-calendar'},
                  ]} />
            </Field>
            <Field label="Language" error={errors.language}>
                              <CustomSelect field="language" formData={formData} update={update} errors={errors}
                  icon="ti-language" placeholder="Select language..."
                  options={[
                    {v:'English', l:'English', icon:'ti-language'},
                    {v:'Hindi',   l:'Hindi',   icon:'ti-language'},
                    {v:'Telugu',  l:'Telugu',  icon:'ti-language'},
                    {v:'Tamil',   l:'Tamil',   icon:'ti-language'},
                    {v:'Spanish', l:'Spanish', icon:'ti-language'},
                    {v:'French',  l:'French',  icon:'ti-language'},
                    {v:'Arabic',  l:'Arabic',  icon:'ti-language'},
                  ]} />
            </Field>
            <Field label="Grading System" error={errors.gradingSystem}>
                              <CustomSelect field="gradingSystem" formData={formData} update={update} errors={errors}
                  icon="ti-award" placeholder="Select grading system..."
                  options={[
                    {v:'Percentage', l:'Percentage (%)',    icon:'ti-percentage'},
                    {v:'GPA',        l:'GPA (4.0 Scale)',   icon:'ti-chart-bar'},
                  ]} />
            </Field>
            <Field label="Attendance Calculation" error={errors.attendanceCalculationType}>
                              <CustomSelect field="attendanceCalculationType" formData={formData} update={update} errors={errors}
                  icon="ti-chart-bar" placeholder="Select attendance type..."
                  options={[
                    {v:'Daily',        l:'Daily',         icon:'ti-calendar-day'},
                    {v:'Hourly',       l:'Hourly',        icon:'ti-clock-hour-4'},
                    {v:'Subject-wise', l:'Subject-wise',  icon:'ti-book'},
                  ]} />
            </Field>
          </div>
        </>
      )

      case 8: return (
        <>
          <SectionHeader icon="ti ti-palette" title="Branding" desc="Customise the visual identity of the institution" />
          <div className="wiz-grid">
            <Field label="Logo Upload" hint="PNG/JPG · Max 2MB">
              <div className="wiz-upload-box">
                <i className="ti ti-cloud-upload" />
                <span>Click to upload logo</span>
                <input type="file" accept="image/*" onChange={e=>{if(e.target.files?.[0]) update('logo',e.target.files[0].name)}} />
                {formData.logo && <p className="wiz-upload-box__name"><i className="ti ti-check" /> {formData.logo}</p>}
              </div>
            </Field>
            <Field label="Favicon" hint=".ico or 32×32 PNG">
              <div className="wiz-upload-box">
                <i className="ti ti-photo" />
                <span>Click to upload favicon</span>
                <input type="file" accept="image/x-icon,image/png" onChange={e=>{if(e.target.files?.[0]) update('favicon',e.target.files[0].name)}} />
                {formData.favicon && <p className="wiz-upload-box__name"><i className="ti ti-check" /> {formData.favicon}</p>}
              </div>
            </Field>
            <Field label="Primary Color">
              <div className="wiz-color-row">
                <input type="color" className="wiz-color-swatch" value={formData.primaryColor} onChange={e=>update('primaryColor',e.target.value)} />
                <input type="text" className="wiz-input" value={formData.primaryColor} onChange={e=>update('primaryColor',e.target.value)} style={{fontFamily:'monospace'}} />
              </div>
            </Field>
            <Field label="Secondary Color">
              <div className="wiz-color-row">
                <input type="color" className="wiz-color-swatch" value={formData.secondaryColor} onChange={e=>update('secondaryColor',e.target.value)} />
                <input type="text" className="wiz-input" value={formData.secondaryColor} onChange={e=>update('secondaryColor',e.target.value)} style={{fontFamily:'monospace'}} />
              </div>
            </Field>
            <Field label="Custom Domain" error={errors.customDomain} hint="e.g. https://school.yourdomain.com">
              <div className="wiz-input-wrap"><i className="ti ti-world-www wiz-input-icon" />
                <Input field="customDomain" formData={formData} update={update} errors={errors} type="url" placeholder="https://school.edu" />
              </div>
            </Field>
            <Field label="Subdomain" hint="e.g. springfield.yourapp.com">
              <div className="wiz-input-wrap wiz-input-wrap--suffix">
                <Input field="subdomain" formData={formData} update={update} errors={errors} placeholder="springfield" />
                <span className="wiz-input-suffix">.yourapp.com</span>
              </div>
            </Field>
          </div>
        </>
      )

      case 9: return (
        <>
          <SectionHeader icon="ti ti-shield-lock" title="Security Settings" desc="Access control and authentication" />
          <div className="wiz-grid">
            <div className="wiz-toggle-card">
              <Check id="stuLogin" field="allowStudentLogin" formData={formData} update={update} label="Allow Student Login" />
              <p className="wiz-toggle-card__desc">Students can log in to the portal</p>
            </div>
            <div className="wiz-toggle-card">
              <Check id="parLogin" field="allowParentLogin" formData={formData} update={update} label="Allow Parent Login" />
              <p className="wiz-toggle-card__desc">Parents can access the parent portal</p>
            </div>
            <div className="wiz-toggle-card">
              <Check id="twoFA" field="require2FA" formData={formData} update={update} label="Require 2FA (Two-Factor Auth)" />
              <p className="wiz-toggle-card__desc">Admin must verify via OTP on every login</p>
            </div>
            <Field label="Password Policy" error={errors.passwordPolicy}>
                              <CustomSelect field="passwordPolicy" formData={formData} update={update} errors={errors}
                  icon="ti-lock" placeholder="Select password policy..."
                  options={[
                    {v:'Weak',   l:'Weak – 6 chars minimum',             icon:'ti-lock-open'},
                    {v:'Medium', l:'Medium – 8 chars + uppercase + num',  icon:'ti-lock'},
                    {v:'Strong', l:'Strong – 10 chars + special char',    icon:'ti-lock-bolt'},
                  ]} />
            </Field>
            <Field label="Session Timeout (minutes)" required error={errors.sessionTimeoutDuration} hint="5–480 minutes">
              <div className="wiz-input-wrap"><i className="ti ti-clock wiz-input-icon" />
                <input type="number" className={`wiz-input${errors.sessionTimeoutDuration?' wiz-input--err':''}`}
                  value={formData.sessionTimeoutDuration} onChange={e=>update('sessionTimeoutDuration',+e.target.value)} min={5} max={480} />
              </div>
            </Field>
          </div>
        </>
      )

      case 10: return (
        <>
          <SectionHeader icon="ti ti-toggle-right" title="Status & Control" desc="Control institutional access and permissions" />
          <div className="wiz-grid">
            <div className="wiz-grid__full">
              <Field label="Institution Status" required error={errors.status}>
                <div className="wiz-status-row">
                  {[
                    { v:'Active',    icon:'ti-circle-check',  color:'success' },
                    { v:'Suspended', icon:'ti-pause-circle',  color:'warning' },
                    { v:'Inactive',  icon:'ti-circle-x',      color:'danger'  },
                  ].map(s => (
                    <div key={s.v}
                      className={`wiz-status-card wiz-status-card--${s.color}${formData.status===s.v?' wiz-status-card--active':''}`}
                      onClick={()=>update('status',s.v)}
                    >
                      <i className={`ti ${s.icon}`} />
                      <span>{s.v}</span>
                    </div>
                  ))}
                </div>
              </Field>
            </div>
            {formData.status === 'Suspended' && (
              <div className="wiz-grid__full">
                <Field label="Suspension Reason" required error={errors.suspensionReason}>
                  <textarea className={`wiz-input wiz-textarea${errors.suspensionReason?' wiz-input--err':formData.suspensionReason?' wiz-input--ok':''}`}
                    value={formData.suspensionReason} onChange={e=>update('suspensionReason',e.target.value)}
                    placeholder="Describe the reason for suspension…" rows={3} />
                </Field>
              </div>
            )}
            <div className="wiz-toggle-card">
              <Check id="impersonation" field="allowImpersonation" formData={formData} update={update} label="Allow Super Admin Impersonation" />
              <p className="wiz-toggle-card__desc">Super admin can log in as institution admin for support</p>
            </div>
            <div className="wiz-toggle-card">
              <Check id="apiAccess" field="allowAPIAccess" formData={formData} update={update} label="Allow API Access" />
              <p className="wiz-toggle-card__desc">Enable third-party integrations via REST API</p>
            </div>
          </div>
        </>
      )

      case 11: return (
        <>
          <SectionHeader icon="ti ti-clipboard-check" title="Review & Confirm" desc="Verify all details before creating the institution" />
          <div className="wiz-review-grid">
            {[
              { title:'Basic Information', icon:'ti ti-building', rows:[
                {l:'Name',v:formData.institutionName},{l:'Code',v:formData.institutionCode},
                {l:'Type',v:formData.institutionType},{l:'Email',v:formData.email},
                {l:'Phone',v:formData.phoneNumber},{l:'Website',v:formData.website},
              ]},
              { title:'Address', icon:'ti ti-map-pin', rows:[
                {l:'City / State',v:`${formData.city}, ${formData.state}`},
                {l:'Country',v:formData.country},{l:'Pincode',v:formData.pincode},
                {l:'Address',v:formData.fullAddress},
              ]},
              { title:'Admin Account', icon:'ti ti-user-shield', rows:[
                {l:'Admin Name',v:formData.adminName},{l:'Admin Email',v:formData.adminEmail},
                {l:'Admin Phone',v:formData.adminPhone},
                {l:'Password',v:formData.autoGeneratePassword?'Auto-generated':'Manual'},
                {l:'Send Credentials',v:formData.sendCredentialsByEmail?'Yes':'No'},
              ]},
              { title:'Plan & Subscription', icon:'ti ti-crown', rows:[
                {l:'Plan',v:formData.selectedPlan,badge:formData.selectedPlan==='Premium'?'success':formData.selectedPlan==='Professional'?'warning':'info'},
                {l:'Billing',v:formData.billingType},
                {l:'Period',v:`${formData.startDate} → ${formData.endDate}`},
                {l:'Limits',v:`${formData.maxStudentsLimit} Students · ${formData.maxStaffLimit} Staff · ${formData.storageLimit}GB`},
              ]},
              { title:'System & Security', icon:'ti ti-shield-lock', rows:[
                {l:'Timezone',v:formData.timezone},{l:'Currency',v:formData.currency},
                {l:'Language',v:formData.language},{l:'Grading',v:formData.gradingSystem},
                {l:'Student Login',v:formData.allowStudentLogin?'Allowed':'Disabled'},
                {l:'2FA',v:formData.require2FA?'Required':'Not required'},
              ]},
              { title:'Status & Control', icon:'ti ti-toggle-right', rows:[
                {l:'Status',v:formData.status,badge:formData.status==='Active'?'success':formData.status==='Suspended'?'warning':'danger'},
                {l:'Impersonation',v:formData.allowImpersonation?'Allowed':'Not allowed'},
                {l:'API Access',v:formData.allowAPIAccess?'Enabled':'Disabled'},
              ]},
            ].map(section => (
              <div key={section.title} className="wiz-review-card">
                <div className="wiz-review-card__header">
                  <i className={section.icon} /> {section.title}
                </div>
                <div className="wiz-review-card__body">
                  {section.rows.map(r => <ReviewRow key={r.l} label={r.l} value={r.v} badge={r.badge} />)}
                </div>
              </div>
            ))}
          </div>
        </>
      )

      default: return null
    }
  }

  // ── SUBMITTED ────────────────────────────────────────────────────────────────
  if (submitted) return (
    <div className="wiz-success">
      <div className="wiz-success__icon"><i className="ti ti-building-plus" /></div>
      <h2>Institution Created!</h2>
      <p>Your institution has been set up successfully. Redirecting to dashboard…</p>
      <div className="wiz-success__bar"><div className="wiz-success__bar-fill" /></div>
    </div>
  )

  return (
    <div className="wiz-page">

      {/* ── PAGE HEADER ── */}
      <div className="wiz-page-header">
        <div className="wiz-page-header__left">
      
          <div>
            <h1 className="wiz-page-header__title">Enter Institution Details</h1>
            <p className="wiz-page-header__sub">Complete all steps to set up the institution</p>
          </div>
        </div>
        <div className="wiz-page-header__right">
          <div className="wiz-progress-pill">
            <span>{currentStep} of 11</span>
            <div className="wiz-progress-pill__bar">
              <div className="wiz-progress-pill__fill" style={{width:`${progress}%`}} />
            </div>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <div className="wiz-layout">

        {/* ── LEFT SIDEBAR — STEP NAV ── */}
        <aside className="wiz-sidebar">
          <div className="wiz-sidebar__inner">
            {STEPS.map(s => {
              const done   = s.id < currentStep
              const active = s.id === currentStep
              return (
                <div
                  key={s.id}
                  className={`wiz-step${done?' wiz-step--done':active?' wiz-step--active':''}`}
                  onClick={() => done && setCurrentStep(s.id)}
                  style={{cursor: done ? 'pointer' : 'default'}}
                >
                  <div className="wiz-step__circle">
                    {done ? <i className="ti ti-check" /> : <i className={s.icon} />}
                  </div>
                  <div className="wiz-step__text">
                    <span className="wiz-step__num">Step {s.id}</span>
                    <span className="wiz-step__label">{s.label}</span>
                  </div>
                  {active && <div className="wiz-step__dot" />}
                </div>
              )
            })}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="wiz-main">

          {/* Error banner */}
          {errCount > 0 && (
            <div className="wiz-err-banner">
              <i className="ti ti-alert-triangle" />
              <div>
                <strong>Please fill these {errCount} {errCount>1?'fields':'field'} before continuing</strong>
                <ul>{Object.values(errors).map((e: any,i: number)=><li key={i}>{e}</li>)}</ul>
              </div>
            </div>
          )}

          {/* Step card */}
          <div className="wiz-card">
            {renderStep()}
          </div>

          {/* Footer nav */}
          <div className="wiz-footer-nav">
            <button className="wiz-btn wiz-btn--ghost" onClick={goPrev} disabled={currentStep===1}>
              <i className="ti ti-chevron-left" /> Previous
            </button>
            <div className="wiz-footer-nav__steps">
              {STEPS.map(s => (
                <div key={s.id}
                  className={`wiz-dot${s.id===currentStep?' wiz-dot--active':s.id<currentStep?' wiz-dot--done':''}`}
                  onClick={() => s.id < currentStep && setCurrentStep(s.id)}
                />
              ))}
            </div>
            {currentStep === 11 ? (
              <button 
                className="wiz-btn wiz-btn--success" 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ti ti-building-plus" /> Create Institution
                  </>
                )}
              </button>
            ) : (
              <button className="wiz-btn wiz-btn--primary" onClick={goNext}>
                Next <i className="ti ti-chevron-right" />
              </button>
            )}
          </div>

        </main>
      </div>

  
    </div>
  )
}

export default InstitutionSetup
