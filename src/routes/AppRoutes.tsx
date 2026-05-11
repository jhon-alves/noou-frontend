import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { PrivateRoute } from "./PrivateRoute"
import { PublicRoute } from "./PublicRoute"
import Login from "@/pages/auth/Login"
import TwoFactorAuthPage from "@/pages/auth/TwoFactorAuthPage"
import NotFound from "@/pages/NotFound"

// Loadings
import { PageLoader } from "@/components/shared/PageLoader"
import { PromptPageSkeleton } from "@/components/prompts/PromptPageSkeleton"
import { ContentDetailsSkeleton } from "@/components/contents/ContentDetailsSkeleton"

// Direct imports for high-traffic pages (instant navigation)
import Dashboard from "@/pages/home/Index"
import PromptLibraryPage from "@/pages/prompts/PromptLibrary"
import AgentPage from "@/pages/agent/AgentPage"
import AgentPreviewPage from "@/pages/agent/AgentPreviewPage"
import AccountPage from "@/pages/account/AccountPage"
import KnowledgePage from "@/pages/knowledge/KnowledgePage"
import ContentsPage from "@/pages/contents/ContentsPage"
import ContentDetailsPage from "@/pages/contents/ContentDetailsPage"
import BusinessPage from "@/pages/business/BusinessPage"
import BusinessDetailsPage from "@/pages/business/BusinessDetailsPage"
import BusinessSecretPage from "@/pages/business/BusinessSecretPage"
import AdminPage from "@/pages/AdminPage"

// Lazy load infrequent pages
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"))
const RecoverPassword = lazy(() => import("@/pages/auth/RecoverPassword"))
const AcceptInvitationPage = lazy(() => import("@/pages/AcceptInvitation"))
const PrivacyPage = lazy(() => import("@/pages/PrivacyPage"))
const FaqPage = lazy(() => import("@/pages/FaqPage"))
const PromptDetailsPage = lazy(() => import("@/pages/prompts/PromptDetailsPage"))

export const AppRoutes = () => (
  <Routes>
    <Route element={<PublicRoute />}>
      <Route path="/" element={<Login />} />
      <Route path="/twofactor" element={<TwoFactorAuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/recover-password/:token" element={<RecoverPassword />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Route>
    <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route
        path="/prompts"
        element={
          <Suspense fallback={<PromptPageSkeleton />}>
            <PromptLibraryPage />
          </Suspense>
        }
      />
      <Route
        path="/prompts/:promptId"
        element={
          <Suspense fallback={<PageLoader />}>
            <PromptDetailsPage />
          </Suspense>
        }
      />
      <Route path="/agent" element={<AgentPage />} />
      <Route path="/agent/preview" element={<AgentPreviewPage />} />
      <Route
        path="/change-password/:token"
        element={
          <Suspense fallback={<PageLoader />}>
            <AccountPage />
          </Suspense>
        }
      />
      <Route
        path="/account"
        element={
          <Suspense fallback={<PageLoader />}>
            <AccountPage />
          </Suspense>
        }
      />
      <Route
        path="/knowledge"
        element={
          <Suspense fallback={<PageLoader />}>
            <KnowledgePage />
          </Suspense>
        }
      />
      <Route path="/contents" element={<ContentsPage />} />
      <Route
        path="/contents/:contentId"
        element={
          <Suspense fallback={<ContentDetailsSkeleton />}>
            <ContentDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="/business"
        element={
          <Suspense fallback={<PageLoader />}>
            <BusinessPage />
          </Suspense>
        }
      />
      <Route
        path="/business/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <BusinessDetailsPage />
          </Suspense>
        }
      />
      <Route
        path="/business/:id/secrets"
        element={
          <Suspense fallback={<PageLoader />}>
            <BusinessSecretPage />
          </Suspense>
        }
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/privacy-policy" element={<PrivacyPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)
