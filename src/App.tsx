import { useEffect, useRef, useState } from 'react'
import DashboardShell from './components/ui/DashboardShell'
import ConfirmationPage from './components/pages/ConfirmationPage'
import DashboardPage from './components/pages/DashboardPage'
import FailedVerificationPage from './components/pages/FailedVerificationPage'
import HistoryPage from './components/pages/HistoryPage'
import HomePage from './components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import OnboardingPage from './components/pages/OnboardingPage'
import ProductsPage from './components/pages/ProductsPage'
import SettingsPage from './components/pages/SettingsPage'
import VerificationProgressPage from './components/pages/VerificationProgressPage'
import VerificationPage from './components/pages/VerificationPage'
import { getCurrentUser, login, register, type AuthSession } from './api/auth'
import { fetchProfile, saveProfile } from './api/profile'
import { fetchSubmissions, saveSubmission } from './api/submissions'
import {
  countries,
  categories,
  defaultReport,
  historyEvents as initialHistoryEvents,
  initialForm,
  platforms,
  products as initialProducts,
} from './data/mockData'
import type {
  AuditEvent,
  ProductRecord,
  Route,
  UploadedFile,
  VerificationForm,
  VerificationReport,
  VerificationStatus,
} from './types/app'

const SESSION_STORAGE_KEY = 'ecoverify-session'
const PROTECTED_ROUTES: Route[] = ['verification', 'confirmation', 'failure', 'badge', 'dashboard', 'products', 'history', 'settings']

function parseRoute(path: string): Route {
  const normalizedPath = path.replace(/^\/+/, '').replace(/\/+$/, '')

  switch (normalizedPath) {
    case 'login':
    case 'register':
    case 'onboarding':
    case 'verification':
    case 'confirmation':
    case 'failure':
    case 'badge':
    case 'dashboard':
    case 'products':
    case 'history':
    case 'settings':
      return normalizedPath
    default:
      return 'home'
  }
}

function getCurrentRoute(): Route {
  const hashRoute = window.location.hash.replace(/^#\/?/, '')
  if (hashRoute) {
    const cleanRoute = parseRoute(hashRoute)
    const cleanPath = cleanRoute === 'home' ? '/' : `/${cleanRoute}`
    window.history.replaceState(null, '', cleanPath)
    return cleanRoute
  }

  return parseRoute(window.location.pathname)
}

function goTo(route: Route) {
  const nextPath = route === 'home' ? '/' : `/${route}`
  if (window.location.pathname === nextPath && !window.location.hash) return
  window.history.pushState(null, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function formatPrettyDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function buildEvidence(files: UploadedFile[]) {
  if (files.length === 0) return defaultReport.evidence

  return files.map((file, index) => ({
    id: `${index}-${file.name}`,
    label: file.type.includes('pdf') ? 'Supplier document' : 'Material photo set',
    source: file.type.includes('pdf') ? 'OCR invoice parse' : 'Computer vision audit',
    redactedPreview: `${file.name.replace(/[A-Za-z0-9]/g, '*')} | Parsed fields: supplier, batch, destination`,
    verified: true,
  }))
}

function buildOcrSummary(files: UploadedFile[], category: string) {
  const base = [
    `OCR extracted document fields from ${files.length || 1} uploaded proof item(s).`,
    `Computer vision compared image metadata against the ${category || 'selected'} sustainability claim.`,
  ]

  if (files.some((file) => file.name.toLowerCase().includes('manifest'))) {
    base.push('Shipping manifest route and batch reference matched the merchant record.')
  } else {
    base.push('Registry cross-check could not confirm every shipment reference automatically.')
  }

  return base
}

function inferStatus(files: UploadedFile[], category: string): VerificationStatus {
  const names = files.map((file) => file.name.toLowerCase())
  const suspicious = names.some((name) =>
    ['draft', 'sample', 'blur', 'edited', 'mock'].some((keyword) => name.includes(keyword)),
  )

  if (suspicious) return 'Flagged'
  if (files.length === 0 || !category) return 'In Review'
  return 'Verified'
}

function buildReport(form: VerificationForm): VerificationReport {
  const now = new Date()
  const status = inferStatus(form.files, form.sustainabilityCategory)
  const category = form.sustainabilityCategory || 'Organic & Natural'
  const evidence = buildEvidence(form.files)
  const ocrSummary = buildOcrSummary(form.files, category)

  const badgeTier =
    status === 'Verified'
      ? form.files.length >= 3
        ? 'Gold'
        : 'Silver'
      : status === 'In Review'
        ? form.files.length > 0
          ? 'Silver'
          : 'Bronze'
        : 'Bronze'

  const anomalies =
    status === 'Flagged'
      ? [
          'One or more uploaded files appear edited or incomplete.',
          'Supplier reference mismatch requires manual human review before publication.',
        ]
      : []

  const verifiedAt = formatPrettyDate(now)
  const nextRefresh = new Date(now)
  nextRefresh.setDate(nextRefresh.getDate() + (badgeTier === 'Gold' ? 90 : badgeTier === 'Silver' ? 365 : 30))

  const auditTrail: AuditEvent[] = [
    {
      id: '1',
      title: 'Merchant submission received',
      detail: `${form.businessName} in ${form.country} uploaded ${form.files.length || 1} evidence item(s) for ${form.productName}.`,
      when: formatDateTime(now),
    },
    {
      id: '2',
      title: 'OCR and computer vision pass completed',
      detail: 'Structured data fields were extracted and checked against the selected claim category.',
      when: formatDateTime(new Date(now.getTime() + 60_000)),
    },
    {
      id: '3',
      title: status === 'Verified' ? 'Dynamic badge issued' : 'Manual review queued',
      detail:
        status === 'Verified'
          ? `${badgeTier} badge generated and storefront widget marked ready for deployment.`
          : 'Evidence has been held for human validation before the badge can go live.',
      when: formatDateTime(new Date(now.getTime() + 180_000)),
    },
  ]

  return {
    productName: form.productName,
    category,
    status,
    badgeTier,
    badgeMessage:
      status === 'Verified'
        ? badgeTier === 'Gold'
          ? '100% Organic.'
          : 'Eco-Verified.'
        : status === 'In Review'
          ? 'Evidence received. Your submission is being reviewed before a badge can be issued.'
          : 'Verification blocked pending manual anomaly review.',
    freshnessLabel:
      status === 'Verified'
        ? badgeTier === 'Gold'
          ? 'Fresh verification: valid for 90 days'
          : 'Verified archive state: valid for 1 year'
        : badgeTier === 'Silver'
          ? 'Review state: publication pending'
          : 'Freshness not published while review is open',
    verifiedAt,
    nextRefreshDue: formatPrettyDate(nextRefresh),
    confidenceScore:
      status === 'Verified' ? '99.1%' : status === 'In Review' ? '92.4%' : '71.6%',
    conversionLift:
      status === 'Verified' ? '+15%' : status === 'In Review' ? '+6% projected' : '+2% projected',
    integrityRate: status === 'Flagged' ? 'Needs review' : '99%',
    auditHash: `0xEV-${form.platform.slice(0, 3).toUpperCase()}-${verifiedAt.replace(/[^0-9]/g, '').slice(0, 8)}-${form.productName.slice(0, 4).toUpperCase()}`,
    widgetStatus: status === 'Verified' ? 'Connected' : status === 'In Review' ? 'Pending' : 'Action Needed',
    storeSyncStatus: form.platform === 'Custom Storefront' ? 'Pending' : 'Connected',
    ocrSummary,
    anomalies,
    evidence,
    auditTrail,
  }
}

function App() {
  const [route, setRoute] = useState<Route>(() => getCurrentRoute())
  const [form, setForm] = useState<VerificationForm>(initialForm)
  const [session, setSession] = useState<AuthSession | null>(() => {
    const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY)
    return savedSession ? JSON.parse(savedSession) : null
  })
  const [authMode, setAuthMode] = useState<'login' | 'register'>(() => getCurrentRoute() === 'register' ? 'register' : 'login')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [onboardingSaving, setOnboardingSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [report, setReport] = useState<VerificationReport>(defaultReport)
  const [productRows, setProductRows] = useState<ProductRecord[]>(initialProducts)
  const [activity, setActivity] = useState(initialHistoryEvents)
  const [dashboardUnlocked, setDashboardUnlocked] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const syncRoute = () => {
      const nextRoute = getCurrentRoute()
      setRoute(nextRoute)
      if (nextRoute === 'login' || nextRoute === 'register') {
        setAuthMode(nextRoute)
      }
    }
    window.addEventListener('popstate', syncRoute)
    syncRoute()

    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadSavedSubmissions() {
      if (!session?.accessToken) return

      try {
        const user = await getCurrentUser(session.accessToken)
        const profile = await fetchProfile(session.accessToken)
        if (!ignore) {
          setForm((current) => ({
            ...current,
            ...profile,
            contactEmail: profile.contactEmail || user.email || current.contactEmail,
            contactPhone: profile.contactPhone || user.phoneNumber || current.contactPhone,
          }))
        }

        const submissions = await fetchSubmissions(session.accessToken)
        if (ignore || submissions.length === 0) return

        const [latestSubmission] = submissions
        setForm((current) => ({ ...current, ...latestSubmission.form, consent: false }))
        setReport(latestSubmission.report)
        setProductRows(submissions.map((submission) => submission.product))
        setActivity(submissions.map((submission) => submission.activity))
      } catch (error) {
        console.error(error)
        if (!ignore) {
          setSession(null)
          window.localStorage.removeItem(SESSION_STORAGE_KEY)
        }
      }
    }

    loadSavedSubmissions()

    return () => {
      ignore = true
    }
  }, [session?.accessToken])

  useEffect(() => {
    if (route !== 'badge') return

    const timeout = window.setTimeout(
      () => navigate(report.status === 'Flagged' ? 'failure' : 'confirmation'),
      1800,
    )
    return () => window.clearTimeout(timeout)
  }, [report.status, route])

  function navigate(nextRoute: Route) {
    if (PROTECTED_ROUTES.includes(nextRoute) && !session?.accessToken) {
      setAuthMode('login')
      goTo('login')
      return
    }

    if (nextRoute === 'login' || nextRoute === 'register') {
      setAuthMode(nextRoute)
      setAuthError('')
    }

    if (nextRoute === 'dashboard') {
      setDashboardUnlocked(true)
    }
    goTo(nextRoute)
  }

  function updateField<K extends keyof VerificationForm>(key: K, value: VerificationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function addFiles(fileList: FileList | null) {
    const nextFiles = Array.from(fileList ?? [])
      .filter((file) => file.size <= 10 * 1024 * 1024)
      .map((file) => ({ name: file.name, size: file.size, type: file.type }))

    if (nextFiles.length > 0) {
      updateField('files', [...form.files, ...nextFiles])
    }
  }

  function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    addFiles(event.dataTransfer.files)
  }

  function removeFile(index: number) {
    updateField(
      'files',
      form.files.filter((_, currentIndex) => currentIndex !== index),
    )
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  async function copyEmbedCode() {
    const badgeColor =
      report.badgeTier === 'Gold' ? 'gold' : report.badgeTier === 'Silver' ? 'silver' : 'bronze'

    const embedCode = `<div class="eco-verify-badge" data-product-id="${form.productName.toLowerCase().replace(/\s+/g, '-')}">
  <img src="https://eco-verify.com/badges/${badgeColor}.svg" alt="Eco-Verified: ${report.badgeTier}">
</div>
<script src="https://eco-verify.com/widget.js"></script>`

    await navigator.clipboard.writeText(embedCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError('')

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim().toLowerCase()
    const phoneNumber = String(formData.get('phoneNumber') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!email || !password) {
      setAuthError('Email and password are required.')
      return
    }

    if (authMode === 'register') {
      if (!phoneNumber) {
        setAuthError('Phone number is required.')
        return
      }

      if (password.length < 8) {
        setAuthError('Password must be at least 8 characters.')
        return
      }

      if (password !== confirmPassword) {
        setAuthError('Passwords do not match.')
        return
      }
    }

    try {
      setAuthLoading(true)
      const nextSession = authMode === 'register'
        ? await register(email, password, phoneNumber)
        : await login(email, password)

      if (!nextSession.accessToken) {
        throw new Error('The backend did not return an access token.')
      }

      setSession(nextSession)
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession))
      updateField('contactEmail', nextSession.user.email ?? email)
      if (nextSession.user.phoneNumber || phoneNumber) {
        updateField('contactPhone', nextSession.user.phoneNumber ?? phoneNumber)
      }
      navigate('onboarding')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function submitOnboarding(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.accessToken) {
      navigate('login')
      return
    }

    try {
      setOnboardingSaving(true)
      const savedProfile = await saveProfile(
        {
          businessName: form.businessName,
          country: form.country,
          platform: form.platform,
          website: form.website,
          contactName: form.contactName,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
        },
        session.accessToken,
      )
      setForm((current) => ({ ...current, ...savedProfile }))
      navigate('verification')
    } catch (error) {
      console.error(error)
      window.alert('Your profile could not be saved. Check that the backend is running and try again.')
    } finally {
      setOnboardingSaving(false)
    }
  }

  async function submitVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextReport = buildReport(form)

    try {
      if (!session?.accessToken) {
        navigate('login')
        return
      }

      const savedSubmission = await saveSubmission(form, nextReport, session.accessToken)
      setReport(savedSubmission.report)
      setForm((current) => ({ ...current, consent: false }))
      setProductRows((current) => [
        savedSubmission.product,
        ...current.filter((item) => item.name !== savedSubmission.product.name),
      ])
      setActivity((current) => [savedSubmission.activity, ...current])
      navigate('badge')
    } catch (error) {
      console.error(error)
      window.alert('The submission could not be saved. Check that the backend is running and Supabase environment variables are set.')
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#1b4332]">
      {route === 'home' && (
        <HomePage
          onLogin={() => navigate('login')}
          onRegister={() => navigate('register')}
          onOpenDashboard={() => navigate('dashboard')}
        />
      )}

      {(route === 'login' || route === 'register') && (
        <LoginPage
          onBackHome={() => navigate('home')}
          onSubmit={submitLogin}
          mode={authMode}
          authError={authError}
          isLoading={authLoading}
          onModeChange={(nextMode) => {
            setAuthError('')
            setAuthMode(nextMode)
            goTo(nextMode)
          }}
        />
      )}

      {route === 'onboarding' && (
        <OnboardingPage
          form={form}
          onBack={() => navigate('login')}
          onSubmit={submitOnboarding}
          onChange={updateField}
          isSaving={onboardingSaving}
          countries={countries}
          platforms={platforms}
        />
      )}

      {route === 'verification' && (
        dashboardUnlocked ? (
        <DashboardShell route="verification" onNavigate={navigate}>
          <VerificationPage
            form={form}
            categories={categories}
            onBack={() => navigate('dashboard')}
            onChange={updateField}
            addFiles={addFiles}
            removeFile={removeFile}
            formatSize={formatSize}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            handleFileDrop={handleFileDrop}
            fileInputRef={fileInputRef}
            submitVerification={submitVerification}
          />
        </DashboardShell>
        ) : (
        <VerificationPage
          form={form}
          categories={categories}
          onBack={() => navigate('onboarding')}
          onChange={updateField}
          addFiles={addFiles}
          removeFile={removeFile}
          formatSize={formatSize}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          handleFileDrop={handleFileDrop}
          fileInputRef={fileInputRef}
          submitVerification={submitVerification}
        />
        )
      )}

      {route === 'confirmation' && (
        dashboardUnlocked ? (
        <DashboardShell route="confirmation" onNavigate={navigate}>
          <ConfirmationPage
            actionLabel="Continue to Dashboard"
            copied={copied}
            copyEmbedCode={copyEmbedCode}
            displayMode="badge-only"
            hasBadge={true}
            merchantName={form.businessName}
            report={report}
            onGoDashboard={() => navigate('dashboard')}
          />
        </DashboardShell>
        ) : (
        <ConfirmationPage
          actionLabel="Continue to Dashboard"
          copied={copied}
          copyEmbedCode={copyEmbedCode}
          hasBadge={true}
          merchantName={form.businessName}
          report={report}
          onGoDashboard={() => navigate('dashboard')}
        />
        )
      )}

      {route === 'failure' && (
        dashboardUnlocked ? (
        <DashboardShell route="confirmation" onNavigate={navigate}>
          <FailedVerificationPage
            merchantName={form.businessName}
            report={report}
            onRetry={() => navigate('verification')}
            onGoDashboard={() => navigate('dashboard')}
          />
        </DashboardShell>
        ) : (
        <FailedVerificationPage
          merchantName={form.businessName}
          report={report}
          onRetry={() => navigate('verification')}
          onGoDashboard={() => navigate('dashboard')}
        />
        )
      )}

      {route === 'badge' && (
        <VerificationProgressPage />
      )}

      {route === 'dashboard' && (
        <DashboardShell route="dashboard" onNavigate={navigate}>
          <DashboardPage
            merchantName={form.businessName}
            report={report}
            totalClaimsSubmitted={productRows.length}
            queue={productRows}
            activity={activity}
            onStartVerification={() => navigate('verification')}
          />
        </DashboardShell>
      )}

      {route === 'products' && (
        <DashboardShell route="products" onNavigate={navigate}>
          <ProductsPage onNewVerification={() => navigate('verification')} rows={productRows} />
        </DashboardShell>
      )}

      {route === 'history' && (
        <DashboardShell route="history" onNavigate={navigate}>
          <HistoryPage
            onNewVerification={() => navigate('verification')}
            events={activity}
            report={report}
          />
        </DashboardShell>
      )}

      {route === 'settings' && (
        <DashboardShell route="settings" onNavigate={navigate}>
          <SettingsPage onNewVerification={() => navigate('verification')} report={report} />
        </DashboardShell>
      )}
    </main>
  )
}

export default App
