import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Crie sua conta grátis
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <a href="/login" className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">
              faça login na sua conta existente
            </a>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
